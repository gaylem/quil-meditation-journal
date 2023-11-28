//** ACCOUNT CONTROLLER */

//! None of these work right now and will need to be refactored when the account page is created

/* Functionality should include: 
    1. Update email address
    2. Update username
    3. Update password
    4. Delete user
*/

const express = require('express');
const router = express.Router();
const { updateAccount, deleteAccount } = require('../controllers/accountController');

/**
 * @route PUT /api/users/update/:userId
 * @description Update user by ID
 * @param userId
 * @access Private (requires access token)
 */
router.put('/update/:userId', updateAccount);

/**
 * @route DELETE /api/users/delete/:userId
 * @description Delete user by ID
 * @param userId
 * @access Private (requires access token)
 */
router.delete('/delete/:userId', deleteAccount);

module.exports = router;