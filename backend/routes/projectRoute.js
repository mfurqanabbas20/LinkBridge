const express = require('express')
const { addProject, getProject, sendProjectRequest, getSupervisorProjects, updateProjectRequest, getAllProjects, deleteProject, updateRating } = require('../controllers/projectController')
const { authMiddleware } = require('../middlewares/authMiddlewares')

const projectRouter = express.Router()

// for adding the project 
projectRouter.post('/add', authMiddleware, addProject)

projectRouter.get('/:memberId', authMiddleware, getProject)
projectRouter.get('/all/projects', getAllProjects)


projectRouter.get('/supervisor/:id', authMiddleware, getSupervisorProjects)
// For Accepting the Project
projectRouter.put('/:projectId/updateStatus', updateProjectRequest)
projectRouter.delete('/:projectId/delete', deleteProject)

projectRouter.put('/updateRating/:id', authMiddleware, updateRating)


module.exports = projectRouter

