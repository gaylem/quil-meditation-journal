//** USER CONTROLLER */

/* Includes: 
    1. signupUser (POST /api/users/signup) - Creates a new user in the database
    2. loginUser (POST /api/users/login) - Authenticates a user and returns a token
        - Can be used to verify a user outside of login proces
    3. authUser (POST /api/users/token) - Authenticates the access token in the request headers
    4. logoutUser (POST /api/users/logout) - Logs a user out by removing the provided refresh token from the database.

*/

// Imports
require('dotenv').config();
const { User } = require('../db/models');
const { createTokens, refreshTokens } = require('../utils/token.utils');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

// userController object that contains the methods below
const userController = {};

/**
 * @description Sign up a new user with the provided username, email, and password
 * @param {String} username - User's username
 * @param {String} email - User's email address
 * @param {String} password - User's password
 * @returns {Object} - An object containing username, accessToken, and userId
 * @throws {Error} - Throws an error if fields are missing, email is invalid, password is not strong, or email is already in use
 */
userController.signupUser = async (req, res) => {
  // Extract the username, email, and password
  const { username, email, password } = req.body;
  // Validate signup input
  const isValidSignup = async () => {
    // Did the user input data into all three fields?
    if (!username || !email || !password) {
      throw Error('All fields must be filled');
    }
    // Is the email a real email?
    if (!validator.isEmail(email)) {
      throw Error('Email not valid');
    }
    // Is the password strong enough?
    /* Default options: { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 } */
    if (!validator.isStrongPassword(password)) {
      throw Error('Password not strong enough');
    }
    // Is the email already being used?
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      throw Error('Email already in use');
    }
    // Is the username already being used?
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      throw Error('Username already in use');
    }
  };

  try {
    // Invoke isValidSignup to confirm input is valid
    isValidSignup();
    // Generate salt and hash for password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // Create and save new user
    const user = new User({ username, email, password: hash });
    user.save();
    // Store the userId in a new variable and on the locals object
    res.locals.user = user;
    // Extract userId from new user
    const userId = user._id.toString();
    // Store the userId in a new object for the createTokens function
    const userObj = {
      userId,
      username: user.username,
    };
    // Create an object that contains the accesstoken and refreshToken
    const tokens = createTokens(userObj);
    // Set HttpOnly Cookies
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
    // Add token to accessTokens array in user document in the database
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $push: { refreshTokens: tokens.refreshToken } }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({
        log: 'userController.loginUser: Issue with updatedUser',
        status: 404,
        message: 'Username or password are incorrect.',
      });
    }
    // Return 200 status and user object to client for authentication
    return res.status(200).json({ username, accessToken: tokens.accessToken, userId });
  } catch (error) {
    return res.status(500).json({
      log: `userController.signupUser: ERROR ${error.message}`,
      status: 500,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

/**
 * @route POST /api/users/login
 * @description Log in a user with the provided username and password
 * @param {Object} req username and password
 * @returns {Object} - The user object
 * @throws {Error} - Throws an error if fields are missing, username is incorrect, or password is incorrect
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
    const tokens = createTokens(obj);
    // Set HttpOnly Cookies
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
    // Add token to refreshTokens array in user document in the database
    const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $push: { refreshTokens: tokens.refreshToken } }, { new: true });
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
    // Send 200 status and user object to the client for authentication
    return res.status(200).json({ username, accessToken: tokens.accessToken, userId });
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
 * @route POST /api/users/token
 * @description Authenticates the access token in the request headers
 * @param {Object} req - The request object containing the access token in the response headers
 * @param {Object} res - The response object containing:
    - username: String
    - accessToken: String
    - userId: String
 * @returns {Function} Next or the response object
 */
userController.authUser = async (req, res) => {
  // Assign private and private to variables
  const secretKey = process.env.SECRET_KEY;
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    return res.status(401).json({
      log: 'authUser: No access token received.',
      status: 404,
      message: 'Something went wrong. Please try again later.',
    });
  }
  try {
    // Decode tokens using HS256 algorithm
    const decoded = jwt.verify(accessToken, secretKey, { algorithms: ['HS256'] });
    const { username, userId } = decoded;

    if (decoded.exp - Date.now() / 1000 < 60 * 10) {
      const user = await User.findOneAndUpdate({ _id: decoded.userId }, { $pop: { refreshTokens: -1 } }, { new: true });

      const refreshToken = user.refreshTokens.slice(-1)[0];
      const response = await refreshTokens(refreshToken);
      const newAccessToken = response.accessToken;
      const newRefreshToken = response.refreshToken;
      // Update authorization headers
      req.headers.authorization = `Bearer ${newAccessToken}`;
      res.set('Authorization', `Bearer ${newAccessToken}`);
      // Set new cookies
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
      // Return updated user data to client
      return res.status(200).json({ username, newAccessToken, userId });
    }
    return res.status(200).json({
      message: 'Access token is still valid.',
      status: 200,
    });
  } catch (error) {
    return res.status(403).json({
      log: 'authenticateToken: Invalid access token',
      status: 403,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

/**
 * @description Logs user out, revokes refreshToken, and clears cookies
 * @returns 204 response
 * @throws {Error} - Throws an error if refreshToken is invalid
 */
userController.logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const { id } = req.params;
  try {
    // Find the user by refresh token and remove it
    const user = await User.findOneAndUpdate({ _id: id }, { $pull: { refreshTokens: refreshToken } }, { new: true });
    // If there is no user, throw an error
    if (!user) {
      throw Error('Invalid refresh token');
    }
    res.clearCookie('refreshToken');
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({
      log: `userController.logoutUser: ERROR ${error}`,
      status: 500,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

module.exports = userController;
