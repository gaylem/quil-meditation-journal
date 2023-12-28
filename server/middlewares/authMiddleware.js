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
    console.error(error.stack);
    return res.status(401).json({
      log: `authMiddleware: ERROR ${error.message}`,
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
      // Update authorization headers and cookies
      updateAuthorizationHeadersAndCookies(req, res, newAccessToken, newRefreshToken);
      // Store additional data in res.locals
      res.locals.authData = { username, accessToken, userId };
      // Continue to the next middleware or route
      next();
    } else {
      console.log('Token is still valid');
      res.locals.authData = { username, accessToken, userId };
      next();
    }
  } catch (error) {
    console.error(error.stack);
    // Handle token-related errors
    if (error.name === 'TokenExpiredError') {
      handleExpiredToken(res);
    } else {
      return res.status(401).json({
        log: `authMiddleware: Token verification failed: ERROR ${error.message}.`,
        status: 401,
        message: 'Unauthorized.',
      });
    }
  }
};

export default authMiddleware;
