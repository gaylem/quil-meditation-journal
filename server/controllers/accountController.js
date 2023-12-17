//** ACCOUNT CONTROLLER */

/* Functionality should include: 
    1. downloadEntries (GET /account) - Retrieves all entries for a user by userID and downloads to CSV
    2. updateUsernam (PATCH /account) - Updates username by userId
    3. updateEmail (PATCH /account) - Updates user email by userId
    4. updatePassword (PATCH /account) - Updates user password by userId, requires old password
    5. Delete user
*/

// Imports
import dotenv from 'dotenv';
dotenv.config();
import { User } from '../db/models.js';
import { Entry } from '../db/models.js';
import bcrypt from 'bcryptjs';
import { stringify } from 'csv-stringify';
import {decrypt } from '../utils/encrypt-decrypt-utils.js'
import { verifyPassword } from '../utils/credentials.utils.js';


// accountController object that contains the methods below
const accountController = {};

/**
 * @route GET /api/users/:userId
 * @description Downloads user entry data
 * @param userId
 * @returns {Object} - CSV containing user entry data and 200 status, or error message
 */
accountController.downloadEntries = async (req, res) => {
  const userId = req.params.userId
  const password = req.body.enterPassword;
  console.log('password: ', password);
  try {
    // Authenticate user
    const passwordIsValid = await verifyPassword(password, userId)
    console.log('passwordIsValid: ', passwordIsValid);
    if (!passwordIsValid) {
      return res.status(400).send();
    }
    // Pull all user entries from database
    const allEntries = await Entry.find({ userId }).select('-_id body createdAt updatedAt iv');
    // Format and decrypt entries
    const formattedEntries = allEntries.map(entry => {
      entry.toObject();
      const decryptedBody = decrypt(entry.body, entry.iv);
      const createdAtString = new Date(entry.createdAt).toLocaleString();
      const updatedAtString = new Date(entry.updatedAt).toLocaleString();
      if (entry.iv) {
        return {
          body: decryptedBody,
          createdAt: createdAtString,
          updatedAt: updatedAtString,
        };
      } else if (entry.iv === null || entry.iv === undefined) {
        return {
          body: entry.body,
          createdAt: createdAtString,
          updatedAt: updatedAtString,
        };
      } else {
        return {
          body: entry.body,
          createdAt: createdAtString,
          updatedAt: updatedAtString,
        };
      }
    });

    // Convert entries to CSV string
    const csvString = await new Promise((resolve, reject) => {
      stringify(formattedEntries, { header: true }, (err, output) => {
        if (err) reject(err);
        else resolve(output);
      });
    });

    // Set response headers
    res.setHeader('Content-Disposition', 'attachment; filename=my_entries.csv');
    res.setHeader('Content-Type', 'text/csv');
    console.log(csvString);
    // Send the CSV string as the response
    res.status(200).send(csvString);
  } catch (error) {
    console.error('accountController.downloadEntries Error:', error);
    return res.status(500).json({
      log: 'accountController.downloadEntries Error',
      status: 500,
      message: 'An error occurred while processing the request.',
    });
  }
}

/**
 * @route PUT /api/users/:userId
 * @description Updates username
 * @param userId
 * @param newUsername
 * @returns {Object} - JSON with updated username and 200 status, or error message
 */
accountController.updateUsername = async (req, res) => {
  
  console.log("test");
  try {
    // Extract the userId, username, and password from params and body
    const { userId } = req.params;
    console.log('userId: ', userId);
    const { newUsername, password } = req.body;
    // Authenticate user
    verifyPassword(password, userId)
    // Check if newUsername already exists
    const user = await User.findOne({ _id: userId });
    // Throw error if username already exists
    if (!user) {
      return res.status(404).json({
        log: 'userController.updateUsername: User does not exist',
        status: 404,
        message: 'Something went wrong, please try again.',
      });
    }
    // Update the user data
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $set: { username: newUsername } });
    // If nothing is returned, throw an error
    if (updatedUser.matchedCount === 0) {
      return {
        log: 'User not found.',
        status: 404,
        message: { error: 'User not found' },
      };
    }

    return res.status(200).json(newUsername);
  } catch (error) {
    console.error('userController.updateUsername Error:', error);
    return {
      log: `accountController.updateUsername: Error: ${error}`,
      message: { error: 'An error occurred' },
      status: 500,
    };
  }
};

