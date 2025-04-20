import React, { useContext, useEffect, useRef, useState } from 'react'
import img from '../assets/avatar.jpg'
import UserContext from '../context/UserContext'
import axios from 'axios'
import { ColorRing } from 'react-loader-spinner'
import { jwtDecode } from 'jwt-decode'
import io from 'socket.io-client'
import chat_icon from '../assets/email.png'
import logo from '../assets/linkbridge-blue-logo.png'
import { Link } from 'react-router-dom'
import {format} from 'timeago.js'

const ChatMessage = ({isOwn, messages, reciever}) => {
  const {user, url} = useContext(UserContext)  

  return(
    <div className={isOwn ? "sender flex gap-2 justify-start flex-row-reverse" : "reciever flex gap-2"}>
        <img className='h-9 w-9 rounded-full object-cover' src={isOwn ? `${url}/${user?.profilePicture}` : `${url}/${reciever?.profilePicture}`} alt="" />
        <p className={isOwn ? "bg-blue-600 text-white p-2 rounded-lg text-sm" : "bg-gray-200 text-black p-2 rounded-lg text-sm"}>{messages?.message}</p>
    </div>
  )
  
}

const ChatCard = ({decode, conversationId, conversation, messages}) => {
  const {url, user} = useContext(UserContext)
  const [latestMessage, setLatestMessage] = useState('')
  const fetchLatestMessage = async () => {
    const response = await axios.get(`${url}/api/message/latest-message/${conversationId}`)    
    setLatestMessage(response.data.latestMessage)
  }  

  useEffect(() => {
    fetchLatestMessage()
  }, [])
  
  
  const friend = conversation.find((item) => {
    return item._id !== decode.id 
  })    

  
  
  return (
    <div className='flex justify-between hover:bg-slate-100 p-3 rounded-lg'>
      <div className='flex gap-2'>
        <img className='w-12 h-12 rounded-full' src={friend.profilePicture ? `${url}/${friend.profilePicture}` : img} alt="" />
        <div>
          <h1 className='font-bold'>
            {friend.fullname}
          </h1>
          <p className={latestMessage?.status === 'unread' && latestMessage.sender !== user._id ? 'text-sm opacity-80 font-bold' : 'text-xs opacity-60 font-semibold'}>{latestMessage?.message}</p>
        </div>
      </div>
      <p className='text-xs opacity-70'>{format(latestMessage?.createdAt)}</p>
    </div>
  )
}

const NotFound = () => {
  return (
    <div className='flex justify-center pt-5'>
      <h1 className='font-outfit text-xl font-bold'>No Available Chat🥲</h1>
    </div>
  )
}

const StartChat = () => {
  return(
    <div className='flex flex-col gap-2 h-screen w-8/12 items-center justify-center max-sm:hidden'>
      <h1 className='text-3xl font-semibold font-outfit '>Click On Any Conversation To Start Messaging!</h1>
      <i className="fa-solid fa-message text-4xl text-blue-600"></i>
    </div>
  )
}

const ChatSidebar = ({decode, conversations, selectedConversation, setSelectedConversation, messages}) => {
  const {user} = useContext(UserContext)
  const [search, setSearch] = useState('')

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  return(
    <div className={selectedConversation ? "h-screen w-96 flex flex-col gap-3 cursor-pointer overflow-y-auto max-sm:w-screen max-sm:hidden" : "h-screen w-96 flex flex-col gap-3 cursor-pointer overflow-y-auto max-sm:w-screen"}>
      <div className='pl-2 flex flex-col items-center w-60'>
      <Link to={`/${user.role.charAt(0).toLowerCase()}/${user.username}`}>
        <img className='w-40 h-12 object-cover my-2' src={logo} alt="" />
      </Link>
      </div>
      <input onChange={handleSearch} className='ml-2 bg-gray-100 px-2 w-70 min-h-10  outline-blue-500 text-sm' type="text" placeholder='Search messages' />
      {conversations.length === 0 && <NotFound/>}
      {conversations
      .filter((item) => {   
       if(search === '') return true
       const filterResult = 
       item.members.filter((member) => member._id !== user._id)
       .filter((member) => member.fullname.toLowerCase().includes(search))
       return filterResult.length > 0
      })
      .map((item) => {        
        return (
          <div onClick={() => setSelectedConversation(item)}>
             <ChatCard decode={decode} conversationId={item._id} conversation={item.members} messages={messages} />
          </div>
        )
      })}
     
    </div>
  )
}

