//** AUTH MIDDLEWARE */

// Import Dotenv
import dotenv from 'dotenv';
dotenv.config();

// Import token utils
import { verifyAccessToken, checkTokenExpiration, refreshTokensAndDatabase, updateAuthorizationHeadersAndCookies, handleExpiredToken } from '../utils/token.utils.js';

/**
 * Authentication middleware for verifying access tokens.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @throws {Error} Throws an error if access token is missing or invalid.
 * @returns {void}
 */
const authMiddleware = async (req, res, next) => {
  // Retrieve secret key and access token from the request
  const secretKey = process.env.SECRET_KEY;
  const accessToken = req.headers.authorization?.split(' ')[1];
  // Check if access token is missing
  if (!accessToken) {
    return res.status(401).json({
      log: 'authUser: No access token received.',
      status: 404,
      message: 'Something went wrong. Please try again later.',
    });
  }
  try {
    // Decode access token and create payload object
    const decoded = verifyAccessToken(accessToken, secretKey);
    const { userId, username } = decoded;
    const payload = { userId, username };
    // If the token is expired, refresh tokens and database
    if (checkTokenExpiration(decoded)) {
      console.log('Token expired');
      // Refresh tokens in the database and save new tokens in an object
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshTokensAndDatabase(userId, payload);
      console.log('newAccessToken', newAccessToken);
      // Update authorization headers and cookies
      updateAuthorizationHeadersAndCookies(req, res, newAccessToken, newRefreshToken);
      // Return payload to client
      console.log('Token refreshed');
      // TODO: Need to get this data through entry controllers and back to client
      return res.status(200).json({ username, newAccessToken, userId });
    }
    console.log('Token is still valid');
    next();
  } catch (error) {
    // Handle token-related errors
    if (error.name === 'TokenExpiredError') {
      handleExpiredToken(res);
    } else {
      return res.status(401).json({
        log: `authMiddleware: Token verification failed: ERROR ${error.message}.`,
        status: 401,
        message: 'Unauthorized - Invalid access token.',
      });
    }
  }
};

export default authMiddleware;
