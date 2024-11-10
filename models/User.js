const { DataTypes } = require("sequelize");
const db = require("../connections/sequelize.js");

const User = db.define("Users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false
    },
    data: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }
)

module.exports = User;