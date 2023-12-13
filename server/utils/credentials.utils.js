//** USER CREDENTIALS FUNCTIONS */

/* Includes:
    1. isValidSignup - Checks if user inputs at signup are valid, called by the userController
*/

import { User } from '../db/models.js';
import validator from 'validator';

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
  // Did the user input data into all three fields?
  if (!username || !email || !password) {
    throw Error('All fields must be filled');
  }

  // Is the email a real email?
  if (!validator.isEmail(email)) {
    throw Error('Email not valid');
  }

  // Is the password strong enough?
  /* Default options: {
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
      pointsForContainingSymbol: 10 } 
  */

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
