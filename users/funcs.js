const MySql = require("../db/database.js");
const User = require("../models/User.js");

class UserServices{
  constructor(user){
    this.user = user;
    this.mysql = MySql()
  }

  async ipExists(ip, options = {}){
    const user = await User.findOne({
      where: {
        ip
      }
    })

    if(user === null) return null

    return true
  }
  
  async destryUser(ip, options = {}){
    const ipExists = this.ipExists(ip)


    if(ipExists === null) return false

    const user = await User.findOne({
      where: {
        ip
      }
    })
    
    await user.destroy();
  }
  
  async updateUser(ip, options = {}){
    const ipExists = this.ipExists(ip)
    
    if(ipExists === null) return false
    
    const user = await User.findOne({
      where: {
        ip
      }
    })
    
    await user.update({
      nome: options.nome || user.nome,
      email: options.email || user.email,
      senha: options.senha || user.senha,
      biografia: options.biografia || user.biografia
    })
  }
}

module.exports = UserServices;