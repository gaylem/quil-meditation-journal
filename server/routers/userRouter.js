//** USER ROUTER */

/* Includes: 
    1. POST /api/users/signup => createUser controller
    2. POST /api/users/login => verifyUser controller
    3. POST /api/users/token => authUser controller
    4. POST /api/users/logout => logoutUser controller
*/

// Imports
const express = require('express');
const router = express.Router();
const { signupUser, loginUser, authUser, logoutUser } = require('../controllers/userController');

/**
 * @route POST /api/users/signup
 * @description Signup user (creates access token)
 * @param {Object} req - The request object containing:
 *   - username: String
 *   - email: String
 *   - password: String
 */
router.post('/signup', signupUser);

/**
 * @route POST /api/users/login
 * @description Login user and generate access tokens
 * @access Private (requires username and password)
 * @param {Object} req - The request object containing:
 *   - req.body.username: String
 *   - req.body.password: String
 */
router.post('/login', loginUser);

/**
 * @route POST /api/users/token
 * @description Authenticates the access token in the request headers
 * @access Private (requires valid refresh token)
 * @param {Object} req - The request object containing the accessToken (String)
 */
router.post('/token', authUser);

/**
 * @route POST /api/users/logout
 * @description Logout user and remove refresh token
 * @param {Object} req - The request object containing the refreshToken in cookies
 */
router.post('/logout/:id', logoutUser);

module.exports = router;
