const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String,
        required: true
    },
    media: {
        type: [String],
        required: true
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    comments: [
    {
        userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        },
        comment: {
            type: String,
            required: true
        },
        createdAt: {
            type: String,
            default: Date.now
        }
    },
    ],
    feedback: {
        type: String
    }
},{
    timestamps: true
})

const postModel = mongoose.model('Post', postSchema)


module.exports = postModel

