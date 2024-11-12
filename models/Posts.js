const { DataTypes } = require("sequelize");
const db = require("../connections/sequelize.js");

const Posts = db.define('Posts',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    titulo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    conteudo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fonte: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    post_like: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  }
)

module.exports = Posts;