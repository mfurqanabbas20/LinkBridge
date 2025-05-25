const userModel = require("../models/userModel");
const conversationModel = require("../models/conversationModel");
const ideaModel = require("../models/ideaModel");
const industryModel = require("../models/industryModel");
const notificationModel = require("../models/notificationModel");
const postModel = require("../models/postModel");
const projectModel = require("../models/projectModel");
const cloudinary = require('../config/cloudinary')

// upload profile picture
const uploadProfilePic = async(req, res) => {
  if(!req.file){
    return res.status(400).json({message: 'Please Upload file'})
  }  
  const userId = req.userId
  
  const filePath = req.file.path

  try {
    const uploadedImage = await cloudinary.uploader.upload(filePath, (err, result) => {
      if(err){
        console.log(err);
        return;
      }
    })

    const user = await userModel.findByIdAndUpdate(userId, {profilePicture: uploadedImage.secure_url}, {new: true})
    return res.status(200).json({message: 'Uploaded', user})

  } catch (error) {
    console.log(error);
    return res.status(500).json({message: 'Error Occured'})
}
}

// upload cover picture
const uploadCoverPic = async(req, res) => {
  if(!req.file){
    return res.status(400).json({message: 'Please Upload file'})
  }  
  const userId = req.userId
  
  const filePath = req.file.path
  
  try {
    const user = await userModel.findByIdAndUpdate(userId, {coverPicture: filePath}, {new: true})
    return res.status(200).json({message: 'Uploaded', user})
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: 'Error Occured'})
  }
}

// update the user info
const updateUser = async(req, res) => {
  try {
      const user = await userModel.findByIdAndUpdate(req.params.id, {
        $set: req.body
      },
      {
        new: true
      }
    )
      res.status(200).json({success: true, message: 'Account has been updated',user})
    
  } catch (error) {
    console.log(error);
    return res.status(500).json('Internal Server Error') 
  }
}

// delete the user
const deleteUser = async(req, res) => {
  try {
    const id = req.params.id  
    const user = await userModel.findOne({_id: id})
    // If the user is student
    if(user.role === 'Student'){
      // deleting all the posts linked to that user
      const post = await postModel.deleteMany({user: id})
      // now deleting all the comment created by that user
      const comments = await postModel.updateMany({}, {$pull: {comments: {userId: id}}})
      const likes = await postModel.updateMany({}, {$pull: {likes: id}})
      // deleting the rating associated with that user on showcase project
      const rating_project = await projectModel.updateMany({}, {$pull: {rating: {ratedBy: id}}})
    }
    
    if(user.role === 'Industry Professional'){
      const ideas = await ideaModel.deleteMany({createdBy: user})
      const problems = await industryModel.deleteMany({createdBy: user})
    }

    // first deleting all the conversations that include this user
    const conversations = await conversationModel.deleteMany({members: id})

    // now deleting all the connections of him
    const connections = await userModel.updateMany(
      {},
      {$pull: {connections: {$or: [{user: id}, {sender: id}]}}}
    )

    // finally deleting that user
    await userModel.findByIdAndDelete(req.params.id)
    return res.status(200).json({success: true, message: 'User deleted'})
  } catch (error) {
    console.log(error);
    return res.status(500).json('Error Occured')
  }
}

// getting all the users from database
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    return res.status(200).json({ success: true, user: users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error Occured" });
  }
};

// get a single user
const singleUser = async (req, res) => {
  try {
  const {id} = req.params
  const user = await userModel.findById(id).populate('connections.user')
  if(!user){
    return res.status(401).json({message: 'User Not Exists'})
  }
  res.status(200).json({success: true, user})
  } catch (error) {
    res.status(500).json({message: 'Internal Error'})
  }
}

// get supervisors
const getSupervisors = async(req, res) => { 
  try {
    const supervisors = await userModel.find({role: 'Teacher'})
    res.status(200).json({success: true, data: supervisors})
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: 'Error Occured'})
  }
}

