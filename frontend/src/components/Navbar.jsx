import React, { useContext, useState, useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import UserContext from '../context/UserContext'
import sample from '../assets/avatar.jpg'
import email from '../assets/email.png'
import bell from '../assets/bell.png'
import home from '../assets/home-button.png'
import linkbridge from '../assets/linkbridge-logo.png'
import bluelinkbridge from '../assets/linkbridge-blue-logo.png'
import peer_icon from '../assets/star-rating.png'
import my_project from '../assets/project.png'
import idea_icon from '../assets/idea.png'
import knowledge_icon from '../assets/books.png'
import industry_icon from '../assets/freelance-work.png'
import showcase_icon from '../assets/backlog.png'
import purple_gradient from '../assets/purple_gradient.avif'
import axios from 'axios'

const Navbar = ({main, isChat, selectedItem, setSelectedItem}) => {
  const [search, setSearch] = useState('')
  const {user, url, setUser, setUnreadNotifications, unreadNotifications, unreadMessages, setUnreadMessages} = useContext(UserContext)
  const navigate = useNavigate()
  const [isHamMenu, setIsHamMenu] = useState(false)
  const [isLogoMenu, setIsLogoMenu] = useState(false)
  const token = localStorage.getItem("token")
  const [loading, setLoading] = useState(false)

  const searchUser = async () => {
    navigate(`/users?search=${search}`)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    window.location.href = '/login'
  }

  const fetchNotifications = async() => {
    const response = await axios.get(`${url}/api/notification/getNotifications`, {headers: {token}})          
    setUnreadNotifications(response.data.notifications.filter((item) => item.status === 'unread').length)
  }

  const fetchMessages = async () => {
    const response = await axios.get(`${url}/api/message/all/unread-messages`, {headers: {token}})
    setUnreadMessages(response.data.messages.length)
  }

  useEffect(() => {
    try {
      setLoading(true)
      fetchNotifications()
      fetchMessages()
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }
  }, [])
  
  return (
    <div className=''>
    {
      isLogoMenu && window.location.href.includes(user.username)
      ?
      <div className='flex flex-col h-screen w-9/12 shadow-xl bg-white lg:hidden'>
        <div style={{backgroundImage: `url(${purple_gradient})`}} className='relative bg-cover h-1/5 flex flex-col justify-end pb-4 pl-4'>
          <div onClick={() => setIsLogoMenu(false)} className='absolute right-3 top-3'>
            <i className="fa-solid fa-xmark text-white text-xl"></i>
          </div>
          <img className='size-16 rounded-full' src={`${url}/${user.profilePicture}`} alt="" />
          <h1 className='font-outfit text-white font-semibold text-md'>{user.fullname}</h1>
          <h1 className='font-outfit text-sm text-white'>{user.connections.length} {user.connections.length > 1 ? "Connections" : "Connection"}</h1>
        </div>
        <div className='options h-3/4 flex flex-col justify-between mt-2 mb-6'>
          <div className='w-full py-2 px-0 font-outfit h-full text-black mr-10'>
              <ul className='flex flex-col gap-4 px-2'>
               {user.role === 'Student' && 
                <Link onClick={() => setSelectedItem('peer')} className={selectedItem==='peer' ? "bg-purple-600 text-white px-4 py-3 rounded-lg flex items-center gap-2" : "px-4 py-2 flex items-center gap-2"} >
                  <img className='w-7 h-7' src={peer_icon} alt="" />
                  <li className='text-md'>Peer Review</li>
                </Link>
                }
                {(user.role === 'Student' || user.role === 'Industry Professional') && 
                <Link onClick={() => setSelectedItem('industry-problems')} className={selectedItem==='industry-problems' ? "bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2" : "px-4 py-2 rounded-full flex items-center gap-2"}>
                  <img src={industry_icon} alt="" className="w-7 h-7" />
                  <li className='text-md'>Industry Problems</li>
                </Link>
                }
                {(user.role === 'Student' || user.role === 'Industry Professional') && 
                <Link onClick={() => setSelectedItem('idea-incubator')} className={selectedItem==='idea-incubator' ? "bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2" : "px-4 py-2 rounded-full flex items-center gap-2"}>
                  <img className='w-7 h-7' src={idea_icon} alt="" />
                  <li className='text-md'>Idea Incubator</li>
                </Link>
                }
                <Link onClick={() => setSelectedItem('knowledge-hub')} className={selectedItem==='knowledge-hub' ? "bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2" : "px-4 py-2 rounded-full flex items-center gap-2"}> 
                  <img src={knowledge_icon} alt="" className="w-7 h-7" />
                  <li className='text-md'>Knowledge Hub</li>
                </Link>
                <Link onClick={() => setSelectedItem('showcase-projects')} className={selectedItem==='showcase-projects' ? "bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2" : "px-4 py-2 rounded-full flex items-center gap-2"}>
                  <img src={showcase_icon} alt="" className="w-7 h-7" />
                  <li className='text-md'>Showcase Projects</li>
                </Link>
                {user.role === 'Teacher' && 
                <Link onClick={() => setSelectedItem('monitor-projects')} className={selectedItem==='monitor-projects' ? "bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2" : "px-4 py-2 rounded-full flex items-center gap-2"}>
                  <i className="fa-solid fa-diagram-project text-xl"></i>
                  <li className='text-md'>Monitor Projects</li>
                </Link>
                }
                {user.role === 'Student' && 
                <Link onClick={() => setSelectedItem('my-project')} className={selectedItem==='my-project' ? "bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2" : "px-4 py-2 rounded-full flex items-center gap-2"}>
                  <img className='w-7 h-7' src={my_project} alt="" />
                  <li className='text-md'>My Project</li>
                </Link>
                }
            </ul>
          </div>
          <div className='px-6 flex flex-col gap-6'>
            <hr className='border-t-2' />
            <div className='flex items-center gap-2'>
              <i className="fa-solid fa-arrow-right-from-bracket text-lg"></i>
              <h1 onClick={handleLogout} className='font-poppins text-lg font-medium'>Sign Out</h1>
            </div>
          </div>
        </div>
      </div>
      :
      ""
    }
    {
      isHamMenu && window.location.href.includes(user.username)
      ?
      <div className='flex flex-col justify-between h-screen w-9/12 shadow-xl bg-white fixed right-0 top-0 z-50 lg:hidden'>
        <div onClick={() => setIsHamMenu(false)} className='absolute right-3 top-3'>
          <i className="fa-solid fa-xmark text-black text-xl"></i>
        </div>
        <div className='mt-20 px-3'>
          <div className='relative flex items-center'>
            <input onChange={(e) => setSearch(e.target.value)} className='px-8 py-2 w-full h-10 border rounded-md text-sm outline-blue-600 caret-slate-500 placeholder-slate-800 max-sm:h-9' type="text" name='search' placeholder='Search Users' />
            <i onClick={searchUser} className="fa-solid fa-magnifying-glass absolute left-2 text-sm"></i>
          </div>
        <div className='bars mt-8 font-outfit'>
          <ul className='flex flex-col gap-2'>
            <Link to={`/${user.role.charAt(0).toLowerCase()}/${user.username}`} className='flex items-center gap-2 hover:bg-blue-100 p-3 rounded-lg'>
              <img className='w-8 h-8 hover:scale-105' src={home} alt="" />
              <li className='text-lg'>Home</li>
            </Link>
            <Link to='/notifications' className='flex items-center gap-2 hover:bg-blue-100 p-3 rounded-lg'> 
              <img className='w-8 h-8 hover:scale-105' src={bell} alt="" />
              <li className='text-lg'>Notifications</li>
            </Link>
            <Link to='/messages' className='flex items-center gap-2 hover:bg-blue-100 p-3 rounded-lg'> 
              <img className='w-8 h-8 hover:scale-105' src={email} alt="" />
              <li className='text-lg'>Messages</li>
            </Link>
          </ul>
        </div>
        </div>
        <div className='bottom-section mb-4 px-2 flex flex-col gap-10'> 
          <hr className='border border-gray-300' />
          <div className='flex gap-3'>
          <img className='size-20 rounded-full' src={`${url}/${user.profilePicture}`} alt="" />
          <div className=''>
            <h1 className='font-poppins text-[15px]'>{user.fullname}</h1>
            <button onClick={handleLogout} className='mt-2 w-32 h-10 font-poppins bg-red-600 text-white p-2 text-md rounded-lg'>Logout</button>
          </div>
          </div>
        </div>
      </div>
      :
      ""
      }
    <div className={isLogoMenu && !window.location.href.includes(user.username) ? "z-20 fixed w-full h-16 flex bg-white items-center justify-between max-sm:h-20 md:pr-10" : 'z-20 fixed w-full h-16 flex bg-white items-center justify-between max-sm:h-20 md:pr-10'}>
      <div className='flex items-center gap-6 max-sm:gap-2 max-sm:justify-between'>
      <div className={main ? "flex justify-center w-60 h-16 bg-blue-900 text-white max-sm:w-36 max-lg:bg-white" : "flex gap-6 items-center justify-center w-60 h-16 text-blue-600"}>
        <img onClick={() => setIsLogoMenu(!isLogoMenu)} className='w-48 h-16 object-cover lg:hidden' src={bluelinkbridge} alt="" />
        <Link to={`/${user.role.charAt(0).toLowerCase()}/${user.username}`}>
          <img className='w-40 h-14 object-cover max-sm:w-40 max-sm:h-16 max-md:hidden' src={main ? linkbridge : bluelinkbridge} alt="" />
        </Link>
      </div>
      <div className='flex items-center relative'>
        <input onChange={(e) => setSearch(e.target.value)} className='bg-white px-3 py-2 w-80 h-10 border border-gray-300 rounded-md text-sm  outline-blue-600 caret-slate-500 placeholder-slate-800 max-sm:w-48 max-sm:h-9 max-md:hidden' type="text" name='search' placeholder='Search' />
        <i onClick={searchUser} className="fa-solid fa-magnifying-glass absolute right-3 max-sm:text-sm max-md:hidden"></i>
      </div>
      </div>
      <div className="icons flex gap-10 max-md:hidden max-sm:gap-4">
        <div className='max-sm:px-2'>
          <Link  className='flex flex-col items-center justify-center' to={`/${user.role.charAt(0).toLowerCase()}/${user.username}`}>
             <img className='w-8 h-8 hover:scale-105' src={home} alt="" />
          </Link>
        </div>
        <div className='relative'>
        {
            !loading && unreadMessages > 0 
            ?
            <div className='z-10 absolute -right-3 -top-2 badge bg-red-600 size-5 rounded-full flex items-center justify-center text-white text-xs font-bold'>
              <p>{unreadMessages}</p>
            </div>
            :
            ""
          }
          <Link className='flex flex-col items-center justify-center' to='/messages'>
             <img className='w-8 h-8 hover:scale-105' src={email} alt="" />
          </Link>
        </div>
        <div className='relative badge-notifications'>
          {
            unreadNotifications > 0 
            ?
            <div className='z-10 absolute -right-1 -top-2 badge bg-red-600 size-5 rounded-full flex items-center justify-center text-white text-xs font-bold'>
              <p>{unreadNotifications}</p>
            </div>
            :
            ""
          }
          <Link className='flex flex-col items-center justify-center' to='/notifications'>
            <img className='w-8 h-8 hover:scale-105' src={bell} alt="" />
            {/* badge */}
          </Link>
        </div>
        <div className="profile-pic text-center max-md:hidden">
          <Link to={`/${user.role.charAt(0).toLowerCase()}/${user.username}/profile`} className='flex flex-col items-center justify-center'>
           <img className='w-8 h-8 rounded-full object-cover hover:scale-105' src={user.profilePicture ? `${url}/${user.profilePicture}` : sample} alt="" />
           {/* <p className='text-xs'>Profile</p> */}
          </Link>
        </div>
        <div className='min-[640px]:hidden'>
          <p>Hi</p>
        </div>
      </div>
      <div className='hamburger sm:hidden max-sm:pr-5'>
        <i onClick={() => setIsHamMenu(!isHamMenu)} className={isHamMenu && window.location.href.includes(user.username) ? "hidden" : "fa-solid fa-bars"}></i>
      </div>
    </div>
    
    
    {/* this is just a spacer */}
    <div className="h-16 max-sm:h-9"></div>
    </div>
  )
}


export default Navbar




