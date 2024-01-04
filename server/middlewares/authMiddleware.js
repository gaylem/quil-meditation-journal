//** AUTH MIDDLEWARE */

// Import Dotenv
import dotenv from 'dotenv';
dotenv.config();

// Import token utils
import { verifyAccessToken, verifyRefreshToken, validateRefreshToken, checkTokenExpiration, refreshTokensAndDatabase, updateAuthorizationHeadersAndCookies, handleExpiredToken } from '../utils/token.utils.js';

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
  try {
    // Retrieve the userId from the request
    const userId = req.params.id;
    // Retrieve the access token from the request
    const accessToken = req.headers.authorization?.split(' ')[1];
    // Retrieve the refresh token from cookies
    const refreshToken = req.cookies.refreshToken;

    // Check if access token is missing
    if (!accessToken) {
      return res.status(401).json({
        log: `authMiddleware: ERROR: No accessToken`,
        status: 404,
        message: 'Something went wrong. Please try again later.',
      });
    }

    // Check if refresh token is missing
    if (!refreshToken) {
      return res.status(401).json({
        log: `authMiddleware: ERROR: No refreshToken`,
        status: 404,
        message: 'Something went wrong. Please try again later.',
      });
    }

    // Verify and decode the accessToken
    const decodedAccessToken = await verifyAccessToken(accessToken);

    // Validate that refreshToken exists in database and return user object
    const user = await validateRefreshToken(userId, refreshToken);

    // Verify and decode the refreshToken
    const decodedRefreshToken = await verifyRefreshToken(refreshToken);

    const accessTokenIsExpired = checkTokenExpiration(decodedAccessToken);
    const refreshTokenIsExpired = checkTokenExpiration(decodedRefreshToken);

    // If the token is about to expire, refresh tokens and database
    if (accessTokenIsExpired || refreshTokenIsExpired) {
      console.log('Token is about to expire');
      // Create Payload object for token generation
      const payload = { username: user.username, userId };
      // Refresh tokens in the database and save new tokens in an object
      const { accessToken, refreshToken } = await refreshTokensAndDatabase(userId, payload);
      // Update authorization headers and cookies
      updateAuthorizationHeadersAndCookies(req, res, accessToken, refreshToken);
      // Store additional data in res.locals
      res.locals.authData = { username: user.username, accessToken, userId };
      // Continue to the next middleware or route
      next();
    } else {
      console.log('Tokens are still valid');
      res.locals.authData = { username: user.username, accessToken, userId };
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
