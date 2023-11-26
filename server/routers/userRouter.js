const express = require('express');
const router = express.Router();
const { verifyUser, refreshTokens, logoutUser, createUser, updateUser, deleteUser } = require('../controllers/userController');

/**
 * @route POST /api/users/login
 * @description Login user
 * @access Private (creates access token)
 * Expected Body:
 *   - username: String
 *   - password: String
 */
router.post('/login', verifyUser);

/**
 * @route POST /api/users/token
 * @description Refresh access tokens
 * Expected Body:
 *   - refreshToken: String
 */
router.post('/token', refreshTokens);

/**
 * @route POST /api/users/logout
 * @description Logout user
 * Expected Body:
 *   - refreshToken: String
 */
router.post('/logout', logoutUser);

/**
 * @route POST /api/users/signup
 * @description Signup user
 * Expected Body:
 *   - username: String
 *   - password: String
 */
router.post('/signup', createUser);

/**
 * @route PUT /api/users/update/:userId
 * @description Update user by ID
 * @param userId
 */
router.put('/update/:userId', updateUser);

/**
 * @route DELETE /api/users/delete/:userId
 * @description Delete user by ID
 * @param userId
 */
router.delete('/delete/:userId', deleteUser);

module.exports = router;
