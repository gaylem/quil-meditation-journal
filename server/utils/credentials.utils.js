//** USER CREDENTIALS FUNCTIONS */

/* Includes:
    1. isValidSignup - Checks if user inputs at signup are valid, called by the userController
*/

import { User } from '../db/models.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';

/**
 * Checks if user inputs at signup are valid.
 * @async
 * @function
 * @throws {Error} Throws an error if validation fails.
 * @param {string} username - The username provided during signup.
 * @param {string} email - The email provided during signup.
 * @param {string} password - The password provided during signup.
 * @returns {Promise<void>} A promise that resolves if validation is successful.
 * @throws {Error} Throws an error with a specific message if any validation fails.
 */
export const isValidSignup = async (username, email, password) => {
  try {
    // Did the user input data into all three fields?
    if (!username || !email || !password) {
      throw new Error('All fields must be filled.');
    }

    // Is the email a real email?
    if (!validator.isEmail(email)) {
      throw new Error('Please enter a valid email address.');
    }

    // Is the password strong enough?
    const customOptions = {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
    };

    if (!validator.isStrongPassword(password, customOptions)) {
      throw new Error('Password is not strong enough. Must be 8 characters long with upper and lowercase letters, numbers, and symbols.');
    }

    // Is the email already being used?
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      throw new Error('Username or email already exists.');
    }

    // Is the username already being used?
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      throw new Error('Username or email already exists.');
    }

    return true;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export const verifyPassword = async (input, userId) => {
  try {
    // Find user by userId
    const user = await User.findOne({ _id: userId });
    // Throw error if no user
    if (!user) {
      throw Error('User does not exist ');
    }
    // Confirm old password matches user password
    const match = await bcrypt.compare(input, user.password);
    // Throw error if password is incorrect
    if (!match) {
      throw Error('Password is incorrect');
    }
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
