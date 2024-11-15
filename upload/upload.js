const multer = require("multer")

const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, '../photos/')
  },
  filename: (req, file, cb)=>{
    const fileExtension = file.originalname.split('.')[1]

    const newFilename = require("crypto")
    .randomBytes(64)
    .toString('hex')

    cb(null, `${newFilename}.${fileExtension}`)
  }
})

module.exports = {
  upload: multer({ storage })
}