import React, { useState } from 'react'
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import IndustryProblems from '../components/IndustryProblems'
import ShowcaseProjects from '../components/ShowcaseProjects'
import Welcome from '../components/Welcome'
import IdeaIncubator from '../components/IdeaIncubator'
import KnowledgeHub from '../components/KnowledgeHub'

const Professional = () => {
  const [selectedItem, setSelectedItem] = useState('')
  const RenderComponent = () => {
    switch(selectedItem) {
      case 'industry-problems':
        return <IndustryProblems/>
      case 'idea-incubator':
        return <IdeaIncubator/>
      case 'knowledge-hub':
        return <KnowledgeHub/>
      case 'showcase-projects':
        return <ShowcaseProjects/>
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

export default Professional