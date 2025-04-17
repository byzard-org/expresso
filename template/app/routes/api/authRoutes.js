const express = require("express");
const authController = require("../../controllers/api/authController");
const authMiddleware = require("../../middlewares/api/authMiddleware");
const ROUTES = require("../routes");

const router = express.Router();

router.get(ROUTES.USER, authMiddleware, authController.user);

router.post(ROUTES.AUTH_LOGIN, authController.login);
router.post(ROUTES.AUTH_REGISTER, authController.register);

module.exports = router;
