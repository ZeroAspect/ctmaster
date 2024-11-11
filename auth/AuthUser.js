const db = require("../connections/sequelize.js");
const MySql = require("../db/database.js");
const User = require("../models/User.js");

async function checkUser(nome, senha){
  const user = await User.findOne({ where: { nome: nome, senha: senha } });
  console.log(user)
  if(user === null){
    console.log("Usuário não encontrado")
    return false
  }else{
    return true
  }
}

module.exports = checkUser