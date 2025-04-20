const mongoose = require('mongoose')

const resourceSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    document: {
        type: String,
        required: true
    }
},
{
    timestamps: true
}
)

const resourceModel = mongoose.model('Resource', resourceSchema)

module.exports = resourceModel