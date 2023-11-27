//** AUTHENTICATION CONTROLLER */

/* Includes: 
    1. verifyUser (POST /api/users/login) - Authenticates a user and returns a token. 
        - Can be used to verify a user outside of login process.
    2. logoutUser (POST /api/users/logout) - Logs a user out by removing the provided refresh token from the database.
    3. createUser (POST /api/users/signup) - Creates a new user in the database.
*/

// Import required modules
require('dotenv').config();
const { User } = require('../db/models');
const jwt = require('jsonwebtoken');

// authController object that contains the methods below
const authController = {};

/**
 * Middleware to verify the access token in the request headers.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
authController.verifyAccessToken = (req, res, next) => {
  // Store access token in a variables
  const accessToken = req.headers.authorization?.split(' ')[1];
  console.log('req.headers.authorization', req.headers.authorization);
  console.log('accessToken', accessToken);
  // If there is no access token, throw an error
  if (!accessToken) {
    return res.status(401).json({
      log: 'entryController.verifyAccessToken: No access token received.',
      status: 404,
      message: 'Something went wrong. Please try again later.',
    });
  }

  try {
    // Decode the access token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET, { algorithms: ['HS256'] });
    console.log('decoded: ', decoded);
    // Store the decoded result in the locals object
    res.locals.decoded = decoded;
    // Send result to the frontend
    next();
  } catch (error) {
    return res.status(403).json({
      log: 'userController.verifyAccessToken: Invalid access token',
      status: 403,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

/**
 * @route POST /api/users/token
 * @description Refreshes access tokens.
 * Expected Body:
 *   - refreshToken: String
 * @returns {Object} - JSON with new accessToken and refreshToken
 */
// TODO: Refresh tokens are null -- where am I calling the /token route?
authController.refreshTokens = async (req, res) => {
  // Extract the refreshToken from the request body
  const { refreshToken } = req.body;
  try {
    if (!process.env.REFRESH_SECRET) {
      throw Error('Refresh secret key is missing');
    }
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    // Logging temporarily to confirm if this is the right keyword
    console.log('this from refreshTokens: ', this);
    // Check if the refresh token is in the stored tokens
    if (!this.refreshTokens.includes(refreshToken)) {
      throw Error('Invalid refresh token');
    }
    // Call createToken to generate a new set of tokens
    const newTokenData = { _id: decoded._id };
    const { accessToken, refreshToken: newRefreshToken } = User.createToken(newTokenData);
    // Update the user's refreshTokens array with the new refresh token
    await User.findOneAndUpdate({ _id: decoded._id }, { $push: { refreshTokens: newRefreshToken } }, { new: true });
    // Return the accessToken and the newRefreshToken
    return res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(500).json({
      log: `userController.refreshTokens: ERROR ${error}`,
      status: 500,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

module.exports = authController;
