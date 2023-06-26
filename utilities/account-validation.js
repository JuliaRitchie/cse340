const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")
/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the database
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }


validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('A vaild email is required.'),

    body("account_password")
    .trim()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      })
      .withMessage("Password does not follow requirements.")
  ]
};

validate.emailRules = () => {
  // if email is being changed, it cannot already exist in the database body
  ("account_email") .trim() .isEmail() .normalizeEmail() // refer to validator js docs 
  .withMessage("A valid email is required.") .custom(async (account_email) => { const account_id = body.account_id 
    const account = accountModel.getAccountById(account_id) // Check if submitted email is same as existing 
    if (!account_email == account.account_email) { // No - Check if email exists in table 
    const emailExists = await accountModel.checkEmail(account_email)} // Yes - throw error 
    if (emailExists) { throw new Error
  ("Email exists. Please login or use different email") } }) }

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors:null,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }
validate.checkLoginData = async (req, res, next) => {
  const {account_email} = req.body
  let errors = []
  errors = validationResult(req)
  if(!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors: null,
      title: "Login",
      nav,
      account_email
    })
  }
  next()
}

  
  module.exports = validate