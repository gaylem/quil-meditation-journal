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

// Account controllers
const { downloadEntries, updateUsername, updateEmail, updatePassword, deleteAccount } = accountController;

// Rate limiters
import { downloadLimiter } from '../middlewares/rateLimiter.js';
import { usernameLimiter } from '../middlewares/rateLimiter.js';
import { emailLimiter } from '../middlewares/rateLimiter.js';
import { passwordLimiter } from '../middlewares/rateLimiter.js';

/**
 * @route GET /api/accounts/:userId
 * @description Get all entries by userId and download to CSV
 * @param userId
 * @access Private (requires access token)
 */
router.post('/download/:userId', downloadLimiter, downloadEntries);

/**
 * @route PATCH /api/accounts/:userId
 * @description Update username by userId
 * @param userId
 * @access Private (requires access token)
 */
router.patch('/username/:userId', usernameLimiter, updateUsername);

/**
 * @route PATCH /api/accounts/:userId
 * @description Update email
 * @param userId
 * @access Private (requires access token)
 */
router.patch('/email/:userId', emailLimiter, updateEmail);

/**
 * @route PATCH /api/accounts/update/:userId
 * @description Update password by userId
 * @param userId
 * @access Private (requires access token)
 */
router.patch('/pswd/:userId', passwordLimiter, updatePassword);

/**
 * @route DELETE /api/accounts/delete/:userId
 * @description Delete user by userId
 * @param userId
 * @access Private (requires access token)
 */
router.delete('/delete/:userId', deleteAccount);

export default router;
