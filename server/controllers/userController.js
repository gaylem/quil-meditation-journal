// Load environment variables .env file
require('dotenv').config();

// Import required modules
const { User } = require('../db/models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// userController object -- contains methods below
const userController = {};

/**
 * Middleware to verify the access token in the request headers.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
userController.verifyAccessToken = (req, res, next) => {
  // Store access token in a variabls
  const accessToken = req.headers.authorization?.split(' ')[1];
  console.log('req.headers.authorization', req.headers.authorization);
  console.log('accessToken', accessToken);
  // If there is no access token, throw an error
  if (!accessToken) {
    return res.status(401).json({
      log: 'entryController.verifyAccessToken: No access token retrieved from req.headers.authorization',
      status: 404,
      message: { error: 'Access token missing' },
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
      status: 404,
      message: { error: 'Invalid access token' },
    });
  }
};

/**
 * Route: POST /api/users/login
 * Description: Authenticates a user and returns a token.
 * Expected Body:
 *   - username: String
 *   - password: String
 * @returns {Object} - JSON with username, token, and userId
 */
userController.verifyUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.login(username, password);
    console.log('user: ', user);

    const obj = {
      id: user._id.toString(),
      username: user.username,
    };

    const token = User.createToken(obj);
    // Add token to database
    const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $push: { refreshTokens: token.accessToken } }, { new: true });

    const userId = updatedUser._id;
    console.log('updatedUser._id: ', updatedUser._id);

    return res.status(200).json({ username, token, userId });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Route: POST /api/users/token
 * Description: Refreshes access tokens.
 * Expected Body:
 *   - refreshToken: String
 * @returns {Object} - JSON with new accessToken and refreshToken
 */
userController.refreshTokens = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!process.env.REFRESH_SECRET) {
      throw Error('Refresh secret key is missing');
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    // TODO: Where is refreshTokens coming from?
    // Check if the refresh token is in the stored tokens
    if (!refreshTokens.includes(refreshToken)) {
      throw Error('Invalid refresh token');
    }

    // Call createToken to generate a new set of tokens
    const newTokenData = { _id: decoded._id };
    const { accessToken, refreshToken: newRefreshToken } = User.createToken(newTokenData);

    // Update the user's refreshTokens array with the new refresh token
    await User.findOneAndUpdate({ _id: decoded._id }, { $push: { refreshTokens: newRefreshToken } }, { new: true });

    return res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Route: POST /api/users/logout
 * Description: Logs a user out by removing the provided refresh token.
 * Expected Body:
 *   - refreshToken: String
 * @returns {Number} - Status 204 on success
 */
userController.logoutUser = async (req, res) => {
  const { refreshToken } = req.body;
  console.log('refreshToken: ', refreshToken);

  try {
    // Find the user by refresh token and remove it
    const user = await User.findOneAndUpdate({ refreshTokens: refreshToken }, { $pull: { refreshTokens: refreshToken } }, { new: true });

    if (!user) {
      throw Error('Invalid refresh token');
    }

    return res.sendStatus(204);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Route: POST /api/users/signup
 * Description: Creates a new user account.
 * Expected Body:
 *   - username: String
 *   - email: String
 *   - password: String
 * @returns {Object} - JSON with username, userId, and token
 */
userController.createUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Sign up a new user with the provided information
    const user = await User.signup(username, email, password);
    console.log(user);

    const userId = user.id;
    console.log('userId: ', userId);

    // create a token
    const token = User.createToken(user);
    console.log('token: ', token);
    return res.status(200).json({ username, userId, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Route: PUT /api/users/update/:userId
 * Description: Updates user information.
 * Expected Parameters:
 *   - userId: Integer
 * Expected Body:
 *   - username: String
 *   - password: String
 * @returns {Object} - JSON with updated user information
 */
// TODO: Split into three controllers for username, email, password changes from account page
userController.updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { username, password } = req.body;

    // Encrypt the password before updating the user
    const encryptedPassword = await bcrypt.hash(password, process.env.SALT_WORK_FACTOR);

    const result = await User.findOneAndUpdate({ _id: userId }, { $set: { username, password: encryptedPassword } });

    if (result.matchedCount === 0) {
      return next({
        log: 'User not found.',
        status: 404,
        message: { error: 'User not found' },
      });
    }

    res.locals.user = userId;

    console.log('user updated');
    return res.status(200).json(res.locals.user);
  } catch (err) {
    console.error('userController.updateUser Error:', err);
    return next({
      log: 'userController.updateUser Error',
      message: { error: 'An error occurred' },
      status: 500,
    });
  }
};

/**
 * Route: DELETE /api/users/delete/:userId
 * Description: Deletes a user from the database.
 * Expected Parameters:
 *   - userId: Integer
 * @returns {Number} - Status 204 on success
 */
userController.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const userDeleteResult = await User.findOneAndDelete({ _id: userId });
    res.locals.deletedUser = userDeleteResult;

    if (userDeleteResult === null) {
      return next({
        log: 'User could not be deleted.',
        status: 404,
        message: { error: 'An error occurred' },
      });
    }
    return res.status(200).json(res.locals.deletedUser);
  } catch (err) {
    console.error('userController.deleteUser Error:', err);
    return next({
      log: 'userController.deleteUser Error',
      message: { error: 'An error occurred' },
      status: 500,
    });
  }
};

module.exports = userController;
