const express = require('express')
const {getAllUsers, singleUser, updateUser, deleteUser, uploadProfilePic, uploadCoverPic, getSupervisors, getStudents, Feed, connectUser, approveConnection, getPendingConnections, getAcceptedConnections, disconnectUser } = require('../controllers/userController')
const multer = require('multer')
const { authMiddleware } = require('../middlewares/authMiddlewares')
const userRouter = express.Router()

// Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,"uploads/profileandcover")
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
})
  
const upload = multer({storage})

// route for uploading profile & cover
userRouter.put('/upload-profile',authMiddleware, upload.single('profilePic'), uploadProfilePic)
userRouter.put('/upload-cover',authMiddleware, upload.single('coverPic'), uploadCoverPic)

// update the user
userRouter.put('/:id', authMiddleware, updateUser)

// delete the user
userRouter.delete('/:id', deleteUser)

// get single user
userRouter.get('/:id', singleUser)

// get all the users
userRouter.get('/all/users', getAllUsers)

// get all the supervisors
userRouter.get('/all/supervisors', getSupervisors)
userRouter.get('/all/students', getStudents)

// get the peer feed user suggestions
userRouter.get('/peer/feed/:university', authMiddleware, Feed)

// connect a user
userRouter.put('/:id/connect', authMiddleware, connectUser)

// disconnect a user
userRouter.delete('/:recipientId/disconnect',authMiddleware, disconnectUser)

// approve user connection 
userRouter.put('/:id/approve',authMiddleware, approveConnection)

// getting connections 
userRouter.get('/connects/pending',authMiddleware, getPendingConnections)
userRouter.get('/connects/accepted/:userId',authMiddleware, getAcceptedConnections)

module.exports = userRouter