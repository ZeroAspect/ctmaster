const { Sequelize } = require("sequelize")

const db = new Sequelize(
  "mysql://root:kKvISwCfYZbqBcCvimZvRcoAjdmVGMis@autorack.proxy.rlwy.net:12484/railway"
)

module.exports = db