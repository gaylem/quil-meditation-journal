const userController = require('../controllers/userController');
const cookieController = require('../controllers/cookieController');
const sessionController = require('../controllers/sessionController');
const express = require('express');
const router = express.Router();

/**
 * login
 *
 * @param {Object} req.body
 * @param {String} req.body.username
 * @param {String} req.body.password
 *
 * @returns response status 200
 */
//
router.post('/login', userController.verifyUser, cookieController.setSSIDCookie, sessionController.startSession, (req, res) => {
  return res.status(200).json(res.locals.user);
});

/**
 *
 * @param {Object} req.body
 * @param {String} req.body.username
 * @param {String} req.body.password
 *
 * @returns response status 201
 */
router.post('/signup', userController.createUser, cookieController.setSSIDCookie, sessionController.startSession, (req, res) => {
  console.log('test');
  return res.status(201).json(res.locals.user);
});

/**
 *
 * @param {Int} req.params.userId
 *
 * @returns response status 200
 */
router.put('/update/:userId', userController.updateUser, (req, res) => {
  return res.sendStatus(200);
});

/**
 *
 * @param {Int} req.params.userId
 *
 * @returns successful deletion status
 */
router.delete('/delete/:userId', userController.deleteUser, (req, res) => {
  // TODO: Double check if this will redirect as expected once we have the FE set up
  return res.status(204).redirect('/signup');
});

module.exports = router;
