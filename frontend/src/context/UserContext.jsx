import React, { useState } from 'react'
import { createContext } from 'react'


const UserContext = createContext(null)

export const UserContextProvider = (props) => {
    const url = 'https://linkbridgebackend.vercel.app/'
    const connection_message = "send you a connection request"
    const project_message = "send you a request to supervise their project"
    const [unreadNotifications, setUnreadNotifications] = useState(0)
    const [unreadMessages, setUnreadMessages] = useState(0)
    const [user, setUser] = useState({
        username: '',
        email: '',
        fullname: '',
        password: '',
        role: '',
        university: '',
        industry: '',
        description: '',
        profilePicture: '',
        coverPicture: '',
        connections: '',
    })
    
    const [connections, setConnections] = useState([])
    
    const [project, setProject] = useState([])

    const context_value = {
        user,
        setUser,
        url, 
        project,
        setProject,
        connections,
        setConnections,
        connection_message,
        unreadNotifications,
        setUnreadNotifications,
        unreadMessages,
        setUnreadMessages
    }


    return(
        <UserContext.Provider value={context_value}>
            {props.children}
        </UserContext.Provider>
    )
}
export default UserContext