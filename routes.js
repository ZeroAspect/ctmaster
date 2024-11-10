const express = require("express")
const app = require("./config/config.js")
const hbs = require("express-handlebars")
const path = require("path")
const { GetIPFunction } = require("./funcs/api/ip.js")


app.engine("handlebars", hbs.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname + "/views"))

app.get('/', async(req, res)=>{
  const ip = await GetIPFunction()
  console.log(ip)
  res.render("home")
})