const nodemailer = require('nodemailer')

const sgTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sgTransport({
    auth: {
        api_key: process.env.API_KEY
    }
}))

 function sendMail(to, msg){
     transporter.sendMail({
        to: to,
        from: 'mfurqanabbas20@gmail.com',
        subject: 'Password Reset',
        html: `<h1>${msg}</h1>`
    })
    console.log('Email Sent');
    
}


module.exports = {sendMail}