const mongoose = require('mongoose')

const projectSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true
        },
        supervisor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        description: {
            type: String,
            required: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        // for supervisor to accept project or reject
        approvalStatus: {
            type: String,
            enum: ['Accepted', 'Rejected', 'Pending'],
            default: 'Pending'
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
    },
    {
        timestamps: true
    }
)

const projectModel = mongoose.model('Project', projectSchema)

module.exports = projectModel