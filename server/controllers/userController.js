//** USER CONTROLLER */

/* Includes: 
    1. verifyUser (POST /login) - Authenticates a user and returns a token.
    2. logoutUser (POST /logout) - Logs a user out by removing the provided refresh token from the database.
    3. createUser (POST /signup) - Creates a new user in the database.
*/

// Imports
require('dotenv').config();
const { User } = require('../db/models');
// userController object that contains the methods below
const userController = {};

/**
 * @route POST /api/users/login
 * @description Authenticates a user and returns a token.
 * @requestBody
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
 * @route POST /api/users/logout
 * @description Logs a user out by removing the provided refresh token from the database.
 * @requestBody
 *   - refreshToken: String
 * @returns {Number} - Status 204 on success
 */
// TODO: This appears to be working but the logout method in the User schema is a dupe
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
    return res.status(500).json({
      log: `userController.logoutUser: ERROR ${error}`,
      status: 500,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

/**
 * @route POST /api/users/signup
 * @description Creates a new user in the database.
 * @requestBody
 *   - username: String
 *   - email: String
 *   - password: String
 * @returns {Object} - JSON with username, userId, and token
 */
userController.createUser = async (req, res) => {
  // Extract the username, email, and password
  const { username, email, password } = req.body;
  try {
    // Sign up a new user with the provided information
    const user = await User.signup(username, email, password);
    // Store the userId in a new variable and on the locals object
    if (!user) {
      return res.status(404).json({
        log: 'userController.createUser: Issue creating user',
        status: 404,
        message: 'Something went wrong. Please try again later.',
      });
    }
    const userId = user.id;
    res.locals.userId = userId;
    // Create a token
    const token = User.createToken(user);
    // Return the username, userId, and token as an object
    return res.status(200).json({ username, userId, token });
  } catch (error) {
    return res.status(500).json({
      log: `userController.createUser: ERROR ${error}`,
      status: 500,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

module.exports = userController;
