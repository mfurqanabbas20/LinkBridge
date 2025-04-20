import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'
import {format} from 'timeago.js'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import Peer from '../components/Peer'
import IndustryProblems from '../components/IndustryProblems'
import ShowcaseProjects from '../components/ShowcaseProjects'
import Welcome from '../components/Welcome'
import IdeaIncubator from '../components/IdeaIncubator'
import KnowledgeHub from '../components/KnowledgeHub'
import MyProject from '../components/MyProject'

const Student = () => {
  const navigate = useNavigate()
  const [selectedItem, setSelectedItem] = useState('')

  const {user} = useContext(UserContext)

  useEffect(() => {
    document.title = user.fullname + ' | ' + 'LinkBridge'
    if(!localStorage.getItem("token")){
      navigate('/login')
    }
  }, [])

  const RenderComponent = () => {
    switch(selectedItem) {
      case 'peer':
        return <Peer/>
      case 'industry-problems':
        return <IndustryProblems/>
      case 'idea-incubator':
        return <IdeaIncubator/>
      case 'knowledge-hub':
        return <KnowledgeHub/>
      case 'showcase-projects':
        return <ShowcaseProjects/>
      case 'my-project':
        return <MyProject/>
      default:
        return <Welcome/>
    }
  }
  
  return (
    <div className='w-full'>
      <div className='z-10 max-sm:absolute max-sm:w-full'>
        <Navbar selectedItem={selectedItem} setSelectedItem={setSelectedItem} main/>
      </div>
      <div className="flex">
        <div className="w-1/5 max-lg:hidden">
          <Sidebar selectedItem={selectedItem} setSelectedItem = {setSelectedItem}/>
        </div>
        <div className="w-4/5 max-lg:w-full lg:pl-10 xl:pl-0 z-0 max-md:mt-10 max-sm:relative">
          <RenderComponent/>
        </div>
      </div>
    </div>
  )
}

export default Student