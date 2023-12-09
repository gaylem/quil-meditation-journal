//** TOKEN UTILITY FUNCTIONS */

/* Includes:
    1. createTokens - generates unique access and refresh tokens for user authentication
    2. refreshTokens - refreshes the access token

    Both functions are called by the userController
*/

// Import required modules
import dotenv from 'dotenv';
dotenv.config();
import { User } from '../db/models.js';
import jwt from 'jsonwebtoken';

/**
 * @description Create access and refresh tokens using the provided object.
 * @param {Object} obj - The object to be used for token creation.
 * @returns {Object} - An object containing access and refresh tokens.
 * @throws {Error} - Throws an error if input is not an object or secret keys are missing.
 */
export const createTokens = payload => {
  // Assign private key to variable
  const secretKey = process.env.SECRET_KEY;
  // Validate input
  try {
    // Check if input is an object
    if (typeof payload !== 'object') {
      throw new Error('Input must be an object');
    }
    // Check for secret keys
    if (!secretKey) {
      throw Error('Private key is missing');
    }
    // Set access token options
    const accessTokenOptions = {
      algorithm: 'HS256',
      expiresIn: '1h',
    };
    // Set refresh token options
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
export const refreshTokens = async refreshToken => {
  // Assign private key to variable
  const secretKey = process.env.SECRET_KEY;
  try {
    // Thow an error if secretKey returns false
    if (!secretKey) {
      throw Error('Private key is missing');
    }
    // Decode the refresh token
    const decoded = jwt.verify(refreshToken, secretKey, { algorithms: ['HS256'] });
    // Create a payload object for the createTokens function
    const payload = {
      userId: decoded.userId,
      username: decoded.username,
    };
    // Remove the current refreshToken from the database
    const user = await User.findOneAndUpdate({ _id: decoded.userId }, { $pull: { refreshTokens: refreshToken } });
    // If nothing is returned, throw an error
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      throw Error('Invalid refresh token or not stored');
    }
    // Deconstruct properties of result after createTokens function is invoked
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = createTokens(payload);
    // Add the new refresh token to the databas
    await User.findOneAndUpdate({ _id: decoded.userId }, { $push: { refreshTokens: newRefreshToken } }, { new: true });
    // Return the new access token and new refresh token to the authUser controller
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    return {
      log: `refreshTokens: ERROR ${error}`,
      status: 500,
      message: 'Internal Server Error: Something went wrong. Please try again later.',
    };
  }
};

