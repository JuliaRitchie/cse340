const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const inventoryModel = require("../models/inventory-model")

validate.classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .isAlpha()
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
    
validate.vehicleRules = () => {
    return [
      body("inv_make")
      .trim()
      .isLength({ min:1 })
      .isAlpha()
      .withMessage("Please provide a vehicle make with only letters"),

      body("inv_model")
      .trim()
      .isLength({ min:1 })
      .isAlpha()
      .withMessage("Please provide a vehicle model with only letters"),
      
      body("inv_year")
      .trim()
      .isNumeric()
      .isLength({min:1}, {max:4})
      .withMessage("Please provide a 4 digit year consisting of only numbers"),

      body("inv_description")
      .trim()
      .isLength({min:1})
      .withMessage("Please provide an inventory description with only letters"),

      // body("inv_image")
      // .trim()
      // .isAlpha()
      // .isLength({min:1})
      // .withMessage("Please provide an image path for the vehicle"),

      body("inv_price")
      .trim()
      .isNumeric()
      .isLength({min:1})
      .withMessage("Please provide vehicle price using only numbers"),

      body("inv_miles")
      .trim()
      .isNumeric()
      .isLength({min:1})
      .withMessage("Please provide vehicle miles using only numbers"),

      body("inv_color")
      .trim()
      .isAlpha()
      .isLength({min:1})
      .withMessage("Please provide an color for the vehicle using only letters"),
    ]
}

validate.checkNewVehicle = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classification = await utilities.getClassificationList()
    res.render("inventory/add-inventory", {
      errors,
      title: "Management View",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      classification
    })
    return
  }
  next()
}
module.exports = validate