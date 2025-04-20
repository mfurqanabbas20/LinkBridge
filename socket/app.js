const userModel = require('../backend/models/userModel')
const database = require('../backend/config/db')


database()

const io = require('socket.io')(9000, {
    cors: {
        origin: "http://localhost:5173"
    }
})

let users = []

const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) 
    && users.push({ userId, socketId })
}

const removerUser = (socketId) => {
     users = users.filter((user) => {
        return user.socketId !== socketId
    })
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    // take userId and socketId from user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id)
        io.emit("getUsers", users)
    })

    // send and get messages
    socket.on("sendMessage", async ({senderId, recieverId, message}) => {
        const user = getUser(recieverId)
        const sender = await userModel.findOne({_id: senderId})
        
        try {
            io.to(user.socketId).emit("getMessage", {
                sender,
                message
            })
        } catch (error) {
            console.log(error);
        }
        
    })

    socket.on("disconnect", () => {
        console.log('somebody disconnects');
        removerUser(socket.id)
        io.emit("getUsers", users)
    })
})

console.log('Server is listening on PORT 9000');

