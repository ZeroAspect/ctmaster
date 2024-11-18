const { DataTypes } = require("sequelize");
const db = require("../connections/sequelize.js");

const Resposta = db.define("respostas",
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
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    }
  }
)

module.exports = Resposta;