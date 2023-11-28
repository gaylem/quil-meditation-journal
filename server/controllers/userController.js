//** USER CONTROLLER */

/* Includes: 
    1. loginUser (POST /api/users/login) - Authenticates a user and returns a token. 
        - Can be used to verify a user outside of login process.
    2. logoutUser (POST /api/users/logout) - Logs a user out by removing the provided refresh token from the database.
    3. signupUser (POST /api/users/signup) - Creates a new user in the database.
*/

// Imports
require('dotenv').config();
const { User } = require('../db/models');
const { createTokens } = require('../utils/token.utils');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// userController object that contains the methods below
const userController = {};

/**
 * @route POST /api/users/login
 * @description Authenticates a user and returns a token
 *   - Can be used to verify a user outside of login process
 * @param {Object} req - The request object containing:
 *   - username: String
 *   - password: String
 * @param {Object} res - The response object
 * @returns {Object} - JSON with username, token, and userId
 */
/**
 * @description Log in a user with the provided username and password.
 * @param {String} username - User's username.
 * @param {String} password - User's password.
 * @returns {Object} - The user object.
 * @throws {Error} - Throws an error if fields are missing, username is incorrect, or password is incorrect.
 */
userController.loginUser = async (req, res) => {
  // Extract username and password from request body
  const { username, password } = req.body;
  try {
    // Validate input
    if (!username || !password) {
      throw new Error('All fields must be filled');
    }
    // Find user by username
    const user = await User.findOne({ username });
    // Throw error if username is incorrect
    if (!user) {
      return res.status(404).json({
        log: 'userController.loginUser: No user found',
        status: 404,
        message: 'Username or password are incorrect.',
      });
    }
    // Compare passwords
    const match = await bcrypt.compare(password, user.password);

    // Throw error if password is incorrect
    if (!match) {
      return res.status(404).json({
        log: 'userController.loginUser: Incorrect password',
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
    const token = createTokens(obj);
    // Set HttpOnly Cookies
    res.cookie('accessToken', token.accessToken, { httpOnly: true });
    res.cookie('refreshToken', token.refreshToken, { httpOnly: true });
    // Add token to accessTokens array in user document in the database
    const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $push: { refreshTokens: token.refreshToken } }, { new: true });
    console.log('updatedUser: ', updatedUser);
    // Handle error if updated user not returned
    if (!updatedUser) {
      return res.status(404).json({
        log: 'userController.loginUser: Issue with updatedUser',
        status: 404,
        message: 'Username or password are incorrect.',
      });
    }
    // Store updatedUser's id in a variable
    const userId = updatedUser._id;
    // Send the username, token, and userId to the frontend for authentication state management
    return res.status(200).json({ username, token, userId });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      log: `userController.loginUser: ERROR ${error}`,
      status: 500,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

/**
 * @description Log in a user with the provided username and password.
 * @param {String} username - User's username.
 * @param {String} password - User's password.
 * @returns {Object} - The user object.
 * @throws {Error} - Throws an error if fields are missing, username is incorrect, or password is incorrect.
 */
userController.logoutUser = async (req, res) => {
  // Extract refreshToken from the request body
  const { refreshToken } = req.body;
  console.log('refreshToken userController.logoutUser: ', refreshToken);
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
 * @description Sign up a new user with the provided username, email, and password.
 * @param {String} username - User's username.
 * @param {String} email - User's email address.
 * @param {String} password - User's password.
 * @returns {Object} - An object containing the user's ID and username.
 * @throws {Error} - Throws an error if fields are missing, email is invalid, password is not strong, or email is already in use.
 */
userController.signupUser = async (req, res) => {
  // Extract the username, email, and password
  const { username, email, password } = req.body;
  console.log('req.body: ', req.body);
  try {
    // Validate input
    if (!username || !email || !password) {
      throw Error('All fields must be filled');
    }
    if (!validator.isEmail(email)) {
      throw Error('Email not valid');
    }
    // Check if the password is strong enough
    if (!validator.isStrongPassword(password)) {
      throw Error('Password not strong enough');
    }
    // Check if email is already in use
    const emailExists = await User.findOne({ email });
    console.log('emailExists: ', emailExists);
    if (emailExists) {
      throw Error('Email already in use');
    }
    // Check if username is already in use
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      throw Error('Username already in use');
    }
    // Generate salt and hash for password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log('hash: ', hash);
    // Create and save new user
    const user = new User({ username, email, password: hash });
    user.save();
    // Extract userId and username from new user
    const userId = user._id.toString();
    // Store the userId in a new object for the createTokens function
    const userObj = {
      userId,
      username: user.username,
    };
    // Store the userId in a new variable and on the locals object
    res.locals.userId = userId;
    // Create a token
    const token = createTokens(userObj);
    // Return the username, userId, and token as an object
    return res.status(200).json({ username, userId, token });
  } catch (error) {
    return res.status(500).json({
      log: `userController.signupUser: ERROR ${error.message}`,
      status: 500,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

module.exports = userController;
