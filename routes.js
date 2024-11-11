const express = require("express")
const app = require("./config/config.js")
const hbs = require("express-handlebars")
const path = require("path")
const { GetIPFunction } = require("./funcs/api/ip.js")
const passport = require('passport');
const checkUser = require("./auth/AuthUser.js")
const User = require("./models/User.js")
const db = require("./connections/sequelize.js")
const MySql = require("./db/database.js")
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

app.engine("handlebars", hbs.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname + "/views"))

app.get('/', async(req, res)=>{
  const ip = await GetIPFunction()
  console.log(ip)
  res.render("home")
})
app.get('/tests', async(req, res)=>{
  // const user = await checkUser(
  //   "jose",
  //   "123456"
  // )
  res.json({
    route: "Área destinada para testes de automação"
  })
})