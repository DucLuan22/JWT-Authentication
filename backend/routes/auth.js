const express = require("express");
const router = express.Router();

const {
  login,
  register,
  forgotPassword,
  resetpassword,
  confirmRegistration,
} = require("../controllers/auth");

router.post("/register", register);

router.post("/login", login);

router.post("/forgotpassword", forgotPassword);

router.get("/confirmregister/:confirmToken", confirmRegistration);

router.put("/resetpassword/:resetToken", resetpassword);

module.exports = router;
