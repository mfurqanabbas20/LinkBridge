const express = require('express')
const {authMiddleware} = require('../middlewares/authMiddlewares')
const { addPost, getPosts, addComment, updateLikes, getUserPosts, getProfilePosts, deletePost } = require('../controllers/postController')
const multer = require('multer')
const postRouter = express.Router()
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/peerpost")
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`)
//     }
// })

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'linkbridge/peerpost',
  }
})

const upload = multer({storage})

postRouter.post('/add', upload.array("media"), addPost)
postRouter.get('/:postId', authMiddleware, getPosts)
postRouter.get('/profile/posts', authMiddleware, getUserPosts)
postRouter.put('/comment/:postId', addComment)
postRouter.put('/like/:postId', authMiddleware, updateLikes)
postRouter.delete('/delete/:postId', authMiddleware, deletePost)


module.exports = postRouter