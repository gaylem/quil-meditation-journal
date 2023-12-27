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
      expiresIn: '5m',
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
 * Verifies the access token using the provided secret key.
 *
 * @param {string} accessToken - The access token to be verified.
 * @param {string} secretKey - The secret key used for verification.
 * @returns {Object} - The decoded payload of the access token.
 * @throws {Error} - Throws an error if verification fails.
 */
export const verifyAccessToken = (accessToken, secretKey) => {
  try {
    return jwt.verify(accessToken, secretKey, { algorithms: ['HS256'] });
  } catch (error) {
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
  const expirationThreshold = 60 * 3; // 40 minutes
  return decodedToken.exp - Date.now() / 1000 < expirationThreshold;
};

/**
 * Refreshes access and refresh tokens and updates the database.
 *
 * @param {string} userId - The user ID associated with the tokens.
 * @param {Object} payload - The payload to be used for token creation.
 * @returns {Object} - An object containing new access and refresh tokens and the updated user object from the database.
 */
export const refreshTokensAndDatabase = async (userId, payload) => {
  console.log('refreshTokensAndDatabase');
  const response = await createTokens(payload);
  console.log('refreshTokensAndDatabas response: ', response);
  const { accessToken, refreshToken } = response;

  // Update database: Push new token and retain only the previous three tokens
  const refreshedUser = await User.findByIdAndUpdate(
    userId,
    {
      $push: {
        refreshTokens: {
          $each: [refreshToken],
          $slice: -3, // Retain only the last two elements
        },
      },
    },
    { new: true },
  );

  console.log('refreshedUser', refreshedUser);

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
  console.log('req.headers.authorization: ', req.headers.authorization);
  res.set('Authorization', `Bearer ${newAccessToken}`);

  // Set new cookies
  res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
  console.log('end of auth headers and cookies');
};

/**
 * Handles the scenario when the access token has expired.
 *
 * @param {Object} res - Express response object.
 */
export const handleExpiredToken = res => {
  // Clear the user's session by removing cookies
  res.clearCookie('refreshToken');
  // Redirect the user to the login page
  res.redirect('/login');
};
