//** AUTH MIDDLEWARE */

// Import Dotenv
import dotenv from 'dotenv';
dotenv.config();

// Import jwt and User model
import jwt from 'jsonwebtoken';
import { User } from '../db/models.js';

/**
 * Authentication middleware for verifying access tokens.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @throws {Error} Throws an error if access token is missing or invalid.
 * @returns {void}
 */
const authMiddleware = async (req, res, next) => {
  // Secret key for JWT verification.
  const secretKey = process.env.SECRET_KEY;
  // Access token extracted from the request headers.
  const accessToken = req.headers.authorization?.split(' ')[1];

  // Check if the access token is missing
  if (!accessToken) {
    return res.status(401).json({
      log: 'authMiddleware: No access token received.',
      status: 401,
      message: 'Unauthorized - Missing access token.',
    });
  }

  try {
    // Verify the access token using the provided secret key
    const decoded = jwt.verify(accessToken, secretKey, { algorithms: ['HS256'] });
    // Extract user ID from the decoded token
    const { userId } = decoded;
    // Find user by ID in the database
    const user = await User.findById(userId);
    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        log: 'authMiddleware: User not found.',
        status: 404,
        message: 'User not found.',
      });
    }
    // Attach user data to the request for further use
    // TODO: These aren't being used by the entryController but it may be useful in the future
    req.user = user;
    req.accessToken = accessToken;
    // Continue to the next middleware or route
    next();
  } catch (error) {
    // Clear the user's session by removing cookies
    res.clearCookie('refreshToken');
    // Redirect the user to the login page
    res.redirect('/login');
  }
};

export default authMiddleware;
