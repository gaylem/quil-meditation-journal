//** USER ROUTER */

/* Includes: 
    1. POST /api/users/login => verifyUser controller
    2. POST /api/users/logout => logoutUser controller
    3. POST /api/users/signup => createUser controller
*/

const express = require('express');
const router = express.Router();
const { verifyUser, logoutUser, createUser } = require('../controllers/userController');

/**
 * @route POST /api/users/login
 * @description Login user and generate access tokens
 * @access Private (requires username and password)
 * @param {Object} req - The request object containing:
 *   - req.body.username: String
 *   - req.body.password: String
 */
router.post('/login', verifyUser);

/**
 * @route POST /api/users/logout
 * @description Logout user and remove refresh token
 * @param {Object} req - The request object containing:
 *   - refreshToken: String
 */
router.post('/logout', logoutUser);

/**
 * @route POST /api/users/signup
 * @description Signup user (creates access token)
 * @param {Object} req - The request object containing:
 *   - username: String
 *   - email: String
 *   - password: String
 */
router.post('/signup', createUser);

module.exports = router;
