// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities')
const invValidate = require('../utilities/inventory-validation')
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));


// Route to build single view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId))

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagementView))
// Route to build add classification form view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
// Route to build add inventory form view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditView))

router.post("/update/", 
    invValidate.vehicleRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory));

router.post(
    "/add-new-classification",
    invValidate.classificationRules(),
    invValidate.checkClassification,
    utilities.handleErrors(invController.AddNewClassification)
  );
router.post(
  "/add-new-inventory",
  invValidate.vehicleRules(),
  invValidate.checkNewVehicle,
  // don't forget to add the actual processing function
  utilities.handleErrors(invController.AddNewVehicle)
)
module.exports = router;