const ChatWindow = ({socket, messages, setMessages, selectedConversation, setSelectedConversation}) => {
  const {user, url} = useContext(UserContext)
  const [newMessage, setnewMessage] = useState('')
  const [arrivedMessage, setArrivedMessage] = useState(null)
  const members = selectedConversation.members
  const scrollRef = useRef()
  
  const reciever = members.find((item) => {
      return item._id !== jwtDecode(localStorage.getItem("token")).id
  })

  const readMessages = async () => {
    try {
      const response = await axios.put(`${url}/api/message/read-messages/${selectedConversation._id}`, {})
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
      if(messages.length === 0) return;
      
      const lastMessage = messages[messages.length - 1]

      if(lastMessage?.sender === user._id) return;

      if(lastMessage?.sender?._id !== user._id){
        readMessages()
      }

  }, [messages])
  

  useEffect(() => {
    const userId = user._id
    socket.current.emit("addUser", userId)
    socket.current.on("getUsers", users => {
      // console.log(users);
    })
  }, [])

  useEffect(() => {
    socket.current.on('getMessage', (data) => {      
      setArrivedMessage({
        sender: data.sender,
        message: data.message,
        createdAt: Date.now()
      })
      
    })
  }, [socket])

  useEffect(() => {
    // selectedConversation?.members.includes(arrivedMessage.sender)
    arrivedMessage &&  setMessages((prev) => [...prev, arrivedMessage])

  }, [arrivedMessage, selectedConversation])

  const handleSubmit = async () => {
    const message = {
      conversationId: selectedConversation._id,
      sender: user._id,
      message: newMessage,
    }        

    const recieverId = selectedConversation.members.find(member => member._id !== user._id)
    
    socket.current.emit("sendMessage", {
      senderId: user._id,
      recieverId: recieverId._id,
      message: newMessage
    })

    try {
      await axios.post(`${url}/api/message/new`, message)
      setMessages((prevMessages) => [...prevMessages, message])
      setnewMessage('')
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (e) => {
    setnewMessage(e.target.value)
  }

  // for scrolling to end of message screen when new message comes
  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: "smooth"})
  }, [messages])
  
  return(
    <div className='w-3/5 h-screen p-5 flex flex-col max-sm:w-screen max-sm:px-3'>
      <>
      <div className="flex justify-between">
        <div className='flex gap-2 items-center'>
          <i onClick={() => setSelectedConversation('')} className="fa-solid fa-arrow-left cursor-pointer"></i>
          <img className='w-12 h-12 rounded-full object-cover' src={`${url}/${reciever.profilePicture}`} alt="" />
          <div className='flex flex-col'>
            <h1 className='text-lg font-semibold'>{reciever.fullname}</h1>
          </div>
        </div>
      </div>

      <div className="chat-messages my-6 flex flex-col gap-3 overflow-y-auto flex-grow pb-4">
        {messages?.map((item, index) => {   
          return (
            <div ref={scrollRef} key={index}>
              <ChatMessage isOwn={item.sender._id ? item.sender._id == user?._id : true} messages={item} reciever={reciever} key={index}/>
            </div>
          )
        })}
      </div>
      <div className="mt-10 w-[57%] fixed left-[35%] bottom-0 flex items-center gap-2 max-sm:left-0 max-sm:w-screen max-sm:px-2">
        <input className='w-full border border-gray-300 rounded-md outline-blue-500 px-3 h-12 text-sm' type="text" onChange={handleChange} value={newMessage} placeholder='Type a message' />
        <div className='w-8 h-8' onClick={handleSubmit}>
          <img className='w-full h-full flex items-center justify-center' src={chat_icon} alt="" />
        </div>
      </div>
      </>
    </div>
  )
}

const Chat = () => {
  const {url} = useContext(UserContext)
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const socket = useRef()
  const [selectedConversation, setSelectedConversation] = useState(null)

  let decode = jwtDecode(localStorage.getItem("token"));

  useEffect(() => {
    socket.current = io("ws://localhost:9000")
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [])  

  useEffect(() => {    
    fetchMessages()
  }, [selectedConversation])

  const fetchMessages = async () => {
    try {
      if(selectedConversation){
      const response = await axios.get(`${url}/api/message/${selectedConversation._id}`)
      setMessages(response.data.messages)
    }
      
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false)
    }
  }

  const fetchConversations = async () => {
    try {     
      const response = await axios.get(`${url}/api/conversation/${decode.id}`)
      
      setConversations(response.data.conversation)
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }
  }
  
  return (
    <div className='w-full'>
        {loading ? <ColorRing/>
        :
        <div className="flex max-sm:flex-col">
          <ChatSidebar decode={decode} conversations={conversations} selectedConversation={selectedConversation} setSelectedConversation={setSelectedConversation} messages={messages}/>
          {selectedConversation ?
          <ChatWindow socket={socket} setMessages={setMessages} messages={messages} selectedConversation={selectedConversation} setSelectedConversation={setSelectedConversation}/>
          :
          <StartChat/>
          }
          </div>
        }
    </div>
  )
}

export default Chat