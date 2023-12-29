//** TOKEN UTILITY FUNCTIONS */

/* Includes:
    1. createTokens - Generates unique access and refresh tokens for user authentication.
    2. verifyAccessToken - Verifies the access token.
    3. checkTokenExpiration - Checks if the decoded access token has expired.
    4. refreshTokensAndDatabase - Refreshes access and refresh tokens and updates the database.
    5. updateAuthorizationHeadersAndCookies - Updates authorization headers and cookies with new tokens.
    6. handleExpiredToken - Handles the scenario when the access token has expired.

    All functions are called by the userController.
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
  // Assign secret key to variable
  const secretKey = process.env.SECRET_KEY;
  // Validate input
  try {
    // Check if input is an object
    if (typeof payload !== 'object') {
      throw new Error('Input must be an object');
    }
    // Set access token options
    const accessTokenOptions = {
      algorithm: 'HS256',
      expiresIn: '30m',
    };
    // Set refresh token options
    const refreshTokenOptions = {
      algorithm: 'HS256',
      expiresIn: '12h',
    };
    // Sign the tokens
    const accessToken = jwt.sign(payload, secretKey, accessTokenOptions);
    const refreshToken = jwt.sign(payload, secretKey, refreshTokenOptions);
    // Return tokens and key
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error.stack);
    throw Error('Failed to create token');
  }
};

/**
 * Verifies the access token using the provided secret key.
 *
 * @param {string} accessToken - The access token to be verified.
 * @param {string} secretKey - The secret key used for verification.
 * @returns {Object} - The decoded payload of the access token.
 * @throws {Error} - Throws an error if verification fails.
 */
export const verifyAccessToken = accessToken => {
  // Assign secret key to variable
  const secretKey = process.env.SECRET_KEY;
  try {
    return jwt.verify(accessToken, secretKey, { algorithms: ['HS256'] });
  } catch (error) {
    console.error(error.stack);
    throw error;
  }
};

// Validate the refresh token stored in the HTTP-only cookie
export const validateRefreshToken = async (userId, refreshToken) => {
  console.log('original refreshToken: ', refreshToken);
  console.log('userId validate refresh token: ', userId);
  try {
    // Verify that refreshToken cookie matches the token stored in the database
    const user = await User.findById(userId);
    console.log('user utils: ', user);

    // Throw error if tokens do not match
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      throw new Error('Invalid refresh token');
    }

    // Return the user object without the last refreshToken
    return user;
  } catch (error) {
    console.error(error.stack);
    throw error;
  }
};

export const verifyRefreshToken = async refreshToken => {
  // Assign secret key to variable
  const secretKey = process.env.SECRET_KEY;
  try {
    // Verify JWT token
    return jwt.verify(refreshToken, secretKey, { algorithms: ['HS256'] });
  } catch (error) {
    console.error(error.stack);
    throw error;
  }
};

/**
 * Checks if the decoded access token has expired.
 *
 * @param {Object} decodedToken - The decoded payload of the access token.
 * @returns {boolean} - True if the token has expired, false otherwise.
 */
export const checkTokenExpiration = decodedToken => {
  const expirationThreshold = 60 * 10; // 10 minutes
  return decodedToken.exp - Date.now() / 1000 <= expirationThreshold;
};

/**
 * Refreshes access and refresh tokens and updates the database.
 *
 * @param {string} userId - The user ID associated with the tokens.
 * @param {Object} payload - The payload to be used for token creation.
 * @returns {Object} - An object containing new access and refresh tokens and the updated user object from the database.
 */
export const refreshTokensAndDatabase = async (userId, payload) => {
  console.log('userId database: ', userId);
  const response = await createTokens(payload);
  console.log('response: ', response);
  const { accessToken, refreshToken } = response;
  console.log('new refreshToken: ', refreshToken);
  // Update database: Push new token and retain only the previous three tokens
  const refreshedUser = await User.findByIdAndUpdate(
    { _id: userId },
    {
      $addToSet: {
        refreshTokens: refreshToken,
      },
    },
    { new: true },
  );

  // Limit the size of the array to the last 10 elements
  refreshedUser.refreshTokens = refreshedUser.refreshTokens.slice(-10);

  // Save the updated user
  await refreshedUser.save();
  console.log('refreshedUser: ', refreshedUser);
  return { accessToken, refreshToken, refreshedUser };
};

/**
 * Updates authorization headers and cookies with new access and refresh tokens.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {string} newAccessToken - The new access token.
 * @param {string} newRefreshToken - The new refresh token.
 */
export const updateAuthorizationHeadersAndCookies = (req, res, newAccessToken, newRefreshToken) => {
  // Update authorization headers
  req.headers.authorization = `Bearer ${newAccessToken}`;
  res.set('Authorization', `Bearer ${newAccessToken}`);

  // Set new cookies
  res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
};

/**
 * Handles the scenario when the access token has expired.
 *
 * @param {Object} res - Express response object.
 */
export const handleExpiredToken = res => {
  // Clear the user's session by removing cookies
  res.clearCookie('refreshToken');
  res.status(401).json({
    redirectToLogin: true,
    message: 'Token expired, please log in again.',
  });
};
