//TODO: How do I do this with Mongo?
const pool = require('./../db/pg-model');

const sessionController = {};

/**
 * isLoggedIn - find the appropriate session for this request in the user_session database, then
 * verify whether or not the session is still valid.
 *
 * @param {Int} req.cookies.ssid
 * @param {Int} res.locals.user
 *
 * @returns next()
 */
sessionController.isLoggedIn = async (req, res, next) => {
  try {
    // documents in the sessions collection will expire due to the schema expire setting

    const text = `
    SELECT *
    FROM user_session
    WHERE cookie_id=($1) AND user_id=($2);
    `;
    const values = [req.cookies.ssid, res.locals.user];
    const user_session = await pool.query(text, values);

    if (!user_session) {
      // no session found
      console.log('YOU ARE NOT LOGGED IN. NO SESSION!');
      return res.redirect('/login');
    } else {
      // session found then what?
      return next();
    }
  } catch (err) {
    const errObj = {
      log: 'sessionController.isLoggedIn Error',
      message: { error: 'An error occurred' },
      status: 500,
    };
    return next({ ...errObj, log: err.message });
  }
};

/**
 * startSession - create and save a new Session into the user_session database.
 *
 * @param {Int} res.locals.user
 *
 * @returns res.locals
 */
sessionController.startSession = async (req, res, next) => {
  try {
    const text = `
      INSERT INTO sessions (user_id, cookie_id, date_of_creation)
      VALUES ($1, $2, $3);
    `;
    function generateUniqueSessionId() {
      // Generate a random string
      const randomString = Math.random().toString(36).substr(2, 10);
      // Get the current timestamp
      const timestamp = new Date();
      // Combine the random string and timestamp to create a unique ID
      const sessionId = `${randomString}_${timestamp}`;
      return sessionId;
    }

    const sessionId = generateUniqueSessionId();
    console.log(sessionId);
    const timestamp = new Date().toISOString();
    const values = [res.locals.user, sessionId, timestamp];

    await pool.query(text, values);
    console.log(pool.query(text, values));

    return next();
  } catch (err) {
    console.error('Error executing database query:', err);

    return next({
      log: 'Error occurred in sessionController.startSession.',
      status: 500,
      message: { error: 'An error occurred' },
    });
  }
};

module.exports = sessionController;
