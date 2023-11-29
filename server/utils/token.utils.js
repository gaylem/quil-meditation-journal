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
const createTokens = payload => {
  // Assign private key to variable
  const secretKey = process.env.SECRET_KEY;

  try {
    // Validate input
    if (typeof payload !== 'object') {
      throw new Error('Input must be an object');
    }
    // Check for secret keys
    if (!secretKey) {
      throw Error('Private key is missing');
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

//! The functions below probably aren't needed since my logoutUser controller clears cookies and my loginUser controller creates them. I would only need them if I want to let the user remain logged in until their tokens expire


/**
 * @description Middleware to verify the access token in the request headers.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - Express next function
 */
const authenticateToken = async (req, res, next) => {
  // Assign private and private to variables
  const secretKey = process.env.SECRET_KEY;
  // Check for existance of access token
  if (!res.accessToken) {
    throw Error('Access token does not exist');
  }
  const accessToken = req.headers.authorization?.split(' ')[1];
  console.log('accessToken: ', accessToken);

  if (!accessToken) {
    return res.status(401).json({
      log: 'authenticateToken: No access token received.',
      status: 404,
      message: 'Something went wrong. Please try again later.',
    });
  }
  try {
    // Decode tokens using HS256 algorithm
    const decoded = jwt.verify(accessToken, secretKey, { algorithms: ['HS256'] });

    if (decoded.exp - Date.now() / 1000 < 60 * 5) {
      const response = await refreshToken(req.body.refreshToken);
      req.headers.authorization = `Bearer ${response.accessToken}`;
      res.locals.decoded = jwt.verify(response.accessToken, secretKey, { algorithms: ['HS256'] });
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
  // Assign private key to variable
  const secretKey = process.env.SECRET_KEY;
  try {
    if (!secretKey) {
      throw Error('Private key is missing');
    }
    const decoded = jwt.verify(refreshToken, secretKey, { algorithms: ['HS256'] });

    const user = await User.findOne({ _id: decoded.userId });

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      throw Error('Invalid refresh token or not stored');
    }

    const { accessToken, refreshToken: newRefreshToken } = createTokens(decoded);
    await User.findOneAndUpdate({ _id: decoded.userId }, { $push: { refreshTokens: newRefreshToken } }, { new: true });

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    return {
      log: `userController.refreshTokens: ERROR ${error}`,
      status: 500,
      message: 'Internal Server Error: Something went wrong. Please try again later.',
    };
  }
};

module.exports = { createTokens, authenticateToken, refreshToken };
