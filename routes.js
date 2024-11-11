const express = require("express")
const app = require("./config/config.js")
const hbs = require("express-handlebars")
const path = require("path")
const { GetIPFunction } = require("./funcs/api/ip.js")
const checkUser = require("./auth/AuthUser.js")
const User = require("./models/User.js")
const db = require("./connections/sequelize.js")
const MySql = require("./db/database.js")

app.engine("handlebars", hbs.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname + "/views"))

app.get('/', async(req, res)=>{
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.query
    }
  })
  try{
    if(!user || user === null){
      res.redirect('/login')
    }else{
      res.render('home')
    }
  }catch(error){
    console.error(error)
    res.status(404).json({
      message: "Ocorreu um erro inesperado"
    })
  }
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