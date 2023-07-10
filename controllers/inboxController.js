const utilities = require("../utilities")
const inboxModel = require("../models/inbox-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

async function buildInbox(req, res, next) {
    let nav = await utilities.getNav()
    fname = res.locals.accountData.account_firstname
    lname = res.locals.accountData.account_lastname
    res.render("inbox/mainPage", {
      title: fname +' '+ lname + "'s Inbox",
      nav,
      errors: null,
    })
  }

async function buildNewMessage(req, res, next) {
  let nav = await utilities.getNav()
  let recipients = await utilities.getClientList()
  res.render("inbox/createMessage", {
    title: "New Message",
    nav,
    errors: null,
    recipients
  })
}

module.exports = { buildInbox, buildNewMessage }