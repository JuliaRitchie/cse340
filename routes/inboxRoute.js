const express = require("express")
const router = new express.Router() 
const inboxController = require("../controllers/inboxController.js")
const utilities = require('../utilities')
const jwt = require("jsonwebtoken")
require("dotenv").config()

router.get('/', utilities.handleErrors(inboxController.buildInbox));

module.exports = router;