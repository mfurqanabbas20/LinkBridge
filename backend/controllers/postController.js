const postModel = require('../models/postModel')
const userModel = require('../models/userModel')

const addPost = async (req, res) => {
    try {
        if(!req.files){
            return res.status(404).json({message: 'Missing File'})
        }
        const filePath = req.files.map((item) => {
            return item.path
        })

        const newPost = {
            user: req.body.user,
            description: req.body.description,
            media: filePath
        }

        const post = await postModel.create(newPost)

        console.log(post);
        
        res.status(200).json({success: true, message: 'Peer Post Created'})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error Occured'}) 
    }
}

const getPosts = async(req, res) => {  
    const user = req.userId
    const login_user = await userModel.findOne({_id: user})
    
    const connectedUsers = login_user.connections.map((item) => {
        return item.user?._id
    })  
    
    try {
        const posts = await postModel.find({user: {$in: connectedUsers}})
        .populate('user')
        .populate('comments.userId')
        return res.status(200).json({posts})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error Occured'})    
    }
}


const getUserPosts = async(req, res) => {
    try {
        const posts = await postModel.find({user: req.userId})
        .populate('user')
        .populate('comments.userId')
        return res.status(200).json({posts})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Error Occured'})    
    }
}

const addComment = async (req, res) => {
    const {postId} = req.params;
    const {userId} = req.body
    try {
        const post = await postModel.findByIdAndUpdate(
            postId,
            {
                $push: {
                    comments: {
                        userId,
                        comment: req.body.comment
                    }
                }
            }
         )
         res.status(200).json({message: 'Comment Added', post})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error Occured'})
    }
}

const updateLikes = async (req, res) => {
    const {postId} = req.params
    try {
        const post = await postModel.findById(postId)
        if(!post.likes.includes(req.userId)){
            const updatedPost =  await post.updateOne({$push: {likes: req.userId}})
            return res.status(200).json({message: 'Like Added', updatedPost})
        }
        else {
            const updatedPost =  await post.updateOne({$pull: {likes: req.userId}})
            return res.status(200).json({message: 'Dislike Post', updatedPost})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'})
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await postModel.findByIdAndDelete(req.params.postId)
        console.log(post)
        return res.status(200).json({success: true, message: 'Post Deleted'})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error Occured'})
    }
}


module.exports = {addPost, getPosts, addComment, updateLikes, getUserPosts, deletePost}