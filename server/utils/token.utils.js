//** TOKEN UTILITY FUNCTIONS */

/* Includes:
    1. createTokens - generates unique access and refresh tokens for user authentication
    2. refreshTokens - refreshes the access token

    Both functions are called by the userController
*/

// Import required modules
require('dotenv').config();
const { User } = require('../db/models');
const jwt = require('jsonwebtoken');

/**
 * @description Create access and refresh tokens using the provided object.
 * @param {Object} obj - The object to be used for token creation.
 * @returns {Object} - An object containing access and refresh tokens.
 * @throws {Error} - Throws an error if input is not an object or secret keys are missing.
 */
const createTokens = payload => {
  // Assign private key to variable
  const secretKey = process.env.SECRET_KEY;

  try {
    // Validate input
    if (typeof payload !== 'object') {
      throw new Error('Input must be an object');
    }
    // Check for secret keys
    if (!secretKey) {
      throw Error('Private key is missing');
    }
    // Sign tokens using HS256 algorithm and set expiration
    const accessTokenOptions = {
      algorithm: 'HS256',
      expiresIn: '1h',
    };

    const refreshTokenOptions = {
      algorithm: 'HS256',
      expiresIn: '48h',
    };

    // Sign the tokens
    const accessToken = jwt.sign(payload, secretKey, accessTokenOptions);
    const refreshToken = jwt.sign(payload, secretKey, refreshTokenOptions);

    // Return tokens and key
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error creating token:', error);
    throw Error('Failed to create token');
  }
};

/**
 * @description Refreshes access tokens.
 * @param {String} refreshToken - The refresh token
 * @returns {Object} - JSON with new accessToken and refreshToken
 */
const refreshTokens = async refreshToken => {
  // Assign private key to variable
  const secretKey = process.env.SECRET_KEY;
  try {
    if (!secretKey) {
      throw Error('Private key is missing');
    }
    const decoded = jwt.verify(refreshToken, secretKey, { algorithms: ['HS256'] });

    const payload = {
      userId: decoded.userId,
      username: decoded.username,
    };

    const user = await User.findOneAndUpdate({ _id: decoded.userId }, { $pull: { refreshTokens: refreshToken } });

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      throw Error('Invalid refresh token or not stored');
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = createTokens(payload);

    await User.findOneAndUpdate({ _id: decoded.userId }, { $push: { refreshTokens: newRefreshToken } }, { new: true });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    return {
      log: `refreshTokens: ERROR ${error}`,
      status: 500,
      message: 'Internal Server Error: Something went wrong. Please try again later.',
    };
  }
};

module.exports = { createTokens, refreshTokens };
