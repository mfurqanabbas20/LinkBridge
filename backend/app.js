const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const PORT = process.env.PORT
const database = require('./config/db')
const path = require('path')

app.use(cors({
    // origin: ["https://linkbridgeweb.vercel.app"],
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
    credentials: true
   }
))

app.options('*', cors(
    {
        // origin: ["https://linkbridgeweb.vercel.app"],
        origin: ["http://localhost:5173"],
        methods: ["POST", "GET", "PUT", "DELETE"],
        allowedHeaders: ['Content-Type', 'Authorization', 'token'],
        credentials: true
}
))

// connecting the database
database()

// middlewares
app.use(express.json())


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


// first endpoint

app.get('/', (req, res) => {
    res.send("Hello LinkBridge")
})

// api endpoints
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

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
    console.log('Server is listening on Port', PORT);
})

