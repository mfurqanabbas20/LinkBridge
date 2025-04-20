const notificationModel = require('../models/notificationModel')

const createNotification = async (req, res) => {
    try {
        const {id} = req.params
        const notification = {
            fromUser: req.userId,
            // this id refers to which user we sent notification
            toUser: id,
            message: req.body.message,
            notificationType: req.body.notificationType,
        }
        const createdNotification = await notificationModel.create(notification)
        return res.status(200).json({success: true, message: 'Notification sent'})
   
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Error Occured'})
    }
    
}

const getNotifications = async(req, res) => {
    try {
        const notifications = await notificationModel.find({toUser: req.userId}).populate('fromUser')
        return res.status(200).json({success: true, notifications})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

const changeStatus = async (req, res) => {
    try {
        const userId = req.userId
        const notifications = await notificationModel.updateMany({toUser: req.userId}, {$set: {status: 'read'}})
        return res.status(200).json({success: true, message: 'Status Changed'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

module.exports = {createNotification, getNotifications, changeStatus}