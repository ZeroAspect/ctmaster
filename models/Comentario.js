const { DataTypes } = require("sequelize");
const db = require("../connections/sequelize.js");

const Comentario = db.define("Comentario", 
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
    post_id:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    comment_like:{
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    data: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    }
  }
)

module.exports = Comentario;