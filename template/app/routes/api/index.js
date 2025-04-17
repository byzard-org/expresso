const express = require("express");
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const ROUTES = require("../routes");

const router = express.Router();

router.use(ROUTES.USERS, userRoutes);
router.use(ROUTES.AUTH, authRoutes);


router.use((req, res) => {
  res.status(404).json({ error: "Endpoint Not Found" });
});

module.exports = router;
