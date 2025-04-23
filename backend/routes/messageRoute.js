const express = require('express')
const { addMessage, getMessage, getLatestMessage, readMessages, unreadMessages } = require('../controllers/messageController')
const {authMiddleware} = require('../middlewares/authMiddlewares')
const messageRouter = express.Router()

messageRouter.post('/new', addMessage)

messageRouter.get('/:conversationId', getMessage)

messageRouter.get('/latest-message/:conversationId', getLatestMessage)

messageRouter.put('/read-messages/:conversationId', readMessages)

messageRouter.get('/all/unread-messages',authMiddleware, unreadMessages)





module.exports = messageRouter