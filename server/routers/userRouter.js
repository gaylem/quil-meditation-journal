const express = require('express');
const router = express.Router();
const { verifyUser, logoutUser, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { verifyAccessToken, refreshTokens } = require('../controllers/authController');

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
// TODO: Add verifyAccessToken?
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
 *   - email: String
 *   - password: String
 */
router.post('/signup', createUser);

/**
 * @route PUT /api/users/update/:userId
 * @description Update user by ID
 * @param userId
 * @access Private (requires access token)
 */
// TODO: Make sure this works with verifyAccessToken
router.put('/update/:userId', verifyAccessToken, updateUser);

/**
 * @route DELETE /api/users/delete/:userId
 * @description Delete user by ID
 * @param userId
 * @access Private (requires access token)
 */
// TODO: Make sure this works with verifyAccessToken
router.delete('/delete/:userId', verifyAccessToken, deleteUser);

module.exports = router;
