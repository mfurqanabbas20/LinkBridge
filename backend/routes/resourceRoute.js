const express = require('express')
const multer = require('multer')

const {addResource, getResources} = require('../controllers/resourceController')

const resourceRouter = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,"uploads/resources")
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage})

resourceRouter.post('/add', upload.single('resource'), addResource)
resourceRouter.get('/all', getResources)

module.exports = resourceRouter