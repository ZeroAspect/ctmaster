const express = require("express")
const app = require("./config/config.js")
const hbs = require("express-handlebars")
const path = require("path")
const { GetIPFunction } = require("./funcs/api/ip.js")
const checkUser = require("./auth/AuthUser.js")
const User = require("./models/User.js")
const db = require("./connections/sequelize.js")
const MySql = require("./db/database.js")
const checkIP = require("./api/checkIP.js")
const nodemailer = require('nodemailer')
app.engine("handlebars", hbs.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname + "/views"))
app.use(express.static(__dirname + "/images"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
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
app.get('/login', async(req, res)=>{
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.query
    }
  })
  if(user === null){
    res.render('login', {
      message: `
      <div class="alert alert-warning" role="alert">
        <strong>
          <i>Não foi encontrado um usuário cadastrado com seu IP.</i>
        </strong>
      </div>
      `
    })
  }else{
    res.redirect('/')
  }
})
app.post('/login', async(req, res)=>{
  const ip = await GetIPFunction()
  const { nome, senha } = req.body
  const user = await User.findOne({
    where: {
      nome,
      senha
    }
  })
  if(user === null){
    
    res.render('login', {
      message: `
      <div class="alert alert-danger" role="alert">
        <strong>
          <i>Nome ou Senha incorreta.</i>
        </strong>
      </div>
      `
    })
  }else{
    await user.update({
      ip: ip.query
    })
    res.redirect('/')
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
app.get('/cadastro', async(req, res)=>{
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.query
    }
  })
  if(user === null){
    res.render('cadastro')
  }else{
    res.redirect('/')
  }
})
