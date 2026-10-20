const express = require("express");
const router = express.Router();
const User = require("../models/user.js"); // User Model को इम्पोर्ट करना
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const userControllers = require("../controllers/users.js");
const { render } = require("ejs");
const { renderSignupForm, renderloginForm } = require("../controllers/users.js");
const {saveRedirectUrl} = require("../middleware.js")


router.route("/signup")
.get(userControllers.renderSignupForm)   // 1. Signup Route (नया यूज़र बनाने के लिए)
.post( wrapAsync(userControllers.signup));

router.route("/login")
.get( renderloginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local", { 
    failureRedirect: '/login', 
    failureFlash: true 
}), 
   userControllers.login
);



  
router.get("/logout", userControllers.logout);

module.exports = router; // इसे एक्सपोर्ट करना ज़रूरी है