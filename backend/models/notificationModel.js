const mongoose = require('mongoose')

const notificationSchema = mongoose.Schema(
    {
        // to which user you want to send the notification
        fromUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        toUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        message: {
            type: String,
            required: true
        },
        notificationType: {
            type: String,
            requied: true,
            enum: ['projectRequest', 'alert']
        },
        status: {
            type: String,
            enum:['read', 'unread'],
            default: 'unread'
        }
    },
    {
        timestamps: true
    }
)

const notificationModel = mongoose.model('Notification', notificationSchema)

module.exports = notificationModel
