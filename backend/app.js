const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const PORT = process.env.PORT
const database = require('./config/db')

// connecting the database
database()

// middlewares
app.use(express.json())

app.use(cors({
    origin: ['https://linkbridgeweb.vercel.app'],
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true
}))


// importing the Routes
const authRouter = require('./routes/authRoute')
const userRouter = require('./routes/userRoute')
const projectRouter = require('./routes/projectRoute')
const notificationRouter = require('./routes/notificationRoute')
const messageRouter = require('./routes/messageRoute')
const conversationRouter = require('./routes/conversationRoute')
const progressRouter = require('./routes/progressRoute')
const postRouter = require('./routes/postRoute')
const ideaRouter = require('./routes/ideaRoute')
const resourceRouter = require('./routes/resourceRoute')
const industryRouter = require('./routes/industryRoute')
const paymentRouter = require('./routes/paymentRoute')

// api endpoints
app.use('/uploads', express.static('uploads'))

// for user registration
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

// for industry problem solving 
app.use('/api/industry', industryRouter)

// for payment gateway
app.use('/api/industry/payment', paymentRouter)

// for idea incubator route
app.use('/api/idea', ideaRouter)

// for resource route
app.use('/api/resource', resourceRouter)

// project route
app.use('/api/project', projectRouter)

// progress route
app.use('/api/progress', progressRouter)

// post route
app.use('/api/post', postRouter)

// notification route
app.use('/api/notification', notificationRouter)

// messaging system route
// conversation route
app.use('/api/conversation', conversationRouter)
// message route
app.use('/api/message', messageRouter)


// starting the server
app.listen(PORT, () => {
    console.log('Server is listening on PORT', PORT);
})

