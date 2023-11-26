const express = require('express');
const router = express.Router();
const { verifyUser, refreshTokens, logoutUser, createUser, updateUser, deleteUser } = require('../controllers/userController');

/**
 * Route: POST /api/users/login
 * Description: Login user
 * Expected Body:
 *   - username: String
 *   - password: String
 */
router.post('/login', verifyUser);

/**
 * Route: POST /api/users/token
 * Description: Refresh access tokens
 * Expected Body:
 *   - refreshToken: String
 */
router.post('/token', refreshTokens);

/**
 * Route: POST /api/users/logout
 * Description: Logout user
 * Expected Body:
 *   - refreshToken: String
 */
router.post('/logout', logoutUser);

/**
 * Route: POST /api/users/signup
 * Description: Signup user
 * Expected Body:
 *   - username: String
 *   - password: String
 */
router.post('/signup', createUser);

/**
 * Route: PUT /api/users/update/:userId
 * Description: Update user by ID
 * Expected Parameters:
 *   - userId: Integer
 */
router.put('/update/:userId', updateUser);

/**
 * Route: DELETE /api/users/delete/:userId
 * Description: Delete user by ID
 * Expected Parameters:
 *   - userId: Integer
 */
router.delete('/delete/:userId', deleteUser);

module.exports = router;
