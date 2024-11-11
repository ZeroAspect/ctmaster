const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: "smtp.google.com",
  port: 587,
  secure: false,
  auth: {
    user: "web.ctmaster@gmail.com",
    pass: "iraildes.500"
  },
  debug: true,
  logger: true
})

const mailOptionsTest = {
  from: "web.ctmaster@gmail.com",
  to: "joseiraildesciprianoribeiro@gmail.com",
  subject: "Test Email",
  text: "This is a test email"
}

transporter.sendMail(mailOptionsTest, (err, info)=>{
  if(err){
    console.log(err)
  } else {
    console.log('Email sent:', info.response)
  }
})