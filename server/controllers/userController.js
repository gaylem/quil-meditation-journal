require('dotenv').config();
const { User } = require('../db/models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//* USER CONTROLLER
const userController = {};

userController.verifyAccessToken = (req, res, next) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  console.log('req.headers.authorization', req.headers.authorization);
  console.log('accessToken', accessToken);

  if (!accessToken) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET, { algorithms: ['HS256'] });

    console.log('decoded: ', decoded);
    res.locals.decoded = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid access token' });
  }
};

/**
 * Verify user in the database
 *
 * @param {Str} req.body.username
 * @param {Str} req.body.password
 *
 * @returns username, token
 */

userController.verifyUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.login(username, password);
    console.log('user: ', user);

    const obj = {
      id: user._id.toString(),
      username: user.username,
    };

    const token = User.createToken(obj);
    // Add token to database
    const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $push: { refreshTokens: token.accessToken } }, { new: true });

    const userId = updatedUser._id;
    console.log('updatedUser._id: ', updatedUser._id);

    return res.status(200).json({ username, token, userId });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Token refresh
 *
 *  @param {Str} req.body.token
 *
 * @returns newAccessToken
 */
userController.refreshTokens = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!process.env.REFRESH_SECRET) {
      throw Error('Refresh secret key is missing');
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    // TODO: Where is refreshTokens coming from?
    // Check if the refresh token is in the stored tokens
    if (!refreshTokens.includes(refreshToken)) {
      throw Error('Invalid refresh token');
    }

    // Call createToken to generate a new set of tokens
    const newTokenData = { _id: decoded._id }; // Customize this based on your user object
    const { accessToken, refreshToken: newRefreshToken } = User.createToken(newTokenData);

    // Update the user's refreshTokens array with the new refresh token
    await User.findOneAndUpdate({ _id: decoded._id }, { $push: { refreshTokens: newRefreshToken } }, { new: true });

    return res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Logout and clear refresh token
 *
 *  @param {Str} req.body.token
 *
 * @returns status 204
 */

userController.logoutUser = async (req, res) => {
  const { refreshToken } = req.body;
  console.log('refreshToken: ', refreshToken);

  try {
    // Find the user by refresh token and remove it
    const user = await User.findOneAndUpdate({ refreshTokens: refreshToken }, { $pull: { refreshTokens: refreshToken } }, { new: true });

    if (!user) {
      throw Error('Invalid refresh token');
    }

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
userController.createUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.signup(username, email, password);
    console.log(user);

    const userId = user.id;
    console.log('userId: ', userId);

    // create a token
    const token = User.createToken(user);
    console.log('token: ', token);
    return res.status(200).json({ username, userId, token });
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

    const encryptedPassword = await bcrypt.hash(password, process.env.SALT_WORK_FACTOR);

    const result = await User.findOneAndUpdate({ _id: userId }, { $set: { username, password: encryptedPassword } });

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

// TODO: Remove sessions
userController.deleteUser = async (req, res, next) => {
  try {
    // const { userId } = req.params;

    // const userDeleteResult = await User.findOneAndDelete({ _id: userId });

    // const sessionsDeleteResult = await Session.deleteMany({ userId: userId });

    // if (userDeleteResult === null || sessionsDeleteResult.deletedCount === 0) {
    //   return next({
    //     log: 'User or sessions could not be deleted.',
    //     status: 404,
    //     message: { error: 'An error occurred' },
    //   });
    // }

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

//* Find user by username

module.exports = userController;
