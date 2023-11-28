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
const createTokens = obj => {
  try {
    // Validate input
    if (typeof obj !== 'object') {
      throw new Error('Input must be an object');
    }
    // Check for secret keys
    if (!process.env.ACCESS_SECRET || !process.env.REFRESH_SECRET) {
      throw Error('Secret keys are missing');
    }
    // Sign tokens using HS256 algorithm and set expiration
    const accessTokenOptions = {
      algorithm: 'HS256',
      expiresIn: '15m',
    };

    const refreshTokenOptions = {
      algorithm: 'HS256',
      expiresIn: '24h',
    };

    const accessToken = jwt.sign(obj, process.env.ACCESS_SECRET, accessTokenOptions);
    const refreshToken = jwt.sign(obj, process.env.REFRESH_SECRET, refreshTokenOptions);

    // Return tokens
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error creating token:', error);
    throw Error('Failed to create token');
  }
};

/**
 * @description Middleware to verify the access token in the request headers.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - Express next function
 */
const authenticateToken = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    return res.status(401).json({
      log: 'authenticateToken: No access token received.',
      status: 404,
      message: 'Something went wrong. Please try again later.',
    });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET, { algorithms: ['HS256'] });

    if (decoded.exp - Date.now() / 1000 < 60 * 5) {
      const response = await refreshToken(req.body.refreshToken);
      req.headers.authorization = `Bearer ${response.accessToken}`;
      res.locals.decoded = jwt.verify(response.accessToken, process.env.ACCESS_SECRET, { algorithms: ['HS256'] });
      return next();
    } else {
      res.locals.decoded = decoded;
      return res.status(200).json(res.locals.decoded);
    }
  } catch (error) {
    return res.status(403).json({
      log: 'authenticateToken: Invalid access token',
      status: 403,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

/**
 * @description Refreshes access tokens.
 * @param {String} refreshToken - The refresh token
 * @returns {Object} - JSON with new accessToken and refreshToken
 */
const refreshToken = async refreshToken => {
  try {
    if (!process.env.REFRESH_SECRET) {
      throw Error('Refresh secret key is missing');
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    // Add your logic to check if the refresh token is valid and stored

    const { accessToken, refreshToken: newRefreshToken } = createTokens(decoded); // Generate new tokens
    await User.findOneAndUpdate({ _id: decoded._id }, { $push: { refreshTokens: newRefreshToken } }, { new: true });
    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    return {
      log: `userController.refreshTokens: ERROR ${error}`,
      status: 500,
      message: 'Something went wrong. Please try again later.',
    };
  }
};

module.exports = { createTokens, authenticateToken, refreshToken };
