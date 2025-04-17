const ROUTES = {
  BASE: "/",
  API_BASE: "/api",

  VERIFY_ACCOUNT: "/account-verification",
  RESET_PASSWORD: "/reset-password",

  STORAGE_GET_FILE: "/storage/files/:filename",
  STORAGE_PUT_FILE: "/storage/files/",

  DOCS: "/api-docs",

  USERS: "/users",
  USER: "/user",

  FIND: "/:id",
  GET: "/get",
  GET_ATTRIBUTE: "/:attr",

  AUTH: "/auth",
  AUTH_LOGIN: "/login",
  AUTH_REGISTER: "/register",

  GOOGLE_AUTH: "/o/oauth2/auth/google",
  GOOGLE_AUTH_REDIRECT: "/o/oauth2/auth/google/redirect",
};

module.exports = ROUTES;