/**
 * @route PUT /api/users/:userId
 * @description Updates user email
 * @param userId
 * @param newEmail
 * @returns {Object} - JSON with updated user email and 200 status, or error message
 */
accountController.updateEmail = async (req, res) => {
  try {
   // Extract the userId, username, and password from params and body
    const { userId } = req.params;
    const { newEmail, password } = req.body;
    // Authenticate user
    verifyPassword(password, userId)
    // Check if newUsername already exists
    const user = await User.findOne({ _id: userId });
    // Throw error if username already exists
    if (!user) {
      return res.status(404).json({
        log: 'userController.updateUsername: User does not exist',
        status: 404,
        message: 'Something went wrong, please try again.',
      });
    }
    // Update the user data
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $set: { email: newEmail } });
    // If nothing is returned, throw an error
    if (updatedUser.matchedCount === 0) {
      return {
        log: 'User not found.',
        status: 404,
        message: { error: 'User not found' },
      };
    }
    res.locals.user = updatedUser;
    return res.status(200).json(res.locals.user);
  } catch (error) {
    console.error('userController.updateEmail Error:', error);
    return {
      log: `accountController.updateEmail: Error: ${error}`,
      message: { error: 'An error occurred' },
      status: 500,
    };
  }
};

/**
 * @route PUT /api/users/:userId
 * @description Updates password
 * @param userId
 * @param newPassword
 * @returns {Object} - 200 status or error message
 */
accountController.updatePassword = async (req, res) => {
  try {
    // Extract the userId, username, and password from params and body
    const { userId } = req.params;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Check if newPassword & confirmedNewPassword match
    if (newPassword !== confirmNewPassword) {
      return res.status(401).json({
        log: 'accountController: newPassword and confirmNewPassword do not match',
        status: 401,
        message: 'Passwords do not match.',
      });
    }
    // Find user by userId
    const user = await User.findOne({ _id: userId });
    // Throw error if no user
    if (!user) {
      return res.status(404).json({
        log: 'accountController.update: No user found',
        status: 404,
        message: 'Username or password are incorrect.',
      });
    }
    // Confirm old password matches user password
    verifyPassword(currentPassword, userId);
    // Encrypt the password before updating the user
    const saltRounds = Number(process.env.SALT_WORK_FACTOR);
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(newPassword, salt);
    // Update the user data
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $set: { password: hash } });
    console.log('updatedUser: ', updatedUser);
    // If nothing is returned, throw an error
    if (updatedUser.matchedCount === 0) {
      return {
        log: 'User not found.',
        status: 404,
        message: { error: 'User not found' },
      };
    }
    return res.status(204).send();
  } catch (err) {
    console.error('userController.updateUser Error:', err);
    return {
      log: 'userController.updateUser Error',
      message: { error: 'An error occurred' },
      status: 500,
    };
  }
};

/**
 * @route DELETE /api/users/delete/:userId
 * @description Deletes a user from the database.
 * @param userID
 * @returns Status 204 on success and deletedUser object or error
 */
accountController.deleteAccount = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const deletedUser= await User.findOneAndDelete({ _id: userId });
    if (deletedUser === null) {
      return next({
        log: 'User could not be deleted.',
        status: 404,
        message: { error: 'An error occurred' },
      });
    }

    res.clearCookie('refreshToken');
    return res.status(200).json({
      message: 'User account deleted successfully',
      redirect: '/signup', // Adjust the redirect URL as needed
    });
  } catch (error) {
    console.error('userController.deleteUser Error:', error);
    return next({
      log: 'userController.deleteUser Error',
      message: { error: 'An error occurred' },
      status: 500,
    });
  }
};

export default accountController;
