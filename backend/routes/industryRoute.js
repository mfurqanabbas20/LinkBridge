const express = require('express')
const { addProblem, getProblems, addCoverLetter, postedByMe, getCoverLetters, acceptOffer, getOffers, getSingleProblem, getCompleted } = require('../controllers/industryController')
const { authMiddleware } = require('../middlewares/authMiddlewares')

const industryRouter = express.Router()

industryRouter.post('/add',authMiddleware, addProblem)
industryRouter.put('/:id/addCoverLetter',authMiddleware, addCoverLetter)
industryRouter.get('/problems', getProblems)
industryRouter.get('/postedByMe', authMiddleware, postedByMe)
industryRouter.get('/:id/getCoverLetters', getCoverLetters)
industryRouter.put('/:id/acceptOffer/:userId', acceptOffer)
industryRouter.get('/getOffers',authMiddleware, getOffers)
industryRouter.get('/getCompleted',authMiddleware, getCompleted)

industryRouter.get('/single-idea/:id', getSingleProblem)



module.exports = industryRouter