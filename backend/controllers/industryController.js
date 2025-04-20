const industryModel = require("../models/industryModel");


const addProblem = async (req, res) => {
    try {
        const newProblem = {
            title: req.body.title,
            category: req.body.category,
            deadline: req.body.deadline,
            budget: req.body.budget,
            description: req.body.description,
            createdBy: req.userId
        }     
        const problem = await industryModel.create(newProblem)   
        return res.status(200).json({success: true, message: 'Problem Added', problem})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal Server Error'})
    }
} 

const getProblems = async (req, res) => {
    try {
        // only fetch those problems that are accepted or pending status
        const problems = await industryModel.find().populate('assignedTo')
        return res.status(200).json({success: true, problems: problems})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

const addCoverLetter = async(req, res) => {
    try {
        const {id} = req.params
        await industryModel.findByIdAndUpdate(id, {$push: {coverLetter: {userId: req.userId, title: req.body.coverLetter}}})
        res.status(200).json({success: true, message: 'Cover Letter Added'})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

const postedByMe = async (req, res) => {
    const id = req.userId
    try {        
        const problems = await industryModel.find({createdBy: id}).populate('assignedTo')        
        res.status(200).json({success: true, problems})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

const getCoverLetters = async(req, res) => {
    const {id} = req.params
    try {
        const problem = await industryModel.findOne({_id: id}).populate('coverLetter.userId')
        if(!problem){
            return res.status(404).json({message: 'No Problem Found'})
        }   
        const coverLetter = problem.coverLetter
        if(!coverLetter){
            return res.status(404).json({message: 'No Cover Letter Fond'})
        }
        return res.status(200).json({success: true, coverLetter})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

const acceptOffer = async (req, res) => {
    const {id, userId} = req.params    
    try {
        const problem = await industryModel.findOne({_id: id})
        // console.log(problem);
        problem.status = 'accepted'
        problem.assignedTo = userId
        problem.save()
        return res.status(200).json('hi')
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}


const getOffers = async (req, res) => {
    const id = req.userId
    
    try {
        const problems = await industryModel.find({assignedTo: id}).populate('assignedTo')  
        
        if(!problems){
            return res.status(404).json({message: 'No offer found'})
        }
        
        return res.status(200).json({success: true, problems})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

const getCompleted = async (req, res) => {
    const id = req.userId
    
    try {
        const problems = await industryModel.find({assignedTo: id, isPaymentReceived: true}).populate('assignedTo')  
        
        if(!problems){
            return res.status(404).json({message: 'No offer found'})
        }
        
        return res.status(200).json({success: true, problems})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}


const getSingleProblem = async (req, res) => {
    const {id} = req.params
    try {
        const problem = await industryModel.findOne({_id: id})
        return res.status(200).json({success: true, problem: problem})
        
    } catch (error) {
            console.log(error);
            return res.status(500).json({success: false, message: 'Internal Server Error'})     
    }
    
}




module.exports = {addProblem, getProblems, addCoverLetter, postedByMe, getCoverLetters, acceptOffer, getOffers, getCompleted, getSingleProblem}