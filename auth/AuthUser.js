const db = require("../connections/sequelize.js");
const MySql = require("../db/database.js");
const User = require("../models/User.js");

async function checkUser(options = {}){
  try{
    const user = await User.findOne({
      where: {
        nome: options.nome,
        senha: options.senha
      }
    })
    if(user === null){
      return null
    }else{
      return {
        user: true,
        nome: options.nome,
        senha: options.senha
      }
    }
  } catch(error){
    console.error(error);
    return null;
  }
}

module.exports = checkUser