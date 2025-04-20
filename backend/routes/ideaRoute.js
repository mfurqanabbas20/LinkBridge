const express = require('express');
const { addIdea, getAllIdeas, getUserIdeas, updateRating, deleteIdea } = require('../controllers/ideaController');
const { authMiddleware } = require('../middlewares/authMiddlewares');

const ideaRouter = express.Router()

// ideaRouter
ideaRouter.post('/add',authMiddleware, addIdea)
ideaRouter.delete('/delete/:id', deleteIdea)

ideaRouter.get('/allIdeas', getAllIdeas)

// this will get ideas posted by a single user
ideaRouter.get('/userIdeas',authMiddleware, getUserIdeas)
ideaRouter.put('/updateRating/:id',authMiddleware, updateRating)


module.exports = ideaRouter