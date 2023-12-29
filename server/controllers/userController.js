//** USER CONTROLLER */

/* Includes: 
    1. signupUser (POST /api/users/signup) - Creates a new user in the database
    2. loginUser (POST /api/users/login) - Authenticates a user and returns a token
        - Can be used to verify a user outside of login process
    3. authUser (POST /api/users/token) - Authenticates the access token in the request headers
    4. logoutUser (POST /api/users/logout) - Logs a user out by removing the provided refresh token from the database and cookies.

*/

// Imports
import dotenv from 'dotenv';
dotenv.config();
import { User } from '../db/models.js';
import { createTokens } from '../utils/token.utils.js';
import { isValidSignup } from '../utils/credentials.utils.js';
import bcrypt from 'bcryptjs';

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
  try {
    // Invoke isValidSignup to confirm input is valid
    const isValid = await isValidSignup(username, email, password);

    if (!isValid) {
      console.error(error.stack);
      return res.status(error.status || 500).json({
        log: `userController.signupUser: ERROR ${error}`,
        status: error.status || 500,
        message: 'Something went wrong. Please try again later.',
      });
    }
    // Generate salt and hash for password
    const saltRounds = Number(process.env.SALT_WORK_FACTOR);
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    // Create and save new user
    const user = new User({ username, email, password: hash });

    await user.save();
    // Store the userId in a new variable and on the locals object
    res.locals.user = user;
    // Extract userId from new user
    const userId = user._id.toString();

    // Store the userId and username in a new object for the createTokens function
    const userObj = {
      userId,
      username: user.username,
    };

    // Create tokens
    const tokens = createTokens(userObj);

    // Set HttpOnly Cookies
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
    // Add token to accessTokens array in user document in the database
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $push: { refreshTokens: tokens.refreshToken } }, { new: true });

    // If updatedUser returns false, log an error
    if (!updatedUser) {
      console.error(error.stack);
      return res.status(404).json({
        log: `userController.signup: ERROR ${error.message}`,
        status: 404,
        message: 'Username or password are incorrect.',
      });
    }
    // Return 200 status and user object to client for authentication
    return res.status(200).json({ username, accessToken: tokens.accessToken, userId });
  } catch (error) {
    console.error(error.stack);
    return res.status(error.status || 500).json({
      log: `userController.signupUser: ERROR ${error.message}`,
      status: error.status || 500,
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
    console.log('user login: ', user);
    // Throw error if username is incorrect
    if (!user) {
      console.error(error.stack);
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
      console.error(error.stack);
      return res.status(404).json({
        log: `userController.loginUser: ERROR ${error.message}`,
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
    console.log('updatedUser login: ', updatedUser);
    // Handle error if updated user not returned
    if (!updatedUser) {
      console.error(error.stack);
      return res.status(404).json({
        log: `userController.loginUser: ERROR ${error.message}`,
        status: 404,
        message: 'Username or password are incorrect.',
      });
    }
    // Store updatedUser's id in a variable
    const userId = updatedUser._id;
    console.log('userId login controller: ', userId);
    // Send 200 status and user object to the client for authentication
    return res.status(200).json({ username, accessToken: tokens.accessToken, userId });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      log: `userController.loginUser: ERROR ${error.message}`,
      status: 500,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

/**
 * @route POST /api/users/token
 * @description Returns the payload to the client after validating or refreshing tokens through authMiddleware.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object containing the payload with properties:
 *    - username: String
 *    - newAccessToken: String
 *    - userId: String
 * @throws {Error} if there is an issue with the authMiddleware or payload
 */
userController.authUser = async (req, res) => {
  console.log('test');
  try {
    // Return authData to client
    const payload = res.locals.authData;
    console.log('payload controller: ', payload);
    return res.status(200).json(payload);
  } catch (error) {
    console.error(error.stack);
    return res.status(403).json({
      log: `userController.authUser: ERROR ${error.message}`,
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
    // Clear cookies
    res.clearCookie('refreshToken');
    res.clearCookie('user');
    return res.sendStatus(204);
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      log: `userController.logoutUser: ERROR ${error.message}`,
      status: 500,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

export default userController;
