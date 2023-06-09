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
  res.render("./inventory/management", {
    title:'Management View',
    nav,
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
  res.render("./inventory/add-inventory", {
    title: 'Add New Vehicle',
    nav
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

module.exports = invCont