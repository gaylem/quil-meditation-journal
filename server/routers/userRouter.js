//** USER ROUTER */

/* Includes: 
    1. POST /api/users/signup => createUser controller
    2. POST /api/users/login => verifyUser controller
    3. POST /api/users/token => authUser controller
    4. POST /api/users/logout => logoutUser controller
*/

// Imports
import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js';
const { signupUser, loginUser, authUser, logoutUser } = userController

/**
 * @route POST /api/users/signup
 * @description Signup user (creates access and refresh tokens)
 * @param {Object} req - The request object containing:
 *   - username: String
 *   - email: String
 *   - password: String
 */
router.post('/signup', signupUser);

/**
 * @route POST /api/users/login
 * @description Login user (creates access and refresh tokens)
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
 * @description Logout user and remove refresh token from database and cookies
 * @param {Object} req - The request object containing the refreshToken in cookies
 */
router.post('/logout/:id', logoutUser);

export default router;
