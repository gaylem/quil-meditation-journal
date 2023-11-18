const { User } = require('../db/models');
const jwt = require('jsonwebtoken');

//* CREATE TOKEN
const createToken = _id => {
  if (!process.env.SECRET) {
    throw Error('Secret key is missing');
  }
  const token = jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
  console.log('Token generated:', token);
  return token;
};

//* USER CONTROLLER
const userController = {};

/**
 * Verify user in the database
 *
 * @param {Str} req.body.username
 * @param {Str} req.body.password
 *
 * @returns username, token
 */
userController.verifyUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.login(username, password);
    console.log('user: ', user);
    // create a token
    const token = createToken(user._id);
    console.log('token: ', token);
    return res.status(200).json({ username, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Refresh user tokens on logout
 *
 *  @param {Str} req.body.token
 *
 * @returns status 204
 */
userController.refreshTokens = async (req, res, next) => {
  try {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    return res.sendStatus(204);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Create user in the database
 *
 * @param {Int} req.body
 * @param {Int} res.locals.userId
 *
 * @returns username, token
 */
userController.createUser = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  console.log('username, email, password: ', username, email, password);

  try {
    const user = await User.signup(username, email, password);
    console.log('user: ', user);

    // create a token
    const token = createToken(user._id);
    console.log('token: ', token);
    return res.status(200).json({ username, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
/**
 * Update user in the database
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

    console.log('user updated');
    return res.status(200).json(res.locals.user);
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
 * Delete user from the database
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

    console.log('user deleted');
    return res.status(204).redirect('/signup');
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
