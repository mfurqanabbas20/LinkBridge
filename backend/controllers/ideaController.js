const ideaModel = require("../models/ideaModel");


const addIdea = async (req, res) => {
    try {
        const idea = {
            idea: req.body.idea,
            category: req.body.category,
            createdBy: req.userId
        }
        console.log('Hi');
        const addedIdea = await ideaModel.create(idea)
        return res.status(200).json({success: true, addedIdea})
        
        
        // const idea = await ideaModel
    } catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server Error')
    }
}

const deleteIdea = async(req, res) => {
    try {
        const id = req.params.id        
        const idea = await ideaModel.findByIdAndDelete(id)
        return res.status(200).json({success: true, message: 'Deleted'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

const getAllIdeas = async (req, res) => {
    try {
        const ideas = await ideaModel.find({}).populate('createdBy')
        return res.status(200).json({success: true, ideas})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

const getUserIdeas = async (req, res) => {
    try {
        const ideas = await ideaModel.find({createdBy: req.userId})
        return res.status(200).json({success: true, message: 'Find', ideas})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal Server Error'})
        
    }
}

const updateRating = async (req, res) => {
    try {
        const {rating} = req.body
        // this id refers to idea post id
        const {id} = req.params
        const idea = await ideaModel.findById(id)
        // check if user already rated this idea or not
        const isRated = idea.rating.find((rating) => rating.ratedBy.toString() === req.userId)  

        if(isRated){
            isRated.count = rating 
        }

        else {
            idea.rating.push({count: rating, ratedBy: req.userId})
        }
        await idea.save()        
        return res.status(200).json({success: true, message: 'Rating Updated'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal Server Error'})
        
    }
}


module.exports = {addIdea, deleteIdea, getAllIdeas, getUserIdeas, updateRating}