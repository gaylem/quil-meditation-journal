const pool = require('./../db/pg-model');
const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcryptjs');
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
  try {
    // Deconstruct user
    console.log('Im here');
    const { username, password } = req.body;

    if (!username || !password)
      return next({
        log: 'Missing username or password in userController.verifyUser.',
        status: 400,
        message: { error: 'An error occurred' },
      });

    // Check if username and password exist together if so -> proceed
    // else -> throw error
    const text = `
    SELECT *
    FROM users
    WHERE username = $1;
    `;
    const value = [username];
    const user = await pool.query(text, value);

    if (!user.rows[0]._id) {
      console.log('no user found');
    }
    const comparison = await bcrypt.compare(password, user.rows[0].password);

    if (!comparison) {
      console.log('wrong password');
    } else {
      res.locals.user = user.rows[0]._id;
      // If we have a row we can move on to the next verification
      return next();
    }
  } catch (err) {
    const errObj = {
      log: 'userController.verifyUser Error',
      message: { error: 'An error occurred' },
      status: 500,
    };
    return next({ ...errObj, log: err.message });
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
    // Destructure user properties from the request body
    const { username, password } = req.body;

    if (!username || !password) {
      return next({
        log: 'Missing username or password in userController.createUser',
        status: 400,
        message: { error: 'An error occurred' },
      });
    } else {
      const checkUserQuery = `
        SELECT *
        FROM users
        WHERE username = $1;
      `;
      const checkUserValues = [username];
      const user = await pool.query(checkUserQuery, checkUserValues);

      if (user.rows.length === 0) {
        const encryptedPassword = await bcrypt.hash(password, SALT_WORK_FACTOR);
        const createUserQuery = `
        INSERT INTO users (username, password)
        VALUES ($1, $2)
        RETURNING _id;
        `;
        const createUserValues = [username, encryptedPassword];
        const result = await pool.query(createUserQuery, createUserValues);
        res.locals.user = result.rows[0]._id;
        return next();
      } else {
        return next({
          log: 'Username already exists',
          status: 409,
          message: { error: 'Username already exists' },
        });
      }
    }
  } catch (err) {
    const errObj = {
      log: 'userController.createUser Error',
      message: { error: 'An error occurred' },
      status: 500,
    };
    return next({ ...errObj, log: err.message });
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
    // Destructure
    const { userId } = req.params;
    const { username, password } = req.body;

    // Write statement to update
    const text = `
    UPDATE users
    SET
      username = $1,
      password = $2
      WHERE _id = $3
      RETURNING _id;
  `;
    const encryptedPassword = await bcrypt.hash(password, SALT_WORK_FACTOR);
    const values = [username, encryptedPassword, userId];
    const user = await pool.query(text, values);

    res.locals.user = user.rows[0]._id;

    return next();
  } catch (err) {
    const errObj = {
      log: 'userController.updateUser Error',
      message: { error: 'An error occurred' },
      status: 500,
    };
    return next({ ...errObj, log: err.message });
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

    // First, delete related sessions
    const deleteSessionsQuery = `
      DELETE FROM sessions
      WHERE user_id = $1;
    `;
    const sessionsDeleteResult = await pool.query(deleteSessionsQuery, [userId]);

    // Check if any sessions were deleted
    if (sessionsDeleteResult.rowCount > 0) {
      // If sessions were deleted, now you can safely delete the user
      const deleteUserQuery = `
        DELETE FROM users
        WHERE _id = $1;
      `;
      const userDeleteResult = await pool.query(deleteUserQuery, [userId]);

      if (userDeleteResult.rowCount > 0) {
        return next();
      } else {
        return next({
          log: 'User not found or could not be deleted.',
          status: 404,
          message: { error: 'An error occurred' },
        });
      }
    } else {
      return next({
        log: 'No sessions found for the user.',
        status: 404,
        message: { error: 'An error occurred' },
      });
    }
  } catch (err) {
    const errObj = {
      log: 'userController.deleteUser Error',
      message: { error: 'An error occurred' },
      status: 500,
    };
    return next({ ...errObj, log: err.message });
  }
};

module.exports = userController;
