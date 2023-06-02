const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  req.flash("notice", "This is a flash message.")
  res.render("index", {title: "Home", nav})
}

baseController.buildError = async function(req, res){
  // const nav = await utilities.getNav()
  res.render("errors/broken", {
    title: "It's Not Going to Matter",
    nav
  })
}

module.exports = baseController