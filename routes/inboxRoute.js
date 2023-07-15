const express = require("express")
const router = new express.Router() 
const inboxController = require("../controllers/inboxController.js")
const utilities = require('../utilities')
const jwt = require("jsonwebtoken")
require("dotenv").config()

router.get('/', utilities.checkLogin, utilities.handleErrors(inboxController.buildInbox));

router.get('/new/', utilities.checkLogin, utilities.handleErrors(inboxController.buildNewMessage))

router.get('/archive/', utilities.checkLogin, utilities.handleErrors(inboxController.buildArchivedMessage))

router.post(
    '/send',
    utilities.handleErrors(inboxController.sendMessage))

module.exports = router;