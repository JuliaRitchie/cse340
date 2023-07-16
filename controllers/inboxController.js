const utilities = require("../utilities")
const inboxModel = require("../models/inbox-model")
const accountModel = require("../models/account-model")
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

async function deleteMessage(req, res, next) {
  let nav = await utilities.getNav()
  let messageTable = await utilities.getMessages(res.locals.accountData.account_id)
  let archivedNumber = await utilities.countArchived(res.locals.accountData.account_id)
  const message_id = req.params.message_id
  fname = res.locals.accountData.account_firstname
  lname = res.locals.accountData.account_lastname 
  const messageDeleted = inboxModel.deleteMessage(message_id)
  if(messageDeleted){
    req.flash("notice",
    "Your message was deleted.")
    res.status(201).render("inbox/mainPage", {
      title: fname +' '+ lname + "'s Inbox",
      nav,
      errors: null,
      messageTable,
      archivedNumber
    })
  }
}

async function buildMessageView(req, res, next){
  let nav = await utilities.getNav()
  const message_id = req.params.message_id
  const data = await inboxModel.getMessageById(message_id)
  const subject = data.message_subject
  const messageFromId = data.message_from
  let accountInfo = await accountModel.getAccountById(messageFromId)
  const messageFrom = accountInfo.account_firstname + ' ' + accountInfo.account_lastname
  const messageBody = data.message_body
  res.render("inbox/message", {
    title: subject,
    subject,
    nav,
    messageFrom,
    messageBody,
    errors: null,
    message_id
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

async function buildReplyMessage(req, res, next) {
  let nav = await utilities.getNav()
  let recipients = await utilities.getClientList()
  const message_id = req.params.message_id
  const data = await inboxModel.getMessageById(message_id)
  const message_subject = data.message_subject
  const message_body = data.message_body
  const message_from = data.message_body
  res.render("inbox/reply", {
    title: "Reply Message",
    nav,
    errors: null,
    recipients,
    message_subject,
    message_body
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

async function markMessageRead(req, res, next){
  let nav = await utilities.getNav()
  const message_id = req.params.message_id
  const data = await inboxModel.getMessageById(message_id)
  const subject = data.message_subject
  const messageFromId = data.message_from
  let accountInfo = await accountModel.getAccountById(messageFromId)
  const messageFrom = accountInfo.account_firstname + ' ' + accountInfo.account_lastname
  const messageBody = data.message_body
  const messageRead = await inboxModel.markAsRead(message_id)
  if(messageRead){
    req.flash(
      "notice",
      "Your message is marked as read.")
      res.status(201).render("inbox/message",{
      title: subject,
      subject,
      nav,
      messageFrom,
      messageBody,
      errors: null,
      message_id})
  }
  
}

async function markMessageArchived(req, res, next){
  let nav = await utilities.getNav()
  const message_id = req.params.message_id
  const data = await inboxModel.getMessageById(message_id)
  const subject = data.message_subject
  const messageFromId = data.message_from
  let accountInfo = await accountModel.getAccountById(messageFromId)
  const messageFrom = accountInfo.account_firstname + ' ' + accountInfo.account_lastname
  const messageBody = data.message_body
  const messageRead = await inboxModel.markAsArchived(message_id)
  if(messageRead){
    req.flash(
      "notice",
      "Your message was archived.")
      res.status(201).render("inbox/message",{
      title: subject,
      subject,
      nav,
      messageFrom,
      messageBody,
      errors: null,
      message_id})
  }
  
}

module.exports = { buildInbox, buildNewMessage, sendMessage, buildArchivedMessage, buildMessageView, markMessageRead, markMessageArchived, deleteMessage, buildReplyMessage }