const express = require('express')
const multer = require('multer')
const { uploadDoc, uploadCode, createProgress, getProgress, updateProgress } = require('../controllers/progressController')

const progressRouter = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/codeanddoc')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage})

// create progress
progressRouter.post('/new', createProgress)

// get progress
progressRouter.get('/:projectId', getProgress)

progressRouter.put('/uploadDoc',upload.single('doc'), uploadDoc )

progressRouter.put('/uploadCode',upload.single('code'), uploadCode )

progressRouter.put('/update', updateProgress)


module.exports = progressRouter
