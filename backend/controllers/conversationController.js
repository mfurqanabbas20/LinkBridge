const conversationModel = require('../models/conversationModel')


const newConversation = async (req, res) => {
    const {recieverId} = req.params
    const userId = req.userId
    const alreadConversation = await conversationModel.findOne({
        members: {$all: [userId, recieverId]}
    })
    console.log(alreadConversation);
    
    if(alreadConversation){
        return res.status(409).json({success: false, message: 'Conversation Already Exists'})
    }
    const newConversation = {
        members: [userId, recieverId],
    }
    try {
        const savedConversation = await conversationModel.create(newConversation)
        return res.status(200).json(savedConversation)
    } catch (error) {
        console.log(error);
        return res.status(500).json('Error Occured')
    }
}

// get a conversation

const getConversation = async (req, res) => {
    try {
        const {userId} = req.params
        
        const conversation = await conversationModel.find({
            members: {$in: [userId]}
        })
        .populate('members')
        console.log(conversation);
        
        
        res.status(200).json({success: true, conversation})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error Occured'})
    }
}

const deleteConversation = async (req, res) => {
    try {
        const id = req.params.id
        const conversation = await conversationModel.findByIdAndDelete(id)
        console.log(conversation);
        return res.status(200).json({success: true, message: 'Conversation Deleted'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

module.exports = {newConversation, getConversation, deleteConversation}