const mongoose = require('mongoose')

const messageSchema = mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation'
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        message: {
            type: String,
            required: true
        }, 
        status: {
            type: String,
            default: 'unread',
            enum: ['unread', 'read']
        }
    },
    {
        timestamps: true
    }
)

const messageModel = mongoose.model('Message', messageSchema)

module.exports = messageModel