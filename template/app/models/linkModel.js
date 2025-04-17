const mongoose = require("mongoose");
const DateService = require("../services/date");

const linkSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
      unique: true,
    },
    expireAt: {
      type: Date,
      default: () => DateService.addToDate({ h: 1 }),
    },
    userId: {
      type: String,
      required: true,
    },
    type: { type: String }, // Discriminator
  },
  {
    discriminatorKey: "type",
    timestamps: true,
  }
);

const Links = {
  VERIFICATION: "verification",
  PASSWORD_RESET: "password-reset",
};

const Link = mongoose.model("link", linkSchema);

const VerificationLink = Link.discriminator(
  Links.VERIFICATION,
  new mongoose.Schema({})
);
const PasswordResetLink = Link.discriminator(
  Links.PASSWORD_RESET,
  new mongoose.Schema({})
);

module.exports = {
  Link,
  VerificationLink,
  PasswordResetLink,
  Links
};
