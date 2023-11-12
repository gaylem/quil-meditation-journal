const cookieController = {};

/**
 * setSSIDCookie - store the user_id in a cookie
 */
cookieController.setSSIDCookie = async (req, res, next) => {
  await res.cookie('ssid', res.locals.user, { httpOnly: true });
  console.log("user", res.locals.user);
  return next();
};

module.exports = cookieController;
