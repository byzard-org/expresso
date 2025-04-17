const express = require("express");
const router = express.Router();
const homeController = require("../../controllers/web/homeController");
const ROUTES = require("../routes");
const webAuthMiddleware = require("../../middlewares/web/authMiddleware");
const authController = require("../../controllers/web/authController");
const preventLogin = require("../../middlewares/web/preventLogin");
const UploadService = require("../../services/upload");
const accountMiddleware = require("../../middlewares/web/accountMiddleware");
const accountController = require("../../controllers/web/accountController");

router.get(
  ROUTES.BASE,
  webAuthMiddleware,
  accountMiddleware,
  homeController.index
);

router.get(
  ROUTES.VERIFY_ACCOUNT,
  webAuthMiddleware,
  accountController.sendVerificationMail
);
router.get(
  `${ROUTES.VERIFY_ACCOUNT}${ROUTES.FIND}`,
  webAuthMiddleware,
  accountController.verifyAccount
);

router.get(ROUTES.RESET_PASSWORD, preventLogin, accountController.passwordReset);
router.get(
  `${ROUTES.RESET_PASSWORD}${ROUTES.FIND}`,
  preventLogin,
  accountController.passwordReset
);
router.post(
  ROUTES.RESET_PASSWORD,
  preventLogin,
  accountController.sendPasswordResetMail
);
router.post(
  `${ROUTES.RESET_PASSWORD}${ROUTES.FIND}`,
  preventLogin,
  accountController.resetPassword
);

// AUTH
router.get(ROUTES.LOGIN, preventLogin, authController.login);
router.get(ROUTES.LOGOUT, authController.logout);
router.get(ROUTES.REGISTER, preventLogin, authController.register);

router.post(ROUTES.LOGIN, authController.loginSubmit);
router.post(
  ROUTES.REGISTER,
  UploadService.middleware.single("image"),
  authController.registerSubmit
);

module.exports = router;
