// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities')
const regValidate = require('../utilities/add-classification')
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));


// Route to build single view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId))

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagementView))
// Route to build add classification form view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))
router.post(
    "/inv/",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(invController.AddNewClassification)
  );

module.exports = router;