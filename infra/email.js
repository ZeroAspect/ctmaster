const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: "smtp.umbler.com",
  port: 587,
  secure: false,
  auth: {
    user: "contato@ctmaster.com.br",
    pass: "iraildes.500"
  },

})

const mailOptionsTest = {
  from: "contato@ctmaster.com.br",
  to: "",
  replyTo: "",
  subject: "Test Email",
  text: "This is a test email"
}
const mailOptions = {
  from: "contato@ctmaster.com.br",
  to: "",
  replyTo: "",
  subject: "",
  html: "",
}
async function sendMail(options = {}){
  try {
    await transporter.sendMail({
      from: options.from || mailOptionsTest.from,
      to: options.to || mailOptionsTest.to,
      replyTo: options.replyTo || mailOptionsTest.replyTo,
      subject: options.subject || mailOptionsTest.subject,
      html: options.html || ""
    })
    
    return {
      success: true,
      message: "Email sent successfully!"
    }
  } catch(error){
    console.error("Error sending email:", error)
    return {
      success: false,
      message: "Error sending email. Please try again later."
    }
  }
}
