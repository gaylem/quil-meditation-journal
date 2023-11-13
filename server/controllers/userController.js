const models = require('./../db/models');
const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createToken = _id => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

const userController = {};

/**
 * If the username and password are not found in the users database
 * we should throw an error because this combination was not found.
 *
 * @param {Str} req.body.username
 * @param {Str} req.body.password
 *
 * @returns res.locals.user
 */
userController.verifyUser = async (req, res, next) => {
  console.log("it got this far");
  try {
    // Deconstruct user
    const { username, password } = req.body;

    if (!username || !password)
      return next({
        log: 'Missing username or password in userController.verifyUser.',
        status: 400,
        message: { error: 'An error occurred' },
      });

    const user = await models.User.findOne({ username });

    if (!user) {
      console.log('no user found');
    }

    const comparison = await bcrypt.compare(password, user.password);

    if (!comparison) {
      console.log('wrong password');
    } else {
      res.locals.user = user._id;
      return next();
    }
  } catch (err) {
    console.error('userController.verifyUser Error:', err);
    return next({
      log: 'userController.verifyUser Error',
      message: { error: 'An error occurred' },
      status: 500,
    });
  }
};

/**
 * createUser - create and save a new User into the users database.
 *
 * @param {Int} req.body
 * @param {Int} res.locals.userId
 *
 * @returns res.locals.user
 */
userController.createUser = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      return next({
        log: 'Missing username or password in userController.createUser',
        status: 400,
        message: { error: 'An error occurred' },
      });
    }

    const existingUser = await models.User.findOne({ username });

    if (existingUser) {
      return next({
        log: 'Username already exists',
        status: 409,
        message: { error: 'Username already exists' },
      });
    }

    const encryptedPassword = await bcrypt.hash(password, SALT_WORK_FACTOR);
    const result = await models.User.create({
      username,
      password: encryptedPassword,
      email,
    });

    res.locals.user = await models.User.findOne({ username });

    return next();
  } catch (err) {
    console.error('userController.createUser Error:', err);
    return next({
      log: 'userController.createUser Error',
      message: { error: 'An error occurred' },
      status: 500,
    });
  }
};
/**
 * updateUser - updates username and hashed password in the users database.
 *
 * @param {Str} req.body.username
 * @param {Str} req.body.password
 * @param {Int} req.params.userId
 *
 * @returns res.locals.user
 */
userController.updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { username, password } = req.body;

    const encryptedPassword = await bcrypt.hash(password, SALT_WORK_FACTOR);

    const result = await models.User.findOneAndUpdate({ _id: userId }, { $set: { username, password: encryptedPassword } });

    if (result.matchedCount === 0) {
      return next({
        log: 'User not found.',
        status: 404,
        message: { error: 'User not found' },
      });
    }

    res.locals.user = userId;
    return next();
  } catch (err) {
    console.error('userController.updateUser Error:', err);
    return next({
      log: 'userController.updateUser Error',
      message: { error: 'An error occurred' },
      status: 500,
    });
  }
};

/**
 * deleteUser - deletes a User from the users database.
 *
 * @param {Int} req.params.userId
 *
 * @returns to login page
 */
userController.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const userDeleteResult = await models.User.findOneAndDelete({ _id: userId });

    const sessionsDeleteResult = await models.Session.deleteMany({ userId: userId });

    if (userDeleteResult === null || sessionsDeleteResult.deletedCount === 0) {
      return next({
        log: 'User or sessions could not be deleted.',
        status: 404,
        message: { error: 'An error occurred' },
      });
    }

    return next();
  } catch (err) {
    console.error('userController.deleteUser Error:', err);
    return next({
      log: 'userController.deleteUser Error',
      message: { error: 'An error occurred' },
      status: 500,
    });
  }
};

module.exports = userController;
