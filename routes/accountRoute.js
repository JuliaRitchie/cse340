// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require('../utilities')
const regValidate = require('../utilities/account-validation')
const jwt = require("jsonwebtoken")
require("dotenv").config()
// Route to build login page
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration page
router.get("/register", utilities.handleErrors(accountController.buildRegister));
// Route to build account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));

// Route to build update account page
// router.get("/update", utilities.handleErrors(accountController.buildUpdate));

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  );
// Process the login request
 router.post(
   "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
   utilities.handleErrors(accountController.accountLogin)
 )
module.exports = router;