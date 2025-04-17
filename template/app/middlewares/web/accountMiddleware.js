const Errors = require("../../../config/errors");
const ROUTES = require("../../routes/routes");
const AppService = require("../../services");
const AuthService = require("../../services/auth");
const CookieService = require("../../services/cookies");

module.exports = async (req, res, next) => {
  try {
  const errors = Errors.from(req, res);

    const user = await AuthService.authUser(req);
    if (!user) {
      return res.redirect(ROUTES.LOGOUT_EXPIRED);
    }
    if (user.accountVerified != true) {
      return res.redirect(ROUTES.VERIFY_ACCOUNT);
    }

    if (user.accountLocked == true) {
      CookieService.of(req, res).clear(AppService.config.authToken);
      return res.render("login", {
        error: errors.code.ACCOUNT_LOCKED,
      });
    }
    return next();
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};
