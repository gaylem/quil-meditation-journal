// Load environment variables .env file
require('dotenv').config();

// Import required modules
const { User } = require('../db/models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// userController object that contains the methods below
const userController = {};

/**
 * Middleware to verify the access token in the request headers.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
userController.verifyAccessToken = (req, res, next) => {
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
 * @route POST /api/users/login
 * @description Authenticates a user and returns a token.
 * Expected Body:
 *   - username: String
 *   - password: String
 * @returns {Object} - JSON with username, token, and userId
 */
userController.verifyUser = async (req, res) => {
  // Extract username and password from request body
  const { username, password } = req.body;
  try {
    // Call login method on the userSchema object and store response in a variable
    const user = await User.login(username, password);
    // Handle error if user not found
    if (!user) {
      return res.status(404).json({
        log: 'userController.verifyUser: No user found',
        status: 404,
        message: 'Username or password are incorrect.',
      });
    }
    // Store userId and username in object for token generation
    const obj = {
      userId: user._id.toString(),
      username: user.username,
    };
    // Create token by calling the createToken method on the userSchema object
    const token = User.createToken(obj);
    // Add token to accessTokens array in user document in database
    const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $push: { refreshTokens: token.accessToken } }, { new: true });
    // Handle error if updated user not returned
    if (!updatedUser) {
      return res.status(404).json({
        log: 'userController.verifyUser: Issue with updatedUser',
        status: 404,
        message: 'Username or password are incorrect.',
      });
    }
    // store updatedUser's id in a variable
    const userId = updatedUser._id;
    console.log('updatedUser._id: ', updatedUser._id);
    // Send the username, token, and userId to the frontend for authentication state management
    return res.status(200).json({ username, token, userId });
  } catch (error) {
    return res.status(500).json({
      log: `userController.verifyUser: ERROR ${error}`,
      status: 500,
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
userController.refreshTokens = async (req, res) => {
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

/**
 * @route POST /api/users/logout
 * @description Logs a user out by removing the provided refresh token.
 * Expected Body:
 *   - refreshToken: String
 * @returns {Number} - Status 204 on success
 */
 // TODO: What is this even doing? 
userController.logoutUser = async (req, res) => {
  // Extract refreshToken from the request body
  const { refreshToken } = req.body;
  // Log error if no refresh token
    if (!refreshToken) {
      console.error('No refreshToken: ', refreshToken);
    }
  try {
    // Find the user by refresh token and remove it
    const user = await User.findOneAndUpdate({ refreshTokens: refreshToken }, { $pull: { refreshTokens: refreshToken } }, { new: true });
    // If there is no user, throw an error
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
