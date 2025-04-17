const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const AppService = require("..");

/**
 * Service for sending campaigns mails and template mails
 */
class MailService {
  static #config = AppService.config;

  static transporter = nodemailer.createTransport({
    host: this.#config.mailerHost,
    port: this.#config.mailerPort,
    secure: this.#config.mailerPort == 465,
    auth: {
      user: this.#config.mailerUser,
      pass: this.#config.mailerPwd,
    },
    tls: {
      rejectUnauthorized: this.#config.mailerPort == 465,
    },
  });

  /**
   * Sends a plain text or HTML email to the specified recipients.
   *
   * @param {Object} params - The email parameters.
   * @param {Array<string>} params.to - An array of email addresses to send the email to.
   * @param {string} params.subject - The subject of the email.
   * @param {string} [params.text] - The plain text version of the email content.
   * @param {string} [params.html] - The HTML version of the email content.
   *
   * @returns {Promise<void>} - A promise that resolves when the email has been sent.
   */
  static async sendMail({ to, subject, text, html }) {
    const options = {
      from: '"' + this.#config.mailerAppName + '" ' + this.#config.mailerUser,
      to: to.join(","),
      subject,
      text,
      html,
    };
    await this.transporter.sendMail(options);
  }

  /**
   * Sends an email with a template by replacing placeholder variables in the HTML content.
   *
   * @param {Object} params - The email parameters.
   * @param {string} params.subject - The subject of the email.
   * @param {string} [params.template_path="index"] - The path to the template file (relative to the 'template' directory).
   * @param {Object} [params.template_var={}] - The variables to replace in the template (key-value pairs).
   * @param {Array<string>} [params.to=[]] - An array of email addresses to send the email to.
   *
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the email was successfully sent, `false` otherwise.
   */
  static async sendTemplateMail({
    subject,
    template_path = "index",
    template_var = {},
    to = [],
  }) {
    try {
      if (!template_path.endsWith(".html")) template_path += ".html";

      var content = fs.readFileSync(
        path.join(__dirname, "template", template_path),
        { encoding: "utf-8" }
      );

      const receivers = [...to];

      for (let key of Object.keys(template_var)) {
        content = content.replaceAll(
          new RegExp(`#{${key}}`, "ig"),
          template_var[key]
        );
      }

      await this.sendMail({
        to: receivers,
        subject,
        html: content,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /**
   * Validates if the provided string is a valid email address.
   *
   * @param {string} email - The email address to validate.
   * @returns {boolean} - Returns `true` if the email address is valid, `false` otherwise.
   */
  static isEmail(email) {
    const r = /\S+@\S+\.\S+/;
    return r.test(email);
  }
}

module.exports = MailService;
