const MySql = require("../db/database");

async function checkIP(ip){
  const mysql = await MySql()
  const query = `
  SELECT *
  FROM Users
  WHERE ip = '${ip}'
  LIMIT 1
  `
  const [ exec, rows ] = await mysql.query(query)

  if(exec.length > 0){
    return true
  } else {
    return false
  }
}

module.exports = checkIP;