const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const inventoryModel = require("../models/inbox-model")

validate.newMessageRules = () => {
    return [
        body("recipient")
            .isNumeric()
            .withMessage('Please choose a recipient'),
        body("subject")
            .trim()
            .isLength({ min:1 })
            .withMessage('Please provide a subject'),
        body("message")
            .isLength({min:1})
            .withMessage('Please write a message to send.')
    ]
}

validate.checkMessageRules = async (req, res, next) => {
    const {recipient, subject, message} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()){
        let nav = await utilities.getNav()
        let recipients = await utilities.getClientList()
        res.render("inbox/createMessage", {
            title: "Send Message",
            nav,
            errors,
            recipients,
            recipient, 
            subject,
            message
        })
            }
}

module.exports = validate