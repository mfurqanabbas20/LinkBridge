const mongoose = require('mongoose')

const progressSchema = mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    // for storing current stage
    currentStage: {
        type: Object,
        default: {
            requirement: false,
            system: false,
            ui: false,
            frontend: false,
            backend: false,
            testing: false,
            deployment: false
        },
    },
    progressPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    projectCode: {
        type: String,
        default: null
    },
    projectDocumentation: {
        type: String,
        default: null
    }
},
{
    timestamps: true
}
)

const progressModel = mongoose.model('Progress', progressSchema)


module.exports = progressModel