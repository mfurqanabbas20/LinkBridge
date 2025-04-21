import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
const SearchUser = ({searchUser}) => {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const {url, user, connection_message} = useContext(UserContext)
  const [isConnected, setIsConnected] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [acceptedConnections, setAcceptedConnections] = useState([])

  const getAcceptedConnections = async () => {
    const response = await axios.get(`${url}/api/user/connects/accepted/${searchUser._id}`, {headers: {token}})
    setAcceptedConnections(response.data.connections);
  };

  useEffect(() => {
    getAcceptedConnections()
  }, [])
  
  const sendConnect = async(id) => {
    try {
      setIsPending(true)
    const message = `${user.fullname} ` + connection_message
    const notificationType = 'alert'
    await axios.put(`${url}/api/user/${id}/connect`,{}, {headers: {token}})
    // api for sending connect
    await axios.post(`${url}/api/notification/create/${id}`,{message, notificationType}, {headers: {token}})
    toast.success('Connection Sent', {
      autoClose: '2000',
      position: 'bottom-left'
    })
    } catch (error) {
      toast.error('Error Occured', {
        autoClose: '2000',
        position: 'bottom-left'
      })
    }
    
  }

  // checking if weather this user is connected before or not

  const checkConnection = () => {
    try {            
      const acceptedConnection = searchUser?.connections.some((item) => {
        return item.user === user._id && item.status === 'accepted'
      }) 
      
      const pendingConnection = searchUser?.connections.some((item) => {
        return item.user === user._id && item.status === 'pending'
      }) 
      
      setIsPending(pendingConnection)
      setIsConnected(acceptedConnection)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const handleClick = (id) => {
    navigate('/user/'+id)
  }  

  const handleDisconnect = async (id) => {
    // api to disconnect user
    setIsPending(false)
    setIsConnected(false)
    await axios.delete(`${url}/api/user/${id}/disconnect`, {headers: {token}})    
  }

  const acceptRequest = async (id) => {
    try {
    setIsConnected(true)
    const response = await axios.put(`${url}/api/user/${id}/approve`, {}, {headers: {token}})
    toast.success('Connection Accepted', {
      autoClose: '2000',
      position: 'bottom-left'
    })
    } catch (error) {
      console.log(error)
    }
    
  }

  
  return (
    <>
    <div className='cursor-pointer bg-white flex border my-3 py-4 px-3 justify-between rounded-xl drop-shadow-sm'>
        <div onClick={() => handleClick(searchUser._id)} className='flex items-start'>
          <img className='m-2 w-16 h-16 object-cover rounded-full' src={`${url}/${searchUser.profilePicture}`} alt="" />
          <div>
            <h1 className='font-bold'>{searchUser.fullname}</h1>
            <p className='truncate w-64 max-sm:text-[13px] max-sm:mt-2'>{searchUser.description}</p>
            <p className='text-sm hover:underline max-sm:text-[13px]'>{acceptedConnections.length} Total Connections</p>
          </div>
        </div>
        
        {
        isPending && searchUser?.connections.some((item) => {
          if(item.user === user._id){
            return;
          }
          return item.user !== user._id
        }) 
        ?
        <button onClick={() => handleDisconnect(searchUser._id)} className='w-28 h-8 border border-blue-600 text-blue-500 font-semibold rounded-full drop-shadow-sm'>Requested</button>
        :
        isPending && searchUser?.connections.some((item) => {
          console.log(item);
          
          return item.user === user._id
        })
        ?
        <button onClick={() => acceptRequest(searchUser._id)} className='w-28 h-8 border border-blue-600 text-blue-500 font-semibold rounded-full drop-shadow-sm'>Accept</button>
        :
        (
          isConnected ? <button onClick={() => handleDisconnect(searchUser._id)} className='w-28 h-8 border border-blue-600 text-blue-500 font-semibold rounded-full drop-shadow-sm'>Connected</button> : <button className='w-28 h-8 border border-blue-600 text-blue-500 font-semibold rounded-full drop-shadow-sm' onClick={() => sendConnect(searchUser._id)}>Connect</button>
        )
        }
        </div>
    </>
  )
}

export default SearchUser