import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import UserContext from '../context/UserContext'
import Navbar from '../components/Navbar'
import cover_pic from '../assets/avatar.jpg'
import sample_profile from '../assets/avatar.jpg'
import {ColorRing} from 'react-loader-spinner'
import { jwtDecode } from 'jwt-decode'
import { ProjectCard } from './Profile'

const OtherProfile = () => {
    const [loading, setLoading] = useState(true)
    const {url, user} = useContext(UserContext)
    const {id} = useParams()
    const [otherUser, setotherUser] = useState([])
    const [isConnected, setIsConnected] = useState(false)
    const [acceptedConnections, setAcceptedConnections] = useState([])
    const [project, setProject] = useState([])
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const params = useParams()
    
    useEffect(() => {
        fetchUser()
        fetchProject()
    }, [])
    
    const fetchConnections = async () => {
      const response = await axios.get(`${url}/api/user/connects/accepted/${params.id}`, {headers: {token}})
      setAcceptedConnections(response.data.connections);
    };

    const handleConnect = () => {

    }

    const handleConversation = async () => {
      try {
        const response = await axios.post(`${url}/api/conversation/new/${otherUser._id}`,{}, {headers: {token}})
        console.log(response);
      } catch (error) {
        console.log(error);
      }
      navigate('/messages')
    }

    const handleDisconnect = () => {

    }

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${url}/api/user/${id}`)
            const acceptedConnection = response.data.user?.connections?.some((item) => {
              return item.user._id === user._id && item.status === 'accepted'
            })          
            setIsConnected(acceptedConnection)  
            setotherUser(response.data.user)
            fetchConnections()
        } catch (error) {
            console.log(error);
        }
        finally{
          setLoading(false)
        }
    }

    const fetchProject = async () => {
      try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${url}/api/project/${params.id}`, {headers: {token}})
      setProject(response.data.project)
      } catch (error) {
        console.log(error);
      }   
  }

    
    
  return (

    <>
    {
        user._id === otherUser._id && navigate(`/${user.role.charAt(0).toLowerCase()}/${user.username}/profile`)
    }
      <Navbar />
       {
        loading 
        ? 
        <ColorRing/>
        :
      <div className="mx-14 my-4">
        <div className="z-0 relative profile-container w-9/12 rounded-xl">
          <div className="cover-photo w-full h-56 relative mb-12 rounded-xl">
            {/* profile cover photo */}
              <img className="w-full h-full rounded-xl object-cover"
                src={
                  otherUser.coverPicture ? `${otherUser.coverPicture}` : cover_pic
                }
                alt=""
              />
            <div className="profile-photo rounded-full w-32 h-32 ml-4 bg-red-950 absolute -bottom-12">
                <img className="w-full h-full rounded-full object-cover"
                  src={otherUser.profilePicture ? `${otherUser.profilePicture}`:sample_profile}
                  alt=""
                />
              
            </div>
          </div>
          <div className="user-info mx-4 mt-16">
            <div className="flex items-center justify-between">
              <h1 className="font-poppins text-xl font-medium">{otherUser.fullname}</h1>
            </div>
            <p>
              {otherUser.description
                ? otherUser.description
                : "Description of user goes here"}
            </p>
            {(otherUser.role === "Student" || otherUser.role === "Teacher") && (
              <p>{otherUser.university}</p>
            )}
            {otherUser.role === "Industry Professional" && (
              <p>Industry{otherUser.industry}</p>
            )}
            <p>{acceptedConnections.length > 0 ? acceptedConnections.length : "0"}{" "}Connections</p>
            <div className='flex gap-2'>
              <button className='mt-4 bg-blue-600 rounded-full w-28 h-8 text-white font-semibold'>{isConnected ? 'Connected' : 'Connect'}</button>
              <button onClick={handleConversation} className='mt-4 bg-white border border-black text-blue-600 rounded-full w-28 h-8 font-semibold'>Message</button>
            </div>
            {user.role === 'Student' &&  
            <div className="fyp-profile my-3">
              <h1 className="text-2xl font-extrabold font-outfit mt-6 uppercase">Final Year Project</h1> 
              {
                Object.keys(project).length !== 0  ? <ProjectCard project={project}/> : "Not added yet!"
              }
              </div>
            }
          </div>
        </div>


      </div>
      }
    </>
  )
}

export default OtherProfile