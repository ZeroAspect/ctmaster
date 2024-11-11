const db = require("../connections/sequelize.js");
const MySql = require("../db/database.js");
const User = require("../models/User.js");
const { GetIPFunction } = require("./api/ip.js");

class UserFuncs{
  // check if exists already email or username in databse
  async checkExists(email, username){
    const userExists = await User.findOne({ where: { email, username } });
    if(userExists === null) return false;
    else return true
  }
  async addUser(options = {}){
    const ip = await GetIPFunction()
    try {
      // Check if email already exists
      // const userExists = await User.findOne({ where: { nome: options.nome, email: options.email } });
      // if(userExists) return {
      //   success: false,
      //   message: "Já existe um usuário com esse email ou senha!",
      //   code: 409
      // }
      const check = await this.checkExists(options.nome, options.email)
      if(check === false){
        const user = await User.create({
          options
        })
        return {
          success: true,
          message: "Usuário criado com sucesso!",
          code: 200
        }
      }else{
        return {
          success: false,
          message: "Já existe um usuário com esse email ou nome!",
          code: 409
        }
      }
    } catch (error) {
      console.error("Error adding user to the database:", error);
      return null;
    }
  }

  async getAllUsers(){
    try {
      const users = await User.findAll();
      return users;
    } catch (error) {
      console.error("Error fetching users from the database:", error);
      return null;
    }
  }

  async getUserById(id){
    try {
      const user = await User.findByPk(id);
      if(user === null) return {
        success: false,
        message: "Usuário não encontrado!",
        code: 404
      }
      return user;
    } catch (error) {
      console.error("Error fetching user from the database:", error);
      return null;
    }
  }

  async updateUser(options){
    const ip = await GetIPFunction()
    try {
      const user = await User.findOne({
        where: { ip: ip.query }
      });
      if(user === null) return {
        success: false,
        message: "Usuário não encontrado!",
        code: 404
      }
      await user.update({
        options,
        ip
      })
      return {
        success: true,
        message: "Usuário atualizado com sucesso!",
        code: 200
      }
    } catch (error) {
      console.error("Error updating user in the database:", error);
      return null;
    }
    
  }

  async deleteUser(id){
    const ip = await GetIPFunction()
    try {
      const user = await User.findOne({
        where: { ip: ip.query }
      });
      if(user === null) return {
        success: false,
        message: "Usuário não encontrado!",
        code: 404
      }
      await user.destroy();
      return {
        success: true,
        message: "Usuário excluído com sucesso!",
        code: 200
      }
    } catch (error) {
      console.error("Error deleting user from the database:", error);
      return null;
    }
  }

  async getUsersByUsername(username){
    try {
      const users = await User.findAll({
        where: { username }
      });
      if(users.length === 0) return {
        success: false,
        message: "Nenhum usuário encontrado com esse nome!",
        code: 404
      }
      return users;
    } catch (error) {
      console.error("Error fetching users from the database:", error);
      return null;
    }
  }

  async getUsersByEmail(email){
    try {
      const users = await User.findAll({
        where: { email }
      });
      if(users.length === 0) return {
        success: false,
        message: "Nenhum usuário encontrado com esse email!",
        code: 404
      }
      return users;
    } catch (error) {
      console.error("Error fetching users from the database:", error);
      return null;
    }
  }
}