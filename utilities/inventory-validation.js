const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const inventoryModel = require("../models/inventory-model")

validate.classificationRules = () => {
    return [
        body("classification_name")
        .isLength({ min: 1 })
        .withMessage("Classification name does not meet the requirements."),
    ]
}

validate.checkClassification = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/management", {
        errors,
        title: "Management View",
        nav,
        classification_name
      })
      return
    }
    next()
  }

module.exports = validate