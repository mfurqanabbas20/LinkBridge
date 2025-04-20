const progressModel = require('../models/progressModel')


const createProgress = async (req, res) => {
    const {projectId} = req.body
    try {
        const progress = await progressModel.create({projectId})
        return res.status(200).json({message: 'Progress added', progress})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Error Occured'})
    }
    
}

const getProgress = async (req, res) => {
    try {
        const {projectId} = req.params
        const progress = await progressModel.findOne({projectId: projectId})
        res.status(200).json({progress})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error Occured'})
    }
}

const updateProgress = async (req, res) => {
    try {        
        const milestone = req.body.milestone
        const percentage = req.body.percentage
        await progressModel.findOneAndUpdate({projectId: req.body.projectId}, {currentStage: milestone, progressPercentage: percentage}, {new: true})
        return res.status(200).json({message: 'Updated'}) 
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

const uploadDoc = async (req, res) => {
    if(!req.file){
        return res.status(400).json({message: 'Upload Documentation'})
    }
    const filePath = req.file.path
    try {
        const {projectId} = req.body  
        const progress = await progressModel.findOneAndUpdate({projectId: projectId}, {projectDocumentation: filePath}, {new: true})
        return res.status(200).json({message: 'Uploaded', progress})
    } catch (error) {
        console.log(error);
        return res.status(500).json('Error Occured')
    }
}

const uploadCode = async (req, res) => {
    if(!req.file){
        return res.status(400).json({message: 'Upload Code'})
    }
    const filePath = req.file.path
    try {
        const {projectId} = req.body
                
        const progress = await progressModel.findOneAndUpdate({projectId: projectId}, {projectCode: filePath}, {new: true})
                
        return res.status(200).json({message: 'Uploaded', progress})
    } catch (error) {
        console.log(error);
        return res.status(500).json('Error Occured')
    }


}


module.exports = {createProgress, updateProgress, getProgress, uploadCode, uploadDoc}