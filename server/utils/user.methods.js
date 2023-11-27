//** USER METHODS */

/* These methods are attached to the User model. They include:
    1. createToken - Create access and refresh tokens using the provided object.
    2. signup - Sign up a new user with the provided username, email, and password.
    3. login - Log in a user with the provided username and password.
*/

// Imports
require('dotenv').config();
const { User } = require('../db/models'); // eslint-disable-line no-unused-vars
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

/**
 * @description Create access and refresh tokens using the provided object.
 * @param {Object} obj - The object to be used for token creation.
 * @returns {Object} - An object containing access and refresh tokens.
 * @throws {Error} - Throws an error if input is not an object or secret keys are missing.
 */
const createToken = obj => {
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
    const accessToken = jwt.sign(obj, process.env.ACCESS_SECRET, { algorithm: 'HS256' });
    const refreshToken = jwt.sign(obj, process.env.REFRESH_SECRET, { algorithm: 'HS256' });
    // TODO: Commenting out lines with expirations to see if that fixes my issues
    // const accessTokenOptions = {
    //   algorithm: 'HS256',
    //   expiresIn: '15m',
    // };

    // const refreshTokenOptions = {
    //   algorithm: 'HS256',
    //   expiresIn: '7d',
    // };

    // const accessToken = jwt.sign(obj, process.env.ACCESS_SECRET, accessTokenOptions);
    // const refreshToken = jwt.sign(obj, process.env.REFRESH_SECRET, refreshTokenOptions);

    // Return tokens
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error creating token:', error);
    throw Error('Failed to create token');
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
const signup = async function (username, email, password) {
  try {
    // Validate input
    if (!username || !email || !password) {
      throw Error('All fields must be filled');
    }
    if (!validator.isEmail(email)) {
      throw Error('Email not valid');
    }

    /* Check if the password is strong enough:
        Allows for custom requirements or scoring rules. 
        If returnScore is true, then the function returns an integer 
        score for the password rather than a boolean.

        Default options: { 
          minLength: 8, 
          minLowercase: 1, 
          minUppercase: 1, 
          minNumbers: 1, 
          minSymbols: 1, 
          returnScore: false, 
          pointsPerUnique: 1, 
          pointsPerRepeat: 0.5, 
          pointsForContainingLower: 10, 
          pointsForContainingUpper: 10, 
          pointsForContainingNumber: 10, 
          pointsForContainingSymbol: 10 
        }
    */

    if (!validator.isStrongPassword(password)) {
      throw Error('Password not strong enough');
    }

    // Check if email is already in use
    const emailExists = await this.findOne({ email });
    if (emailExists) {
      throw Error('Email already in use');
    }

    // Check if username is already in use
    const usernameExists = await this.findOne({ username });
    if (usernameExists) {
      throw Error('Username already in use');
    }

    // Generate salt and hash for password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create and save new user
    const user = new this({ username, email, password: hash });
    await user.save();

    // Return user ID and username
    return {
      id: user._id.toString(),
      username: user.username,
    };
  } catch (error) {
    console.error('Error creating user in the database:', error);
    throw error;
  }
};

/**
 * @description Log in a user with the provided username and password.
 * @param {String} username - User's username.
 * @param {String} password - User's password.
 * @returns {Object} - The user object.
 * @throws {Error} - Throws an error if fields are missing, username is incorrect, or password is incorrect.
 */
const login = async function (username, password) {
  try {
    // Validate input
    if (!username || !password) {
      throw new Error('All fields must be filled');
    }
    // Find user by username
    const user = await this.findOne({ username });

    // Throw error if username is incorrect
    if (!user) {
      throw new Error('Incorrect username');
    }

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);

    // Throw error if password is incorrect
    if (!match) {
      throw new Error('Incorrect password');
    }
    // Return user object
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

module.exports = { createToken, signup, login };
