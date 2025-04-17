const dotenv = require("dotenv");
dotenv.config();

var dbUri;
if (process.env.MONGODB_URI) {
  if (process.env.MONGODB_URI.endsWith("/"))
    process.env.MONGODB_URI = process.env.MONGODB_URI.slice(0, -1);
  let params;
  if (process.env.MONGODB_URI.includes("?")) {
    params = process.env.MONGODB_URI.split("?")[1];
    process.env.MONGODB_URI = process.env.MONGODB_URI.split("?")[0];
  }

  dbUri = `${process.env.MONGODB_URI}/${process.env.MONGODB_DBNAME}${params ? "?" + params : ""
    }`;
} else {
  dbUri = `${process.env.MONGODB_HOST || "127.0.0.1"}:${process.env.MONGODB_PORT || 27017
    }/${process.env.MONGODB_DBNAME}`;

  if (process.env.MONGODB_USER && process.env.SETUP_DB == "true") {
    if (!process.env.MONGODB_PASSWORD)
      console.log("WARNING: Login DB without password.");
    dbUri = `${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${dbUri}`;
  }
  dbUri = `mongodb://${dbUri}`;
}
const environment = process.env.NODE_ENV || "development";
module.exports = {
  dbUri,
  environment,
  port: process.env.PORT || 3000,
  dbHost: process.env.MONGODB_HOST,
  dbPort: process.env.MONGODB_PORT,
  dbName: process.env.MONGODB_DBNAME || "",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  setupDb: process.env.SETUP_DB == "true",
  parserLimit: process.env.PARSER_LIMIT || "50mb",
  parserJsonLimit: process.env.PARSER_JSON_LIMIT || "50mb",
  jwtMaxDate: process.env.JWT_MAX_DATE || "30d",
  cookieMaxDate: process.env.COOKIE_MAX_DATE || "1y",

  authToken: process.env.AUTH_TOKEN || "_tk",
  googleAuthClientId: process.env.GOOGLE_AUTH_CLIENT_ID,
  googleAuthClientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,

  appId: process.env.APP_ID || "",
  appLang: process.env.APP_LANG || "en",

  stripePublishableKey: process.env.STRIPE_PK,
  stripeSecretKey: process.env.STRIPE_SK,

  mailerHost: process.env.MAILER_HOST || "smtp.gmail.com",
  mailerPort: process.env.MAILER_PORT || 465,
  mailerUser: process.env.MAILER_USER,
  mailerPwd: process.env.MAILER_PWD,
  mailerAppName: process.env.MAILER_APPNAME,
  mailerReceivers: (process.env.MAILER_RECEIVERS ?? "").split(","),

  isDev: ["dev", "development", "develop", "test"].includes(environment),
  isProd: ["prod", "production", "release", "released"].includes(environment),
};
