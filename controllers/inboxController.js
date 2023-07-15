const utilities = require("../utilities")
const inboxModel = require("../models/inbox-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

async function buildInbox(req, res, next) {
    let nav = await utilities.getNav()
    let messageTable = await utilities.getMessages(res.locals.accountData.account_id)
    let archivedNumber = await utilities.countArchived(res.locals.accountData.account_id)
    fname = res.locals.accountData.account_firstname
    lname = res.locals.accountData.account_lastname
    res.render("inbox/mainPage", {
      title: fname +' '+ lname + "'s Inbox",
      nav,
      errors: null,
      messageTable,
      archivedNumber
    })
  }

async function buildArchivedMessage(req, res, next){
  let nav = await utilities.getNav()
  let archiveTable = await utilities.getArchivedMessages(res.locals.accountData.account_id)
  res.render("inbox/archiveMessage", {
    title: 'Archived Messages',
    nav,
    archiveTable,
    errors: null
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

async function sendMessage(req, res, next){
  let nav = await utilities.getNav()
  let messageTable = await utilities.getMessages(res.locals.accountData.account_id)
  let archivedNumber = await utilities.countArchived(res.locals.accountData.account_id)
  fname = res.locals.accountData.account_firstname
  lname = res.locals.accountData.account_lastname
  const {recipient, subject, message, account_id} = req.body
  const messageResult = await inboxModel.sendMessage(recipient, subject, message, account_id)

  if(messageResult){
    req.flash(
      "notice",
      "Your message was sent!"
    )
    res.status(201).render("inbox/mainPage", {
      title: fname +' '+ lname + "'s Inbox",
      nav,
      errors: null,
      messageTable,
      archivedNumber
    })
  }
}

module.exports = { buildInbox, buildNewMessage, sendMessage, buildArchivedMessage }