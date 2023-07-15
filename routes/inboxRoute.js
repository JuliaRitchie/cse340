const express = require("express")
const router = new express.Router() 
const inboxController = require("../controllers/inboxController.js")
const utilities = require('../utilities')
const jwt = require("jsonwebtoken")
require("dotenv").config()

router.get('/', utilities.checkLogin, utilities.handleErrors(inboxController.buildInbox));

router.get('/new/', utilities.checkLogin, utilities.handleErrors(inboxController.buildNewMessage))

router.get('/archive/', utilities.checkLogin, utilities.handleErrors(inboxController.buildArchivedMessage))

router.get('/message/:message_id', utilities.checkLogin, utilities.handleErrors(inboxController.buildMessageView))

router.get('/message/:message_id/read', utilities.handleErrors(inboxController.markMessageRead))

router.get('/message/:message_id/archive', utilities.handleErrors(inboxController.markMessageArchived))

router.get('/message/:message_id/delete', utilities.handleErrors(inboxController.deleteMessage))

router.post(
    '/send',
    utilities.handleErrors(inboxController.sendMessage))

module.exports = router;