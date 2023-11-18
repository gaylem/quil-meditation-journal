const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * Login user
 *
 * @param {Object} req.body
 * @param {String} req.body.username
 * @param {String} req.body.password
 *
 * @returns response status 200
 */
//
router.post('/login', userController.verifyUser, (req, res) => {
  console.log('login');
  return res.status(200).json(res.locals.user);
});

/**
 * Signup user
 *
 * @param {Object} req.body
 * @param {String} req.body.username
 * @param {String} req.body.password
 *
 * @returns response status 201
 */
router.post('/signup', userController.createUser, (req, res) => {
  console.log('signup');
  return res.status(201).redirect('/home');
});

/**
 * Update user
 *
 * @param {Int} req.params.userId
 *
 * @returns response status 200
 */
router.put('/update/:userId', userController.updateUser, (req, res) => {
  console.log('user updated');
  return res.sendStatus(200);
});

/**
 * Delete user
 *
 * @param {Int} req.params.userId
 *
 * @returns successful deletion status
 */
router.delete('/delete/:userId', userController.deleteUser, (req, res) => {
  console.log('user deleted');
  return res.status(204).redirect('/signup');
});

module.exports = router;
