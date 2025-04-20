const mongoose = require('mongoose')


const ideaSchema = mongoose.Schema(
    {
        idea: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        rating:[
            {
                count: {
                    type: Number,
                    default: 0
                },
                ratedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }
            }
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
)


const ideaModel = mongoose.model('Idea', ideaSchema)


module.exports = ideaModel;