const express = require("express");
const router = express.Router();
// internal import
const {
  getLogin,
  login,
  logout,
  getAccessToken,
} = require("../controllers/authController");
const {
  doLoginValidators,
  loginValidationHandler,
} = require("../middleware/common/login/loginValidators");
const checkAuth = require("../middleware/common/checkAuth");

router.post("/", doLoginValidators, loginValidationHandler, login);
router.delete("/", logout);
router.get("/get-access-token", getAccessToken);

module.exports = router;
