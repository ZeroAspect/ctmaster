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
const Comentario = require("./models/Comentario.js")
const Resposta = require("./models/Respostas.js")


// handlebars
app.engine("handlebars", hbs.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname + "/views"))

// static files
app.use(express.static(path.join(__dirname + "/images")))
app.use(express.static(path.join(__dirname + '/upload/photos')))

// express bodyParser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// Api
app.get('/api/v1/json', async(req, res)=>{
  res.json({
    info: 'API para gerenciamento de conteúdo',
    version: '1.0.0',
    endpoints: [
      '/api/v1/posts',
      '/api/v1/posts/:id',
      '/api/v1/posts/:id/comentarios',
      '/api/v1/posts/:id/comentarios/:comment_id',
      '/api/v1/posts/:id/curtir',
      '/api/v1/posts/:id/curtir/:comment_id'
    ]
  })
})
app.get('/api/v1', async(req, res)=>{
  const ip = await GetIPFunction()
  const mysql = await MySql()
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })
  if(user === null){
    res.status(401).json({
      info: 'Você não está logado',
      code: 401,
      message: 'Acesse a rota /login e acesse sua conta, ou crie sua conta em /cadastro'
    })
  }else{
    res.render('api/v1/home')
  }
})
app.get('/api/v1/posts', async(req, res)=>{
  const mysql = await MySql()
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })
  if(user === null){
    res.status(401).json({
      info: 'Você não está logado',
      code: 401,
      message: 'Acesse a rota /login e acesse sua conta, ou crie sua conta em /cadastro'
    })
  } else{
    const [ posts, rows ] = await mysql.query(`
      SELECT *
      FROM Posts
      ORDER BY
      id DESC
    `)
    res.json(posts)
  }
})
// Routes
app.get('/', async(req, res)=>{
  const ip = await GetIPFunction()
  const mysql = await MySql()
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })
  try{
    if(!user || user === null){
      res.redirect('/login')
    }else{
      const [ posts, rows ] = await mysql.query(`
        SELECT *
        FROM Posts
        ORDER BY createdAt DESC
      `)
      res.render('home',
        {
          posts
        }
      )
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
      ip: ip.ip
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
      ip: ip.ip
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
      ip: ip.ip
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
      ip: ip.ip
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
      ip: ip.ip
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
      ip: ip.ip
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
      ip: ip.ip
    }
  })
  if(user === null){
    res.redirect('/login')
  } else{
    await mysql.query(`UPDATE Users SET biografia = '${marked(biografia)}' WHERE id = '${user['id']}'`)
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
      ip: ip.ip
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
      ip: ip.ip
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
      ip: ip.ip
    }
  })
  if(user === null){
    res.redirect('/login')
  } else{
    const imagem = await req.file.filename
    const createPost = await Posts.create({
      nome: user['nome'],
      titulo,
      conteudo: marked(conteudo),
      filename: imagem,
      
    })
    res.redirect(`/${createPost['nome']}/${createPost['id']}`)
  }
})
app.get('/relevantes', async(req, res)=>{
  const mysql = await MySql()
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })
  if(user === null){
    res.redirect('/login')
  } else{
    const [ posts, rows ] = await mysql.query(`
      SELECT *
      FROM Posts
      ORDER BY post_like DESC
    `)
    res.render('home', {
      posts
    })
  }
})
app.get('/:nome/:id', async(req, res)=>{
  const { nome, id } = req.params
  const ip = await GetIPFunction()
  const mysql = await MySql()
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })

  const [ post, rows ] = await mysql.query(`
    SELECT *
    FROM Posts
    WHERE nome = '${nome}' AND id = '${id}'
  `)
  const [ comentario, rowsComment ] = await mysql.query(`
    SELECT *
    FROM Comentarios
    WHERE post_id = '${id}'
    ORDER BY
    comment_like DESC
  `)
  const [ resposta, rowsReply ] = await mysql.query(`
    SELECT *
    FROM Respostas
    WHERE post_id = '${id}'
  `)

  res.render('post', {
    post,
    comentario,
    resposta
  })
})

app.get('/museu', async(req, res)=>{
  res.render('museu')
})
app.post('/:nome/:id/curtir', async(req, res)=>{
  const { nome, id } = req.params
  const mysql = await MySql()
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })
  if(user === null){
    res.redirect('/login')
  } else{
    await mysql.query(`
      UPDATE Posts
      SET post_like = post_like + 1
      WHERE nome = '${nome}' AND id = '${id}'
    `)
    res.redirect(`/${nome}/${id}`)
  }
})
app.post("/:nome/:id/comentar", async(req, res)=>{
  const { nome, id } = req.params
  const { comentario } = req.body
  const mysql = await MySql()
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })
  if(user === null){
    res.redirect('/login')
  } else{
    await Comentario.create({
      nome: user['nome'],
      post_id: id,
      comentario: marked(comentario)
    })
    res.redirect(`/${nome}/${id}`)
  }
})
app.post('/:nome/:post_id/curtir/comentario/:id', async(req, res)=>{
  const { nome, post_id, id } = req.params
  const mysql = await MySql()
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })
  if(user === null){
    res.redirect('/login')
  } else{
    await mysql.query(`
      UPDATE Comentarios
      SET comment_like = comment_like + 1
      WHERE id = '${id}'
    `)
    res.redirect(`/${nome}/${id}`)
  }
})

