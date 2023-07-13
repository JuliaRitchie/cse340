const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const inboxModel = require("../models/inbox-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()
/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

Util.getClassificationList = async function(classification_id = null) {
  let data = await invModel.getClassifications()
  let classification = "<option value='default'>Select Classification </option>"
  data.rows.forEach((row) => {
    
    classification += `<option `
     if(classification_id == row.classification_id){
      classification += ` selected `
    } 
    classification += `value="${row.classification_id}">${row.classification_name}</option>`
  })
  return classification
}

Util.getClientList = async function(account_id = null){
  let data = await accountModel.getAccounts()
  let recipients = "<select name='recipient'>"
  recipients += `<option value='default'>Select Recipient</option>`
  data.rows.forEach((row) => {
    
    recipients += `<option `
    if(account_id == row.account_id){
      recipients += `selected `
    }
    recipients += `value="${row.account_id}">${row.account_firstname}</option>`
  })


  recipients += "</select>"
  return recipients
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}
/* **************************************
* Build the Single Car view HTML
* ************************************ */
Util.buildSingleCarView = async function(data){
  let vehicle = data[0]
  let single = ` 
    <div class="singleViewCarDiv">
      <img alt="vehicle-picture" src="${vehicle.inv_image}" id="vehicle_img">
      <div class="singleViewCarText">
        <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
        <p id="price">Price: $${Number(vehicle.inv_price).toLocaleString()}</p>
        <p id="miles">Miles: ${Number(vehicle.inv_miles).toLocaleString()}</p>
        <p>Color: ${vehicle.inv_color}</p>
        <p>Description: ${vehicle.inv_description}</p>
      </div>
    </div>
  `
  return single
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
 *  Check Account Type
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.accountData.account_type == 'Client') {
    req.flash("notice", "Please log in with the correct account.")
    return res.redirect("/account/login")
  }
  else {
    next()
  }
 }

Util.inventoryEdit = (accountData) =>{
  let management =''
  if (accountData.account_type == 'Client') {
    management = null
  
  }
  else {
    management += `<h3>Inventory Management</h3>`
    management += `<a title="Edit Vehicle inventory" href="/inv/">Edit Inventory</a>`
  }
  console.log(management)
  return management
}

Util.getAccountHeader = async function(loggedin, accountData){
let account_firstname = accountData.account_firstname
let header =' '
if (loggedin == 1){
  header += `<a title="View your account ${account_firstname}" href="/account/" id="account"> Welcome ${account_firstname} | </a> <a title="Logout here" href="/account/logout">Logout</a>`
}
else{
  header += '<a title="Click to log in" href="/account/login" id="account">My Account</a>'
}
console.log(header)
return header
}

 /* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

Util.logout = (req, res, next) => {
  res.clearCookie('jwt')
  return res.redirect('/')
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util