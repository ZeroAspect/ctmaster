const MySql = require("../db/database.js");
const { GetIPFunction } = require("../funcs/api/ip.js");
const User = require("../models/User.js");

class UserParams{
  async checkUser(){
    const ip = await GetIPFunction();
    const user = await User.findOne({
      where: {
        ip: ip.query
      }
    })
    if(user === null){
      console.log("Usuário não encontrado")
      return false
    }else{
      console.log("Usuário encontrado")
      return true
    }
  }

  async createUser(options = {}){
    const ip = await GetIPFunction();
    const user = await User.create({
      nome: options.nome,
      email: options.email,
      senha: options.senha,
      biografia: options.biografia,
      ip: ip.query
    })
    console.log("Usuário criado com sucesso")
    return user
  }

  async updateUser(options = {}){
    const ip = await GetIPFunction();
    const user = await User.findOne({
      where: {
        ip: ip.query
      }
    })
    if(user === null){
      console.log("Usuário não encontrado")
      return false
    }else{
      await user.update({
        nome: options.nome || user.nome,
        email: options.email || user.email,
        senha: options.senha || user.senha,
        biografia: options.biografia || user.biografia
      })
      console.log("Usuário atualizado com sucesso")
      return true
    }
  }

  async deleteUser(){
    const ip = await GetIPFunction();
    const user = await User.findOne({
      where: {
        ip: ip.query
      }
    })
    if(user === null){
      console.log("Usuário não encontrado")
      return false
    }else{
      await user.destroy()
      console.log("Usuário deletado com sucesso")
      return true
    }
  }
}