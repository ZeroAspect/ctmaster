const app = require("./config/config.js");
require("./routes.js")
app.listen(3000, (err)=>{
  if(!err){
    console.log({
      message: "Server running"
    })
  }
})