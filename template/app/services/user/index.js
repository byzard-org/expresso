const {
  VerificationLink,
  Links,
  PasswordResetLink,
} = require("../../models/linkModel");
const ROUTES = require("../../routes/routes");
const LinkService = require("../link");
const MailService = require("../mail");
const RoutesService = require("../routes");

/**
 * Service to manage user's account (verify, send likns, etc..)
 */
class UserService {
  /**
   * Creates a new UserService instance for a given user.
   *
   * @param {Object} user - The user object.
   * @param {string} user.id - The user's ID.
   * @param {string} user.name - The user's name.
   * @param {string} user.email - The user's email address.
   * @param {boolean} user.accountVerified - Whether the user's account is verified.
   */
  constructor(user) {
    this.user = user;
  }

  /**
   * Static method to create a UserService instance for a given user.
   *
   * @param {Object} user - The user object.
   *
   * @returns {UserService} - A new instance of UserService.
   */
  static of(user) {
    return new UserService(user);
  }

  /**
   * Sends an account verification email to the user.
   *
   * This method generates a verification link for the user and sends a template-based email with the link.
   *
   * @param {boolean} [useApiUrl=false] If true, the link sent will include /api/users/ referred to the email verification route
   *
   * @returns {Promise<boolean>} - Returns `true` if the email was sent successfully, `false` otherwise.
   */
  async sendVerificationEmail(useApiUrl = false) {
    const userId = this.user.id;

    // Find existing verification link or create a new one if expired or not available.
    const available = await VerificationLink.find({ userId });
    var link = available.find((l) => !LinkService.hasExpired(l));

    if (!link) link = await LinkService.create(userId, Links.VERIFICATION);

    const url = useApiUrl
      ? `${RoutesService.host}${ROUTES.API_BASE}${ROUTES.USERS}${ROUTES.VERIFY_ACCOUNT}/${link.path}`
      : `${RoutesService.host}${ROUTES.VERIFY_ACCOUNT}/${link.path}`;

    // Send verification email with the generated URL.
    return await MailService.sendTemplateMail({
      subject: "Account Verification - [##NAME##]",
      template_path: "account-verification",
      template_var: {
        url: url,
        name: this.user.name,
      },
      to: [this.user.email],
    });
  }

  /**
   * Sends a password reset email to the user.
   *
   * This method generates a password reset link for the user and sends a template-based email with the link.
   *
   * @param {boolean} [useApiUrl=false] If true, the link sent will include /api/users/ referred to the password reset route
   *
   * @returns {Promise<boolean>} - Returns `true` if the email was sent successfully, `false` otherwise.
   */
  async sendPasswordResetEmail(useApiUrl = false) {
    const userId = this.user.id;

    // Find existing password reset link or create a new one if expired or not available.
    const available = await PasswordResetLink.find({ userId });
    var link = available.find((l) => !LinkService.hasExpired(l));

    if (!link) link = await LinkService.create(userId, Links.PASSWORD_RESET);
    const url = useApiUrl
      ? `${RoutesService.host}${ROUTES.API_BASE}${ROUTES.USERS}${ROUTES.RESET_PASSWORD}/${link.path}`
      : `${RoutesService.host}${ROUTES.RESET_PASSWORD}/${link.path}`;

    // Send password reset email with the generated URL.
    return await MailService.sendTemplateMail({
      subject: "Password Reset - [##NAME##]",
      template_path: "password-reset",
      template_var: {
        url: url,
        name: this.user.name,
      },
      to: [this.user.email],
    });
  }

  /**
   * Marks the user's account as verified.
   *
   * This method updates the user's `accountVerified` property and saves the updated user record.
   */
  async verifyUser() {
    this.user.accountVerified = true;
    await this.user.save();
  }

  /**
   * Resets the user's password.
   *
   * This method updates the user's password and saves the updated user record.
   *
   * @param {string} newPwd - The new password to set for the user.
   */
  async resetPassword(newPwd) {
    this.user.password = newPwd;
    await this.user.save();
  }
}

module.exports = UserService;
