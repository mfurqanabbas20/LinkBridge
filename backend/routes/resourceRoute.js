const express = require('express')
const multer = require('multer')
const {addResource, getResources} = require('../controllers/resourceController')
const resourceRouter = express.Router()
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null,"uploads/resources")
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`)
//     }
// })

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'linkbridge/resources',
  }
})

const upload = multer({storage})

resourceRouter.post('/add', upload.single('resource'), addResource)
resourceRouter.get('/all', getResources)

module.exports = resourceRouter