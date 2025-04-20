const express = require('express')

const { registerUser, loginUser, forgotUser, googleLogin, googleRegister, resetPassword } = require('../controllers/authController')

const authRouter = express.Router()


authRouter.post('/register', registerUser)

authRouter.post('/login', loginUser)

authRouter.post('/forgot', forgotUser)

authRouter.post('/googlelogin', googleLogin)

authRouter.post('/googleregister', googleRegister)

authRouter.put('/reset/:id', resetPassword)

module.exports = authRouter