// get all students
const getStudents = async(req, res) => { 
  try {
    const students = await userModel.find({role: 'Student'})

    res.status(200).json({success: true, data: students})
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: 'Error Occured'})
  }
}

// connect a user
const connectUser = async(req, res) => {
  try {
    let alreadyExists = false
    const userId = req.userId
    // recipients id
    const {id} = req.params
    const user = await userModel.findById(userId)
    if(!user){
      return res.status(401).json({message: 'User Not Exists'})
    }
    // check if already exists
    user.connections.map((item) => {
      if(item.user == id){
        alreadyExists = true
      }
    })   
    
    if(alreadyExists){
      return res.status(409).json({message: 'Already Exists'})
    }
   
    await userModel.findByIdAndUpdate(userId, {
      $push: {
        connections: {
          user: id,
          sender: userId,
          status: 'pending'
        }
      }
    })

    await userModel.findByIdAndUpdate(id, {
      $push: {
        connections: {
          user: userId
        }
      }
    })

    res.status(200).json({message: "Connection Created Successfully"})

  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Error Occured'})
  }
}

const disconnectUser = async(req, res) => {
  try {
    let alreadyExists = false
    const userId = req.userId
    const {recipientId} = req.params
    const user = await userModel.findById(userId)

    if(!user){
      return res.status(401).json({message: 'User Not Exists'})
    }

    user.connections.map((item) => {
      if(item.user == recipientId){
        alreadyExists = true
      }
    })
    
    if(!alreadyExists){
      return res.status(409).json({message: 'No Connection Exists'})
    }
   
    await userModel.findByIdAndUpdate(userId, {
      $pull: {
        connections: {
          user: recipientId
        }
      }
    })

    await userModel.findByIdAndUpdate(recipientId, {
      $pull: {
        connections: {
          user: userId
        }
      }
    })
    return res.status(200).json({message: "Connection Removed Successfully"})

  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Error Occured'})
  }
}


// approve connection
const approveConnection = async (req, res) => {
  const userId = req.userId
  const {id} = req.params
  try {   
    // for login user 
    await userModel.findByIdAndUpdate( 
      userId,
      {
        $set: {
          "connections.$[connection].status": "accepted"
        }
      },
      {
        arrayFilters: [
          {"connection.user": id}
        ]
      }
    )
    // for recipient
    await userModel.findByIdAndUpdate( 
      id,
      {
        $set: {
          "connections.$[connection].status": "accepted"
        }
      },
      {
        arrayFilters: [
          {"connection.user": userId}
        ]
      }
    )
    return res.status(200).json({message: 'Updated Status'})
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: 'Internal Server Error'})
  }
}


const getPendingConnections = async(req, res) => {
  try {
    const userId = req.userId
    const user = await userModel.findOne({_id: userId}).populate('connections.user') 
    const connections = user.connections.filter((item) => {
      return item.status === 'pending' 
    })       
    console.log(connections);
    
    return res.status(200).json({connections})
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Error Occured'})
  }
}

// this is for getting accepted connections
const getAcceptedConnections = async(req, res) => {
  try {
    const {userId} = req.params
    const user = await userModel.findOne({_id: userId}).populate('connections.user')
    const connections = user.connections.filter((item) => {
      return item.status === 'accepted' 
    })       
    return res.status(200).json({connections})
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Error Occured'})
  }

}

// getting peer feed user's 
const Feed = async (req, res) => {
  const {university} = req.params  
  const user = await userModel.findOne({_id: req.userId})  
  try {
      const feed = await userModel.find({
        $or: [
          {university: university , role: 'Student', _id: {$ne: req.userId}},
          {_id: {$in: user.connections.map(con => con._id)}}
        ]
      })
      console.log(feed);
      res.status(200).json({message: 'Feed', feed})
  } catch (error) {
      console.log(error);
      res.status(500).json({message: 'Error Occured'})
  }

}


module.exports = { getAllUsers, singleUser, updateUser, deleteUser, uploadProfilePic, uploadCoverPic, getSupervisors, getStudents, Feed, connectUser, disconnectUser, approveConnection, getPendingConnections, getAcceptedConnections };
