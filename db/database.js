const mysql = require("mysql2")

async function MySql(){
  const connection = await mysql.createPool(
    {
      uri: "mysql://root:kKvISwCfYZbqBcCvimZvRcoAjdmVGMis@autorack.proxy.rlwy.net:12484/railway"
    }
  )
  const data = await connection.promise()
  return data
}

module.exports = MySql