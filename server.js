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
const baseController = require("./controllers/baseController")

// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"))
// Index route
// app.get('/', function(req, res){
//   res.render("index", {title: "Home"})
// })

app.get('/', baseController.buildHome)

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

