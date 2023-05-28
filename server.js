/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const baseController = require("./controllers/baseController")
const utilities = require('./utilities/')


/* ***********************
 * View Engines and templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root
/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"))


// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"))
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
// app.get('/', function(req, res){
//   res.render("index", {title: "Home"})
// })

app.get('/', baseController.buildHome)



// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
  next({status: 500, message: 'It seems the server has crashed.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message
    res.render("errors/error", {
      title: err.status || 'Server Error',
      message,
      nav
    })
  } else if(err.status == 500){message = err.message
    res.render("errors/broken", {
      title: "Execute Order 66",
      message,
      nav
    })} else {message = "Looks like the page was lost."}
  
})

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/broken", {
    title: err.status || 'Internal Error',
    message: err.message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

