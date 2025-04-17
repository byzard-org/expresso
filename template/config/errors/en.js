exports.code = Object.freeze({
  AUTH_TOKEN_MISSING: {
    message: "Authentication token is missing",
    status: 401,
    code: "AUTH_TOKEN_MISSING",
  },
  AUTH_TOKEN_INVALID: {
    message: "Authentication token is invalid",
    status: 401,
    code: "AUTH_TOKEN_INVALID",
  },
  EMAIL_REQUIRED: {
    message: "Email is required",
    status: 401,
    code: "EMAIL_REQUIRED",
  },
  INVALID_EMAIL: {
    message: "Invalid email",
    status: 401,
    code: "INVALID_EMAIL",
  },
  FIELD_REQUIRED: {
    message: "One or more required fields are missing",
    status: 401,
    code: "FIELD_REQUIRED",
  },
  PASSWORD_REQUIRED: {
    message: "Password is required",
    status: 401,
    code: "PASSWORD_REQUIRED",
  },
  PASSWORD_NOT_SAME: {
    message: "Passwords do not match",
    status: 401,
    code: "PASSWORD_NOT_SAME",
  },
  PASSWORD_LENGTH: {
    message: "Password must be at least 6 characters long",
    status: 401,
    code: "PASSWORD_LENGTH",
  },
  USER_NOT_EXIST: {
    message: "This user does not exist",
    status: 401,
    code: "USER_NOT_EXIST",
  },
  USER_ATTR_NOT_FOUND: {
    message: "Attribute not found",
    status: 404,
    code: "USER_ATTR_NOT_FOUND",
  },
  PASSWORD_INCORRECT: {
    message: "The password is incorrect",
    status: 401,
    code: "PASSWORD_INCORRECT",
  },
  SERVER_ERROR: {
    message: "Server error",
    status: 500,
    code: "SERVER_ERROR",
  },
  USER_EXISTS: {
    message: "User already exists",
    status: 400,
    code: "USER_EXISTS",
  },
  INVALID_REQUEST: {
    message: "Invalid request. Try again..",
    status: 400,
    code: "INVALID_REQUEST",
  },
  USER_NOT_CREATED: {
    message: "User not created",
    status: 400,
    code: "USER_NOT_CREATED",
  },
  USER_NOT_FOUND: {
    message: "User not found",
    status: 404,
    code: "USER_NOT_FOUND",
  },
  USER_NOT_UPDATED: {
    message: "User not updated",
    status: 400,
    code: "USER_NOT_UPDATED",
  },
  USER_NOT_DELETED: {
    message: "User not deleted",
    status: 400,
    code: "USER_NOT_DELETED",
  },
  USER_NOT_AUTHORIZED: {
    message: "User not authorized",
    status: 401,
    code: "USER_NOT_AUTHORIZED",
  },
  USER_NOT_AUTHENTICATED: {
    message: "User not authenticated",
    status: 401,
    code: "USER_NOT_AUTHENTICATED",
  },
  PAGE_NOT_FOUND: {
    message: "Page not found",
    status: 404,
    code: "PAGE_NOT_FOUND",
  },
  INVALID_LOGIN_METHOD: {
    "message": "The login method is invalid for this account.",
    "status": 401,
    "code": "INVALID_LOGIN_METHOD"
  },

  SESSION_EXPIRED: {
    message: "Your session has expired.",
    status: 440,
    code: "SESSION_EXPIRED",
  },
  ACCOUNT_LOCKED: {
    message: "Account locked. Please contact an assistance.",
    status: 401,
    code: "ACCOUNT_LOCKED",
  },
});
