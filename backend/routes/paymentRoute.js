const express = require('express')
const { intent, createAccount, transferMoney, approvePayment, approveTransferMoney } = require('../controllers/paymentController')
const {authMiddleware} = require('../middlewares/authMiddlewares')
const paymentRouter = express.Router()

// this is for approve payment from industry professional account
paymentRouter.put('/approve-payment/:id', approvePayment)
paymentRouter.post('/create-payment-intent/:amount', authMiddleware, intent)

// this is for student payment routes.....
paymentRouter.post('/create-account/:id', authMiddleware, createAccount)
paymentRouter.post('/transfer-money/:problemId', authMiddleware, transferMoney)




module.exports = paymentRouter
