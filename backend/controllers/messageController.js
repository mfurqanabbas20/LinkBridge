const conversationModel = require('../models/conversationModel')
const messageModel = require('../models/messageModel')

const addMessage = async(req, res) => {
    try {
        
        // It takes everything in body and paste it
        const newMessage = req.body
        const savedMessage = await messageModel.create(newMessage)        
        
        res.status(200).json(savedMessage)
    } catch (error) {
        console.log(error);
        
        res.status(500).json({message: 'Error Occured'})
    }
}

const getMessage = async(req, res) => {
    const {conversationId} = req.params
    try {
        // whole messages
        const messages = await messageModel.find({
            conversationId: conversationId
        }).populate('sender')
        
        if(!messages){
            return res.status(200).json({message: 'No Message Found'})
        }
        
        
        return res.status(200).json({success: true, messages})
    } catch (error) {
        res.status(500).json({message: 'Error Occured'})
    }
}

const getLatestMessage = async(req, res) => {
    const {conversationId} = req.params
    try {
        const message = await messageModel.findOne({conversationId}).sort({createdAt: -1})
        return res.status(200).json({success: true, latestMessage: message})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

// api to change status of messages to read
const readMessages = async (req, res) => {
    const conversationId = req.params.conversationId
    try {
        const messages = await messageModel.updateMany({conversationId: conversationId}, {$set: {status: 'read'}})
        return res.status(200).json({success: true, message: 'Messages Read'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

// api to get unread messages
const unreadMessages = async(req, res) => {
    const userId = req.userId
    try {
        // getting conversation where user is member
        const conversationIds = await conversationModel.find({members: userId}).select('_id')
        const messages = await messageModel.find({status: 'unread',conversationId: {$in: conversationIds}, sender: {$ne: userId}})
        return res.status(200).json({success: true, messages})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: true, message: 'Internal Server Error'})
    }
}




module.exports = {addMessage, getMessage, getLatestMessage, readMessages, unreadMessages}