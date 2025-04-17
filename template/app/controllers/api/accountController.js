const Errors = require("../../../config/errors");
const {
  VerificationLink,
  PasswordResetLink,
} = require("../../models/linkModel");
const User = require("../../models/userModel");
const Link = require("../../models/linkModel");
const ROUTES = require("../../routes/routes");
const LinkService = require("../../services/link");
const UserService = require("../../services/user");

/**
 *
 * @param {Link} link
 * @param {import("express").Response} res
 * @param {*} error
 */
const renderPasswordResetForm = (link, res, error) => {
  const html = `<form action="${ROUTES.API_BASE}${ROUTES.USERS}${
    ROUTES.RESET_PASSWORD
  }/${
    link?.path
  }" method="post" style="display: flex; flex-direction: column;font-family:sans-serif;
gap: 1em; height: 100vh; max-width: 300px;  margin: 0 auto; justify-content: center;"><input type="text" name="password" id="" style="padding: 1em;" placeholder="Nouveau mot de passe"><input type="submit" value="${
    res.locals.tr.password_reset_title
  }" style="padding: 1em; background-color: black; color: white; border: none; cursor:pointer"><span style="color:red; font-size:smaller; text-align:center">${
    error?.message ?? ""
  }</span></form>`;

  if (error) res.status(400).send(html);
  else res.send(html);
};

class ApiAccountController {

  static async sendVerificationMail(req, res) {
    const errors = Errors.from(req, res);
    try {
      const user = await User.findById(req.body.id);

      if (!user) {
        return errors.json(errors.code.USER_NOT_FOUND);
      }

      if (user.accountVerified) {
        return errors.json(errors.code.USER_NOT_UPDATED);
      }

      const email_sent = await UserService.of(user).sendVerificationEmail(true);

      return res.json({ sent: email_sent });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err.message });
    }
  }

  static async verifyAccount(req, res) {
    const errors = Errors.from(req, res);

    try {
      const link = await VerificationLink.findOne({ path: req.params.id });

      if (!link) {
        return errors.json(errors.code.PAGE_NOT_FOUND);
      }

      const user = await User.findById(link.userId);

      if (!user) {
        return errors.json(errors.code.USER_NOT_FOUND);
      }

      if (await LinkService.verify(link, user.id)) {
        await UserService.of(user).verifyUser();
        return res.send("OK");
      }

      return res.status(400).json("Invalid link");
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err.message });
    }
  }

  static async sendPasswordResetMail(req, res) {
    const errors = Errors.from(req, res);
    try {
      const email = req.body.email;
      const user = await User.findOne({ email });

      if (!user) {
        return errors.json(errors.code.USER_NOT_FOUND);
      }

      const email_sent = await UserService.of(user).sendPasswordResetEmail(
        true
      );

      return res.json({ sent: email_sent });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err.message });
    }
  }

  static async passwordResetHTML(req, res) {
    const errors = Errors.from(req, res);
    try {
      const link = await PasswordResetLink.findOne({ path: req.params.id });

      if (!link) {
        return errors.json(errors.code.PAGE_NOT_FOUND);
      }

      if (LinkService.hasExpired(link))
        return res.status(400).json("Invalid link");

      return renderPasswordResetForm(link, res);
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err.message });
    }
  }

  static async resetPassword(req, res) {
    const errors = Errors.from(req, res);
    try {
      const link = await PasswordResetLink.findOne({ path: req.params.id });

      if (!link) {
        return renderPasswordResetForm(link, res, errors.code.PAGE_NOT_FOUND);
      }

      if (!req.body.password || req.body.password.length < 6) {
        return renderPasswordResetForm(link, res, errors.code.PASSWORD_LENGTH);
      }

      const user = await User.findById(link.userId);

      if (await LinkService.verify(link, user.id)) {
        await UserService.of(user).resetPassword(req.body.password);
        return res.send("OK");
      }

      return res.status(400).json("Invalid link");
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = ApiAccountController;
