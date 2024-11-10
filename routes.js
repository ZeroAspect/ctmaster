const express = require("express")
const app = require("./config/config.js")

app.get('/', async(req, res)=>{
  res.send('Hello World!')
})