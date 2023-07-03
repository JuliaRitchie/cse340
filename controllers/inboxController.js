const utilities = require("../utilities")
const inboxModel = require("../models/inbox-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

async function buildInbox(req, res, next) {
    let nav = await utilities.getNav()
    res.render("inbox/mainPage", {
      title: "Inbox",
      nav,
      errors: null,
    })
  }


module.exports = { buildInbox }