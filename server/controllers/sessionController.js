const { Session } = require('../db/models');
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
    const user_session = await Session.findOne({
      cookieId: req.cookies.ssid,
      userId: res.locals.user,
    });

    if (!user_session) {
      console.log('You must be logged in to access this page.');
      return res.redirect('/login');
    } else {
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

    if (!res.locals.user) {
      return next({
        log: 'No user ID found in res.locals.user.',
        status: 400,
        message: { error: 'An error occurred' },
      });
    }

    console.log(res.locals.user);

    const newSession = new Session({
      userId: res.locals.user._id,
      cookieId: sessionId,
    });

    await newSession.save();

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
