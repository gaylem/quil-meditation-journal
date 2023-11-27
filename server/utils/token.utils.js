//** JWT TOKEN UTILITY FUNCTIONS */

/* Includes: 
    1. verifyAccessTokens - Middleware to verify the access token in the request headers.
    2. refreshTokens - Refreshes access tokens.
*/

// Import required modules
require('dotenv').config();
const { User } = require('../db/models');
const jwt = require('jsonwebtoken');

/**
 * @description Middleware to verify the access token in the request headers.
 * @param {Object} req - The request body that contains:
 *  - accessToken: String
 * @param {Object} res - The response object
 * @param {Function} next - Express next function
 */
const verifyAccessToken = (req, res, next) => {
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
 * @description Refreshes access tokens.
 * @param {Object} req - The request body that contains:
 *   - refreshToken: String
 * @returns {Object} - JSON with new accessToken and refreshToken
 */
// TODO: Refresh tokens are null -- where am I calling the /token route?
const refreshTokens = async (req, res) => {
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

module.exports = { verifyAccessToken, refreshTokens };
