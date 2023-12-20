//** ACCOUNT ROUTER */

/* Includes:  
    1. GET downloadEntries by userId
    2. PATCH updateUsername by userId
    3. PATCH updateEmail by userId
    4. PATCH updatePassword by userId
    4. DELETE deleteAccount by userId
*/

import express from 'express';
const router = express.Router();
import accountController from '../controllers/accountController.js';

const { downloadEntries, updateUsername, updateEmail, updatePassword, deleteAccount } = accountController;

/**
 * @route GET /api/accounts/:userId
 * @description Get all entries by userId and download to CSV
 * @param userId
 * @access Private (requires access token)
 */
router.post('/download/:userId', downloadEntries);

/**
 * @route PATCH /api/accounts/:userId
 * @description Update username by userId
 * @param userId
 * @access Private (requires access token)
 */
router.patch('/username/:userId', updateUsername);

/**
 * @route PATCH /api/accounts/:userId
 * @description Update email
 * @param userId
 * @access Private (requires access token)
 */
router.patch('/email/:userId', updateEmail);

/**
 * @route PATCH /api/accounts/update/:userId
 * @description Update password by userId
 * @param userId
 * @access Private (requires access token)
 */
router.patch('/pswd/:userId', updatePassword);

/**
 * @route DELETE /api/accounts/delete/:userId
 * @description Delete user by userId
 * @param userId
 * @access Private (requires access token)
 */
router.delete('/delete/:userId', deleteAccount);

export default router;
