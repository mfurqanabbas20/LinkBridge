const express = require('express')
const { createNotification, getNotifications, changeStatus } = require('../controllers/notifcationController')
const { authMiddleware } = require('../middlewares/authMiddlewares')

const notificationRouter = express.Router()

notificationRouter.post('/create/:id', authMiddleware, createNotification)
// to change the status to read
notificationRouter.put('/readall', authMiddleware, changeStatus)

notificationRouter.get('/getNotifications', authMiddleware, getNotifications)

module.exports = notificationRouter