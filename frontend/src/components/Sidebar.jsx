import React, { useContext, useState } from 'react'
import {Link} from 'react-router-dom'
import UserContext from '../context/UserContext'
import sample from '../assets/avatar.jpg'
import peer_icon from '../assets/star-rating.png'
import my_project from '../assets/project.png'
import idea_icon from '../assets/idea.png'
import knowledge_icon from '../assets/books.png'
import industry_icon from '../assets/freelance-work.png'
import showcase_icon from '../assets/backlog.png'

const Sidebar = ({selectedItem, setSelectedItem}) => {
  const {user, url, setUser} = useContext(UserContext)
  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <div className='fixed w-60 py-2 px-3 font-outfit bg-blue-900 h-full text-white mr-10 max-sm:hidden'>
        <ul className='flex flex-col gap-3'>
          {user.role === 'Student' && 
          <Link onClick={() => setSelectedItem('peer')} className={selectedItem==='peer' ? "bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2" : "px-4 py-2 rounded-full flex items-center gap-2"} >
             <img className='w-7 h-7' src={peer_icon} alt="" />
             <li className='text-md'>Peer Review</li>
          </Link>
          }
          {(user.role === 'Student' || user.role === 'Industry Professional') && 
         <Link onClick={() => setSelectedItem('industry-problems')} className={selectedItem==='industry-problems' ? "bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2" : "px-4 py-2 rounded-full flex items-center gap-2"}>
             <img src={industry_icon} alt="" className="w-7 h-7" />
             <li className='text-md'>Industry Problems</li>
         </Link>
         }
         {(user.role === 'Student' || user.role === 'Industry Professional') && 
         <Link onClick={() => setSelectedItem('idea-incubator')} className={selectedItem==='idea-incubator' ? "bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2" : "px-4 py-2 rounded-full flex items-center gap-2"}>
             <img className='w-7 h-7' src={idea_icon} alt="" />
             <li className='text-md'>Idea Incubator</li>
         </Link>
         }
         {user.role === 'Teacher' && 
         <Link onClick={() => setSelectedItem('monitor-projects')} className={selectedItem==='monitor-projects' ? "bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2" : "px-4 py-2 rounded-full flex items-center gap-2"}>
         <i className="fa-solid fa-diagram-project text-xl"></i>
             <li className='text-md'>Monitor Projects</li>
         </Link>
         }
         <Link onClick={() => setSelectedItem('knowledge-hub')} className={selectedItem==='knowledge-hub' ? "bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2" : "px-4 py-2 rounded-full flex items-center gap-2"}> 
             <img src={knowledge_icon} alt="" className="w-7 h-7" />
             <li className='text-md'>Knowledge Hub</li>
         </Link>
         <Link onClick={() => setSelectedItem('showcase-projects')} className={selectedItem==='showcase-projects' ? "bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2" : "px-4 py-2 rounded-full flex items-center gap-2"}>
         <img src={showcase_icon} alt="" className="w-7 h-7" />
             <li className='text-md'>Showcase Projects</li>
         </Link>
         {user.role === 'Student' && 
         <Link onClick={() => setSelectedItem('my-project')} className={selectedItem==='my-project' ? "bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2" : "px-4 py-2 rounded-full flex items-center gap-2"}>
             {/* <i className="fa-solid fa-diagram-project text-xl"></i> */}
             <img className='w-7 h-7' src={my_project} alt="" />
             <li className='text-md'>My Project</li>
         </Link>
         }
        <div className='flex flex-col justify-center items-center gap-3 mt-4'>
        <Link className='flex flex-col items-center' to={`/${user.role.charAt(0).toLowerCase()}/${user.username}/profile`}>
         <img className='w-12 h-12 rounded-full object-cover' src={user.profilePicture ? `${user.profilePicture}` : sample} alt="" />
          <h1 className='font-bold text-md font-outfit'>{user.fullname}</h1>
        </Link>
        <button onClick={handleLogout} className='bg-red-600 text-sm text-white font-semibold w-28 rounded-full p-2'>
          Logout
        </button>
        </div>
        </ul>
    </div>
  )
}



export default Sidebar