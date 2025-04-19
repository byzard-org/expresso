const User = require("../../models/userModel");
const ROUTES = require("../../routes/routes");
const { e500, e400 } = require("../../middlewares/errorHandler");
const CookieService = require("../../services/cookies");
const AuthService = require("../../services/auth");
const AppService = require("../../services");
const Errors = require("../../../config/errors");
const MailService = require("../../services/mail");
const UploadService = require("../../services/upload");

class AuthController {
  static async login(req, res) {
    try {
      var expiredCode = CookieService.of(req, res).get("_exp") || 0;
      if (expiredCode == 1) {
        CookieService.of(req, res).clear("_exp");

        return res.render("login", {
          error: Errors.from(req, res).code.SESSION_EXPIRED,
        });
      }
      return res.render("login", { redirect: req.query.redirect });
    } catch (err) {
      console.log(err.message);
      req.error = err;
      e400(req, res);
    }
  }
  static async loginSubmit(req, res) {
    const errors = Errors.from(req, res);
    let redirect = req.query.redirect;
    try {
      req.body.email = req.body.email?.toLowerCase();

      const { email, password } = req.body;

      if (!email) {
        return res.render("login", {
          body: req.body,
          error: errors.code.EMAIL_REQUIRED,
          redirect,
        });
      }
      if (!password) {
        return res.render("login", {
          body: req.body,
          error: errors.code.PASSWORD_REQUIRED,
          redirect,
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.render("login", {
          body: req.body,
          error: errors.code.USER_NOT_EXIST,
          redirect,
        });
      }

      if (!user.password) {
        return res.render("login", {
          body: req.body,
          error: errors.code.INVALID_LOGIN_METHOD,
          redirect,
        });
      }

      if (!(await user.comparePassword(password))) {
        return res.render("login", {
          body: req.body,
          error: errors.code.PASSWORD_INCORRECT,
          redirect,
        });
      }
      const token = AuthService.generateToken(user);

      CookieService.of(req, res).set(AppService.config.authToken, token);

      redirect ??= ROUTES.BASE;
      res.redirect(redirect);
    } catch (err) {
      console.log(err);
      req.error = err;
      e500(req, res);
    }
  }

  static async logout(req, res) {
    try {
      const expNumber = req.query._exp || 0;
      CookieService.of(req, res).clear(AppService.config.authToken);
      CookieService.of(req, res).set("_exp", expNumber);
      return res.redirect(ROUTES.LOGIN);
    } catch (err) {
      console.log(err);
      console.log(err.message);
      req.error = err;
      e400(req, res);
    }
  }

  static async register(req, res) {
    try {
      return res.render("register", { redirect: req.query.redirect });
    } catch (err) {
      console.log(err.message);
      req.error = err;
      e400(req, res);
    }
  }

  static async registerSubmit(req, res) {
    const errors = Errors.from(req, res);
    let redirect = req.query.redirect;
    try {
      req.body.email = req.body.email?.toLowerCase();

      const user = new User(req.body);

      if (!MailService.isEmail(user.email)) {
        UploadService.deleteUploadedFiles([req.file]);
        return res.render("register", {
          error: errors.code.INVALID_EMAIL,
          body: req.body,
          redirect,
        });
      }

      if (req.file) user.image = UploadService.getRoutePath(req.file.filename);

      user.password = user.password?.trim();
      user.name = user.name?.trim();

      if (!user.password) {
        UploadService.deleteUploadedFiles([req.file]);

        return res.render("register", {
          error: errors.code.PASSWORD_REQUIRED,
          body: req.body,
          redirect,
        });
      }

      if (user.password.length < 6) {
        UploadService.deleteUploadedFiles([req.file]);

        return res.render("register", {
          error: errors.code.PASSWORD_LENGTH,
          body: req.body,
          redirect,
        });
      }

      if (user.password != req.body["password-repeat"]) {
        UploadService.deleteUploadedFiles([req.file]);
        return res.render("register", {
          error: errors.code.PASSWORD_NOT_SAME,
          body: req.body,
          redirect,
        });
      }
      await user.save();

      const token = AuthService.generateToken(user);

      CookieService.of(req, res).set(AppService.config.authToken, token);

      redirect ??= ROUTES.BASE;
      res.redirect(redirect);
    } catch (err) {
      // console.log(err);
      UploadService.deleteUploadedFiles([req.file]);

      if (err.message.includes("is required")) {
        return res.render("register", {
          error: errors.code.FIELD_REQUIRED,
          body: req.body,
          redirect,
        });
      }

      if (err.code === 11000)
        return res.render("register", {
          error: errors.code.USER_EXISTS,
          body: req.body,
          redirect,
        });

      return res.render("register", {
        error: errors.code.USER_NOT_CREATED,
        body: req.body,
      });
    }
  }

  static async googleLogin(req, res) {
    try {
      const google_user = req.google_user;
      let user = await User.findOne({ email: google_user.email });
      if (!user) {
        user = new User();
        user.email = google_user.email;
        user.accountVerified = google_user.email_verified;
        user.name = google_user.name;
        user.image = google_user.picture;
        await user.save();
      }

      const token = AuthService.generateToken(user);
      CookieService.of(req, res).set(AppService.config.authToken, token);

      return res.redirect(ROUTES.BASE);
    } catch (err) {
      console.log(err.message);
      req.error = err;
      e400(req, res);
    }
  }
}

module.exports = AuthController;
