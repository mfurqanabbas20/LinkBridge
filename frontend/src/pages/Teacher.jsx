import React, { useEffect, useContext, useState } from 'react'
import UserContext from '../context/UserContext'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import KnowledgeHub from '../components/KnowledgeHub'
import Welcome from '../components/Welcome'
import ActiveProject, { ProjectDisplay } from '../components/ActiveProject'
import ShowcaseProjects from '../components/ShowcaseProjects'
const Teacher = () => {
  const {user} = useContext(UserContext)
  const [selectedItem, setSelectedItem] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    document.title = user.fullname + ' | ' + 'LinkBridge'
    if(!localStorage.getItem("token")){
      navigate('/login')
    }
  }, [])

  const RenderComponent = () => {
    switch(selectedItem) {
      case 'knowledge-hub':
        return <KnowledgeHub/>
      case 'showcase-projects':
        return <ShowcaseProjects/>
      case 'monitor-projects':
        return <ActiveProject setSelectedProject={setSelectedProject} setSelectedItem={setSelectedItem}/>
      case 'project-track':
        return <ProjectDisplay selectedProject={selectedProject}/>
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

export default Teacher