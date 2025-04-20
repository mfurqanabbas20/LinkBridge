const express = require('express')
const { newConversation, getConversation, deleteConversation } = require('../controllers/conversationController')

const conversationRouter = express.Router()
const {authMiddleware} = require('../middlewares/authMiddlewares')
// new conversation

conversationRouter.post('/new/:recieverId', authMiddleware, newConversation)

conversationRouter.get('/:userId', getConversation)
// use this delete api
conversationRouter.delete('/:id', deleteConversation)

// get conversation of a user







module.exports = conversationRouter