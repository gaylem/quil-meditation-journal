const cookieController = {};

/**
 * setSSIDCookie - store the user_id in a cookie
 */
cookieController.setSSIDCookie = async (req, res, next) => {
  const oneHourFromNow = new Date();
  oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);

  await res.cookie('ssid', res.locals.user, { httpOnly: true, secure: true, expires: oneHourFromNow });
  return next();
};

module.exports = cookieController;
