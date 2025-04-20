const progressModel = require('../models/progressModel');
const projectModel = require('../models/projectModel')
const userModel = require('../models/userModel')

const addProject = async (req, res) => {
    try {
        const memberIds = await userModel.find({ fullname: { $in: req.body.team } }).select('_id');
        const memberObjectIds = memberIds.map(member => member._id); // Convert to ObjectId array
        const supervisor = await userModel.findOne({ fullname: { $in: req.body.supervisor } }).select('_id');
        
        const supervisorId = supervisor._id

        const alreadyProject = await projectModel.findOne({title: req.body.title})
        
        if(alreadyProject){
            return res.status(409).json({message: 'Project Already Exists'})
        }

    const project = {
        title: req.body.title,
        category: req.body.category,
        supervisor: supervisorId,
        members: memberObjectIds,
        description: req.body.description,
        createdBy: req.userId
    }


    const newProject = await projectModel.create(project)

    const newProgress = await progressModel.create({projectId: newProject._id})

    res.status(200).json({success: true, message: 'Project Added'})
        
    } catch (error) {
        console.log(error);
        res.status(500).json('Error Occured')
    }
}

// for students to get their projects
const getProject = async(req, res) => {
    try {
        const {memberId} = req.params
        const project = await projectModel.findOne({
            members: { $in: [memberId] }
        })
        .populate('members')
        .populate('supervisor')

        if(!project){
            return res.status(404).json({success: 'false',message: 'No Project Exists'})
        }
        

        res.status(200).json({success: true, project})

    } catch (error) {
        console.log(error);
    }
}

const getSupervisorProjects = async(req, res) => {
    try {
        const {id} = req.params
        const projects = await projectModel.find({
            supervisor: id
        })
        .populate('members')
        console.log(projects);

        res.status(200).json({message: "Fetch", projects})
        
    } catch (error) {
        res.status(500).json({message: 'Error Occured'})
    }
}

const updateProjectRequest = async(req, res) => {
    try {
        const {projectId} = req.params
        const project = await projectModel.findByIdAndUpdate(projectId, {approvalStatus: 'Accepted'}, {new: true})        
        res.status(200).json(project)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error'})
    }
}

// for getting all the projects 
const getAllProjects = async(req, res) => {
    try {
        const projects = await projectModel.find({}).populate('members').populate('supervisor')
        return res.status(200).json({success: true, projects})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

const deleteProject = async (req, res) => {
    const id = req.params.projectId
    try {
        const project = await projectModel.findByIdAndDelete({_id: id})
        return res.status(200).json({success: true, message: 'Project Deleted'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Something wrong happens'})
    }
}

const updateRating = async (req, res) => {
    try {        
        const {rating} = req.body
        // this id refers to idea post id
        const {id} = req.params
        const project = await projectModel.findById(id)
        // check if user already rated this idea or not
        const isRated = project.rating.find((rating) => rating?.ratedBy?.toString() === req.userId)  

        if(isRated){
            isRated.count = rating 
        }
        
        else {
            project.rating.push({count: rating, ratedBy: req.userId})
        }
        await project.save()        
        return res.status(200).json({success: true, message: 'Rated'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal Server Error'})
        
    }
}



module.exports = {addProject, getProject,addProject, updateProjectRequest, getSupervisorProjects, getAllProjects, deleteProject, updateRating}