const industryModel = require('../models/industryModel')
const userModel = require('../models/userModel')
const stripe = require('stripe')(process.env.Secret_key)

// this is for industry professional to pay his payment
let payment;

const intent = async (req, res) => {
    const {amount} = req.params       
    payment = amount
    console.log('Payment', payment);
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: "usd",
            automatic_payment_methods: {
                enabled: true
            }
        })
        return res.status(200).json({clientSecret: paymentIntent.client_secret})
    } catch (error) {
        console.log(error);
    }
}

let account
let accountLink;

// just to approve the payment status
const approvePayment = async (req, res) => {
    try {
        const {id} = req.params        
        const problem = await industryModel.findOne({_id: id})
        problem.isPaymentApproved = true
        await problem.save()        
        return res.status(200).json({success: true, message: 'Payment Approved'})        
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

// this is for student

const createAccount = async (req, res) => {
    try {
        const {id} = req.params
        const userId = req.userId
        const user = await userModel.findOne({_id: userId})
        if(user.stripeAccount){            
            const existing_account = await stripe.accounts.retrieve(user.stripeAccount)            
            if(existing_account.capabilities.transfers == 'inactive'){
                accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: 'http://localhost:5173',
                    return_url: `http://localhost:5173/created-stripe/${id}`,
                    type: 'account_onboarding'
                })
                return res.status(200).json({success: true, accountLink})
            }  
            
            return res.status(200).json({success: true, message: 'Account Existed', accountId: user.stripeAccount})
        }
               
        account = await stripe.accounts.create({
            type: 'express',
            country: 'US',
            email: user.email,
            capabilities: { 
                transfers: {requested: true}
            }
        })

        user.stripeAccount = account.id

        await user.save()

        accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: 'http://localhost:5173',
            return_url: `http://localhost:5173/created-stripe/${id}`,
            type: 'account_onboarding'
        })

        return res.status(200).json({success: true, accountLink, message: 'Payment sent'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

const transferMoney = async (req, res) => {
    const userId = req.userId
    const {problemId} = req.params
    const user = await userModel.findOne({_id: userId})
    const problem = await industryModel.findOne({_id: problemId})
    console.log('Inside transfer Money');
    try {
        if(!problem){
            return res.status(404).json({success: false, message: 'No Problem Found'})
        }
        if(problem.isPaymentRecieved){
            return res.status(401).json({success: false, message: 'Payment Already Transfer'})
        }
        
        const transfer = await stripe.transfers.create({
            amount: problem.budget * 100 * 0.95,
            currency: 'usd',
            destination: user.stripeAccount,
            transfer_group: `${Date.now()}-LB`,
        });        
        approveTransferMoney(problemId)
        return res.status(200).json({success: true, message: 'Payment Transfer'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

const approveTransferMoney = async (problemId) => {
    try {
        const problem = await industryModel.findOne({_id: problemId})        
        problem.isPaymentReceived = true
        await problem.save()  
    } catch (error) {
        console.log(error);
    }
}




module.exports = {intent, createAccount, transferMoney, approvePayment, approveTransferMoney}