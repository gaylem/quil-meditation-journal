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
  console.log('userId: ', userId);
  
  try {
    const allEntries = await Entry.find({userId}).select('-_id body createdAt updatedAt iv');
    console.log('allEntries: ', allEntries);

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
    console.error('Error generating CSV:', error);
    res.status(500).send('Internal Server Error');
  }
};

/**
 * @route PUT /api/users/:userId
 * @description Updates username
 * @param userId
 * @param newUsername
 * @returns {Object} - JSON with updated username and 200 status, or error message
 */
accountController.updateUsername = async (req, res) => {
  try {
    // Extract the userId, username, and password from params and body
    const { userId } = req.params;
    const { newUsername } = req.body;
    // Check if newUsername already exists
    const user = await User.findOne({ username: newUsername });
    // Throw error if username already exists
    if (user) {
      return res.status(404).json({
        log: 'userController.updateUsername: Username already exists',
        status: 404,
        message: 'Username not available.',
      });
    }
    // Update the user data
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $set: { username: newUsername } });
    // If nothing is returned, throw an error
    if (result.matchedCount === 0) {
      return {
        log: 'User not found.',
        status: 404,
        message: { error: 'User not found' },
      };
    }
    res.locals.user = updatedUser;
    return res.status(200).json(res.locals.user);
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
    const { newEmail } = req.body;
    // Update the user data
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $set: { email: newEmail } });
    // If nothing is returned, throw an error
    if (result.matchedCount === 0) {
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
    const { oldPassword, newPassword, confirmedNewPassword } = req.body;
    // Check if newPassword & confirmedNewPassword match
    if (newPassword !== confirmedNewPassword) {
      return res.status(401).json({
        log: 'accountController: newPassword and confirmedPassword do not match',
        status: 401,
        message: 'Passwords do not match.',
      });
    }
    // Find user by userId
    const user = await User.findOne({ _id: userId });
    // Throw error if username is incorrect
    if (!user) {
      return res.status(404).json({
        log: 'userController.loginUser: No user found',
        status: 404,
        message: 'Username or password are incorrect.',
      });
    }
    // Confirm old password matches user password
    const match = await bcrypt.compare(oldPassword, user.password);
    // Throw error if password is incorrect
    if (!match) {
      return res.status(404).json({
        log: 'accountController.updatePassword: Incorrect password',
        status: 404,
        message: 'Something went wrong, please try again.',
      });
    }
    // Encrypt the password before updating the user
    const encryptedPassword = bcrypt.hash(newPassword, process.env.SALT_WORK_FACTOR);
    // Update the user data
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $set: { password: encryptedPassword } });
    // If nothing is returned, throw an error
    if (updatedUser.matchedCount === 0) {
      return {
        log: 'User not found.',
        status: 404,
        message: { error: 'User not found' },
      };
    }
    return res.status(200).redirect('/login');
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

export default accountController;
