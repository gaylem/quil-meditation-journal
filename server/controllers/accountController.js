//** ACCOUNT CONTROLLER */

//! None of these work right now and will need to be refactored when the account page is created

/* Functionality should include: 
    1. Update email address
    2. Update username
    3. Update password
    4. Delete user
*/

// Imports
import dotenv from 'dotenv';
dotenv.config();
import { User } from '../db/models.js';
import bcrypt from 'bcryptjs';

// accountController object that contains the methods below
const accountController = {};

/** // TODO: Split into three controllers for username, email, password changes from account page
 * @route PUT /api/users/update/:userId
 * @description Updates user information.
 * @param userId
 * Expected Body:
 *   - username: String
 *   - password: String
 * @returns {Object} - JSON with updated user information
 */
accountController.updateAccount = async (req, res, next) => {
  try {
    // Extract the userId, username, and password from params and body
    const { userId } = req.params;
    const { username, password } = req.body;
    // Encrypt the password before updating the user
    const encryptedPassword = bcrypt.hash(password, process.env.SALT_WORK_FACTOR);
    // Update the user data
    const result = await User.findOneAndUpdate({ _id: userId }, { $set: { username, password: encryptedPassword } });
    // If nothing is returned, throw an error
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
 * @route DELETE /api/users/delete/:userId
 * @description Deletes a user from the database.
 * Expected Parameters:
 *   - userId: Integer
 * @returns {Number} - Status 204 on success
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