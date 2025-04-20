const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {sendMail} = require('../util/sendMail')
const crypto = require('crypto')

const registerUser = async (req, res) => {
    try {
      // logic for adding user
      // finding that if this user already exists or not
      const alreadyUser = await userModel.findOne({ email: req.body.email });
  
      if (alreadyUser) {
        return res
          .status(409)
          .json({ success: false, message: "User Already Exists" });
      }
  
      // creating a strong password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const newUser = {
        username: req.body.username,
        fullname: req.body.fullname,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
        university: req.body.university,
        industry: req.body.industry,
      };
  
      // storing user in the database
      const user = await userModel.create(newUser);
  
      const token = generateToken(user._id);
      console.log(token);
      res.status(200).json({ success: true, user: user, message: 'User Created', token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Error Occured" });
    }
  };
  
  const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
  };
  
  const loginUser = async (req, res) => {
    try {
      // login for login in user in to the system
      const existUser = await userModel.findOne({ email: req.body.email });
      if (!existUser) {
        return res.status(409).json({ success: false, message: "User Not Exists" });
      }
      const isMatch = await bcrypt.compare(req.body.password, existUser.password);
      const token = generateToken(existUser._id)
      isMatch ? res.status(200).json({ token, success: true, user: existUser}) : res.status(401).json({ success: false, message: "Password Not Match" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Error Occured" });
    }
  };
  
  const googleLogin = async (req, res) => {
    try {
      const existUser = await userModel.findOne({email: req.body.email})
      if(!existUser){
      return res.status(409).json({success: false, message: 'User not exists', redirect: '/signup'})
      }
      const token = generateToken(existUser._id)
      res.status(200).json({token, success: true, user: existUser})
    } catch (error) {
      console.log(error);
      res.status(500).json({success: 'false', message: 'Error Occured'})
    }
  }
  
  const googleRegister = (req, res) => {
  }
  
  const forgotUser = async (req, res) => {
    const {email} = req.body
    forgotEmail = email
    try {
      const user = await userModel.findOne({email: email})
      if(!user){
      return res.status(401).json({success: false, message: 'User not exits'})
      }
      console.log(user);
      
    const msg = `http://localhost:5173/reset/${user._id}`

    sendMail(forgotEmail, msg)
    res.status(200).json('Link Sent')
    }
    catch(err) {
      console.log(err);
    }
  };

const resetPassword = async (req, res) => {
    const {id} = req.params

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    console.log('id', id);
    
    const user = await userModel.findByIdAndUpdate(id, {password: hashedPassword}, {new: true})
    console.log(user);
    
    if(!user){
      return res.status(401).json('Not a user')
    }

    console.log('User',user);
    
    res.status(200).json({success: true, user: user})

}


module.exports = { registerUser, loginUser, googleLogin, googleRegister, forgotUser, resetPassword };

  