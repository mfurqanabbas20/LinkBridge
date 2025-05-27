import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import UserContext from '../context/UserContext'
import {format} from 'timeago.js'
import { ProgressBar } from 'react-loader-spinner'
import sample from '../assets/avatar.jpg'

const NotificationCard = ({notification}) => {
  const {url} = useContext(UserContext)
  return(
    <div className='w-full border-b drop-shadow-sm max-sm:w-screen border-2'>
    <div className={notification.status == 'unread' ? "notification flex items-center gap-2 py-4 border-slate-300 bg-blue-100 p-4 hover:bg-blue-200 cursor-pointer" : "notification flex items-center gap-2 py-4 p-4 bg-white"}>
          <img className='size-12 rounded-full object-cover' src={notification.fromUser?.profilePicture ? `${notification.fromUser.profilePicture}` : sample} alt="" />
          <div className="notifcation-content flex flex-col">
            <h1 className='font-poppins text-xs font-bold'>{notification?.message} </h1>
            <p className='text-[10px] opacity-80 font-semibold'>{format(notification?.createdAt)}</p>
          </div>
    </div>
    </div>
  )
}

const Alerts = () => {
  const {url} = useContext(UserContext)
  const token = localStorage.getItem("token")
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchNotifications = async() => {
    try {
      setLoading(true)
      const response = await axios.get(`${url}/api/notification/getNotifications`, {headers: {token}})    
      setNotifications(response.data.notifications.reverse())
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }
  }

  const readNotifications = async () => {
    try {
      const response = await axios.put(`${url}/api/notification/readall`, {}, {headers: {token}})
    } catch (error) {
      console.log(error);
    }
    
  }  
  
  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      readNotifications()
    }, 2000)
  })

  return (
    <div className='w-screen bg-white h-screen'>
      <Navbar/>
      <div className='w-screen flex flex-col justify-center items-center mt-4 max-md:mt-12'>
        <div className="notification-text">
          <h1 className='text-3xl font-poppins font-bold mb-4 max-sm:text-xl'>Notifications</h1>
        </div>
        {
          loading 
          ? 
          <div className='flex items-center justify-center w-full h-full'>
            <ProgressBar borderColor='#1E88E5' barColor='#1E88E5'/> 
          </div>
          :
          <div className='w-full flex justify-center items-center'>
          {
            notifications.length == 0 &&
            <div className='min-w-full min-h-[60vh] flex items-center justify-center'>
              <h1 className='font-semibold text-xl'>You have currently no notification</h1>
            </div>
          }
          <div className='flex flex-col max-md:mx-2 max-md:w-full w-2/4 items-center overflow-hidden drop-shadow-sm rounded-lg'>
          {
            notifications.map((item) => {
              return <NotificationCard notification={item}/>
            })
          }
          </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Alerts