const mongoose = require('mongoose')

const connectDB = () => {
    mongoose.connect('mongodb+srv://mfurqanabbas20:oU7NKYM99ZYP7pz2@cluster0.w1ng5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Connected Successfully');
    })
    .catch((error) => {
        console.log(error);    
    })
}

module.exports = connectDB