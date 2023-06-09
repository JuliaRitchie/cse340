const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {}

/* ***************************
 *  Build vehicles by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getVehiclesByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}
/* ***************************
 *  Build vehicle by inventory id
 * ************************** */
invCont.buildByInventoryId = async function(req, res, next){
  const inv_id = req.params.inv_id
  const data = await invModel.getVehicleByInventoryId(inv_id)
  let nav = await utilities.getNav()
  let single = await utilities.buildSingleCarView(data)
  console.log(single)
  const inv_make = data[0].inv_make
  const inv_model = data[0].inv_model
  const inv_year = data[0].inv_year
  res.render("./inventory/singleView",{
    title: inv_year + ' ' + inv_make + ' ' + inv_model,
    nav,
    single
  })
}
/* ***************************
 *  Build Management View
 * ************************** */
invCont.buildManagementView = async function(req, res, next){
  let nav = await utilities.getNav()
  const classification = await utilities.getClassificationList()
  res.render("./inventory/management", {
    title:'Management View',
    nav,
    classification
  })
}
/* ***************************
 *  Build Add Classification View
 * ************************** */
invCont.buildAddClassification = async function(req, res, next){
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title:'Add New Classification',
    nav,
  })
}

invCont.buildAddInventory =  async function(req, res, next){
  let nav = await utilities.getNav()
  let classification = await utilities.getClassificationList()
  res.render("./inventory/add-inventory", {
    title: 'Add New Vehicle',
    nav,
    classification,
    errors: null
  })
}

/* ***************************
 *  Actually Add the new classification
 * ************************** */
invCont.AddNewClassification = async function(req, res, next){
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const classResult = invModel.AddNewClassification(
    classification_name
  )
  if (classResult) {
    let nav = await utilities.getNav()
    req.flash(
      "notice",
      `Congratulations, you added ${classification_name}.`
    )
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the classification update failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
    })
  }
}

invCont.AddNewVehicle = async function(req, res, next){
  let nav = await utilities.getNav()
  const {inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id} = req.body
  const vehicleResult = invModel.AddNewVehicle(inv_make, inv_model, inv_year,
    inv_description, inv_price, inv_miles, inv_color, classification_id)

    if (vehicleResult) {
      let nav = await utilities.getNav()
      let classification = await utilities.getClassificationList()
      req.flash(
        "notice",
        `Congratulations, you added the ${inv_year} ${inv_color} ${inv_model}.`
      )
      res.status(201).render("./inventory/management", {
        title: "Management",
        nav,
        classification
      })
    } else {
      let classification = await utilities.getClassificationList()
      req.flash("notice", "Sorry, the vehicle update failed.")
      res.status(501).render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classification})
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getVehiclesByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

invCont.buildEditView =  async function(req, res, next){
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  let data = await invModel.getVehicleByInventoryId(inv_id)
  // data = data.rows[0]
  console.log(data[0].invModel)
  const vehicle = `${data[0].inv_make} ${data[0].inv_model}`
  let classification = await utilities.getClassificationList(data[0].classificationId)
  res.render("./inventory/update-inventory", {
    title: 'Edit ' + vehicle,
    nav,
    classification,
    errors: null,
    inv_id: data[0].inv_id,
    inv_make: data[0].inv_make,
    inv_model: data[0].inv_model,
    inv_year: data[0].inv_year,
    inv_description: data[0].inv_description,
    inv_price: data[0].inv_price,
    inv_miles: data[0].inv_miles,
    inv_color: data[0].inv_color,
    classification_id: data[0].classification_id
  })
}

/* ***************************
*  Update Inventory Data
* ************************** */

invCont.updateInventory = async function(req, res, next){
  const {inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id, inv_id} = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make, 
    inv_model, 
    inv_year,
    inv_description, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id)

    if (updateResult) {
      let nav = await utilities.getNav()
      let classification = await utilities.getClassificationList()
      req.flash(
        "notice",
        `Congratulations, you updated the ${inv_make} ${inv_model}.`
      )
      res.status(201).render("./inventory/management", {
        title: "Management",
        nav,
        classification
      })
    } else {
      let nav = await utilities.getNav()
      let classification = await utilities.getClassificationList()
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the update failed.")
      res.status(501).render("./inventory/add-inventory", {
        nav,
        title: "Edit " + itemName,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
        classification})
    }
}

module.exports = invCont