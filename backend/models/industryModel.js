const mongoose = require('mongoose')

const industrySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    deadline: {
        type: String,
        required: true,
        index: {
            expires: 0
        }
    },
    budget: {
        type: Number,
        required: true,
        min: 10,
        max: 5000,
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'completed'],
        default: 'pending'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isPaymentApproved: {
        type: Boolean,
        default: false,
    },
    isPaymentReceived: {
        type: Boolean,
        default: false
    },
    // this is for all the cover letters that are sent on a particular problem
    coverLetter: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User'
            },
            title: {
                type: String,
                required: true
            }
        },
        {
            timestamps: true
        }
    ]
},
{
    timestamps: true
}
)

const industryModel = mongoose.model('Industry', industrySchema)

module.exports = industryModel