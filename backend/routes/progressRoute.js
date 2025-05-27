const express = require('express')
const multer = require('multer')
const { uploadDoc, uploadCode, createProgress, getProgress, updateProgress } = require('../controllers/progressController')
const progressRouter = express.Router()
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/codeanddoc')
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`)
//     }
// })

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => ({
    folder: 'linkbridge/codeanddoc',
    resource_type: 'raw',
    format: 'pdf'
  })
})

const upload = multer({storage})

// create progress
progressRouter.post('/new', createProgress)

// get progress
progressRouter.get('/:projectId', getProgress)

progressRouter.put('/uploadDoc',upload.single('doc'), uploadDoc )

progressRouter.put('/uploadCode',upload.single('code'), uploadCode )

progressRouter.put('/update', updateProgress)


module.exports = progressRouter
