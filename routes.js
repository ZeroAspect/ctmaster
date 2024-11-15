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
const formatName = require("./infra/formatName.js")
const { marked } = require("marked")
const fs = require("fs")
const { upload } = require("./upload/upload.js")
const Posts = require("./models/Posts.js")


app.use(express.static(path.join(__dirname + '/upload/photos/')))
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
app.post('/cadastro', async(req, res)=>{
  const ip = await GetIPFunction()
  const { nome, email, senha } = req.body
  const removeSpaces = nome.replace(' ', '')
  const formatName = removeSpaces.toLowerCase()
  const findUserNameExists = await User.findOne({
    where: {
      nome: formatName
    }
  })
  const findUserEmailExists = await User.findOne({
    where: {
      email
    }
  })
  if(findUserNameExists === null && findUserEmailExists === null){
    const user = await User.create({
      nome: formatName,
      email,
      senha,
      biografia: marked("*Olá mundo*"),
      ip: ip.query
    })
    if(!user){
      res.status(500).render("cadastro", {
        message: `
        <div class="alert alert-danger" role="alert">
          <strong>
            <i>Ocorreu um erro ao cadastrar o usuário.</i>
          </strong>
        </div>
        `
      })
    }else{
      res.redirect('/')
    }
  }
})
app.get('/license', async(req, res)=>{
  try{
    const license = fs.readFileSync("./LICENSE", "utf-8")
    res.render('license', {
      license
    })
  }catch(error){
    console.error(error)
    res.status(500).json({
      message: "Ocorreu um erro inesperado"
    })
  }
})

app.get('/contato', async(req, res)=>{
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.query
    }
  })
  if(user === null){
    res.redirect('/login')
  }else{
    res.render('contato')
  }
})
app.get('/sobre', async(req, res)=>{
  res.redirect('/')
})
app.get('/termos-de-uso', async(req, res)=>{
  res.render('termos')
})
app.get('/editar/perfil', async(req, res)=>{
  const mysql = await MySql()
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.query
    }
  })
  if(user === null){
    res.redirect('/login')
  }else{
    const [ profile, rows ] = await mysql.query(`SELECT * FROM Users WHERE id = '${user['id']}'`)

    res.render('editar', {
      user: profile
    })
  }
})
app.post('/editar/perfil', async(req, res)=>{
  const { biografia } = await req.body
  const mysql = await MySql()
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.query
    }
  })
  if(user === null){
    res.redirect('/login')
  } else{
    await mysql.query(`UPDATE Users SET biografia = '${biografia}' WHERE id = '${user['id']}'`)
    res.redirect('/editar/perfil')
  }
})
app.get('/@:nome', async(req, res)=>{
  const nome = req.params.nome
  const ip = await GetIPFunction()
  const mysql = await MySql()
  const findUsername = await User.findOne({
    where: {
      nome: nome
    }
  })
  const findIpQuerie = await User.findOne({
    where: {
      ip: ip.query
    }
  })
  if(findUsername["nome"] === findIpQuerie["nome"]){
    const [ user, rows ] = await mysql.query(`SELECT * FROM Users WHERE nome = '${nome}'`)
    res.render('profile', {
      user,
      message: `<a href='/editar/perfil'>Editar Perfil</a>`
    })
  }else{
    const [ user, rows ] = await mysql.query(`SELECT * FROM Users WHERE nome = '${nome}'`)
    res.render('profile', {
      user
    })
  }
})
app.get('/publicar', async(req, res)=>{
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.query
    }
  })
  if(user === null){
    res.redirect('/login')
  }else{
    res.render('publicar')
  }
})
app.post('/publicar', upload.single('imagem'), async(req, res)=>{
  const { titulo, conteudo } = req.body
  const file = req.file

  const mysql = await MySql()
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.query
    }
  })
  if(user === null){
    res.redirect('/login')
  } else{
    res.json(req.file)
  }
})