app.post('/:nome/:post_id/comentario/:id/responder', async(req, res)=>{
  const { nome, post_id, id } = req.params
  const { resposta } = req.body
  const mysql = await MySql()
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })
  if(user === null){
    res.redirect('/login')
  } else{
    await Resposta.create({
      nome: user['nome'],
      comment_id: id,
      post_id,
      resposta: marked(resposta)
    })
    res.redirect(`/${nome}/${post_id}`)
  }
})
app.get('/api/v1/:nome/:post_id/comentario/:id/respostas', async(req, res)=>{
  const { nome, post_id, id } = req.params
  const mysql = await MySql()
  const ip = await GetIPFunction()

  // QUERIES
  const [ comment, postRows ] = await mysql.query(`
    SELECT *
    FROM Comentarios
    WHERE id = '${id}'
  `)
  const [ respostas, rows ] = await mysql.query(`
    SELECT *
    FROM Respostas
    WHERE comment_id = '${id}'
    ORDER BY
    id DESC
  `)
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })
  if(user === null){
    res.redirect('/login')
  }else{
    res.json({
      respostas
    })
  }
})
app.get('/:nome/:post_id/comentario/:id/respostas', async(req, res)=>{
  const { nome, post_id, id } = req.params
  const mysql = await MySql()
  const ip = await GetIPFunction()

  // QUERIES
  const [ comment, postRows ] = await mysql.query(`
    SELECT *
    FROM Comentarios
    WHERE id = '${id}'
  `)
  const [ respostas, rows ] = await mysql.query(`
    SELECT *
    FROM Respostas
    WHERE comment_id = '${id}'
    ORDER BY
    id DESC
  `)
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })

  if(user === null){
    res.redirect('/login')
  }else{
    res.render('respostas', {
      comment,
      respostas
    })
  }
})

 app.get('/:nome/:post_id/comentario/:id/responder', async(req, res)=>{
  const { nome, post_id, id } = req.params
  const mysql = await MySql()
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })
  if(user === null){
    res.redirect('/login')
  }else{
    await Resposta.create({
      nome: user['nome'],
      comment_id: id,
      post_id,
      resposta: marked(req.body.resposta)
    })
    res.redirect(`/${nome}/${post_id}/comentario/${id}/respostas`)
  }
})
app.get('/api/v1/contents/:nome/:id', async(req, res)=>{
  const { nome, id } = req.params
  const mysql = await MySql()
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })
  if(user === null){
    res.redirect('/login')
  } else{
    const [ post, rows ] = await mysql.query(`
      SELECT *
      FROM Posts
      WHERE nome = '${nome}' AND id = '${id}'
    `)
    res.json({
      post
    })
  }
})
app.get('/api/v1/contents/', async(req, res)=>{
  const mysql = await MySql()
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })
  if(user === null){
    res.redirect('/login')
  } else{
    const [ posts, rows ] = await mysql.query(`
      SELECT *
      FROM Posts
      ORDER BY
      post_likes DESC
    `)
    res.json({
      posts
    })
  }
})
app.get('/api/v1/contents/comentarios', async(req, res)=>{
  const mysql = await MySql()
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })
  if(user === null){
    res.redirect('/login')
  } else{
    const [ comentarios, rows ] = await mysql.query(`
      SELECT *
      FROM Comentarios
      ORDER BY
      id DESC
    `)
    res.json({
      comentarios
    })
  }
})

app.get('/api/v1/contents/comentarios/:id', async(req, res)=>{
  const { id } = req.params
  const mysql = await MySql()
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })
  if(user === null){
    res.redirect('/login')
  } else{
    const [ comentario, rows ] = await mysql.query(`
      SELECT *
      FROM Comentarios
      WHERE id = '${id}'
    `)
    res.json({
      comentario
    })
  }
})

app.get('/api/v1/contents/comentarios/:id/respostas', async(req, res)=>{
  const { id } = req.params
  const mysql = await MySql()
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })
  if(user === null){
    res.redirect('/login')
  } else{
    const [ respostas, rows ] = await mysql.query(`
      SELECT *
      FROM Respostas
      WHERE comment_id = '${id}'
      ORDER BY
      id DESC
    `)
    res.json({
      respostas
    })
  }
})

app.get('/api/v1/contents/:nome/:id/comentarios', async(req, res)=>{
  const { nome, id } = req.params
  const mysql = await MySql()
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })
  if(user === null){
    res.redirect('/login')
  } else{
    const [ comentarios, rows ] = await mysql.query(`
      SELECT *
      FROM Comentarios
      WHERE post_id = '${id}'
      ORDER BY
      id DESC
    `)
    res.json({
      comentarios
    })
  }
})

app.get('/api/v1/contents/:nome/:id/comentarios/:comment_id/likes', async(req, res)=>{
  const { nome, id, comment_id } = req.params
  const mysql = await MySql()
  const ip = await GetIPFunction()
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })
  if(user === null){
    res.redirect('/login')
  } else{
    const [ like, rows ] = await mysql.query(`
      SELECT *
      FROM Likes
      WHERE post_id = '${id}' AND comment_id = '${comment_id}' AND user_id = '${user.id}'
    `)
    if(like.length > 0){
      res.json({
        success: false,
        message: "Você já curtiu esse comentário!"
      })
    } else{
      await Likes.create({
        post_id: id,
        comment_id,
        user_id: user.id
      })
      res.json({
        success: true,
        message: "Comentário curtido com sucesso!"
      })
    }
  }
})