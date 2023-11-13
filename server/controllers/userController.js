const { User } = require('../db/models');
const jwt = require('jsonwebtoken');

const createToken = _id => {
  if (!process.env.SECRET) {
    throw Error('Secret key is missing');
  }
  const token = jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
  console.log('Token generated:', token);
  return token;
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
  const { username, password } = req.body;
  try {
    const user = await User.login(username, password);
    console.log(user);
    // create a token
    const token = createToken(user._id);
    console.log(token);
    res.status(200).json({ username, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
  const { username, email, password } = req.body;

  try {
    const user = await User.signup(username, email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ username, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
