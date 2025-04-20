import React, { useContext, useEffect, useState } from 'react'
import Button from '../components/Button'
import axios from 'axios'
import UserContext from "../context/UserContext"
import Select from 'react-select'
import { ProjectDisplay } from './ActiveProject'
import {ProgressBar} from 'react-loader-spinner'
import { toast } from 'react-toastify'

// project add module completed
const AddProject = () => {
  const {user, url} = useContext(UserContext)
  const [supervisors, setSupervisors] = useState([])
  const [students, setStudents] = useState([])
  const [team, setTeam] = useState([])
  const [selectedSupervisor, setSelectedSupervisor] = useState({})
  const token = localStorage.getItem("token")

  const [data, setData] = useState({
    title: '',
    category: '',
    supervisor: '',
    description: ''
  })
  
  useEffect(() => {
    fetchSupervisors()
    fetchStudents()
  }, [])
  
  const fetchSupervisors = async() => {
    const response = await axios.get(`${url}/api/user/all/supervisors`)
    setSupervisors(response.data.data)
  } 

  const fetchStudents = async () => {
    const response = await axios.get(`${url}/api/user/all/students`)
    setStudents(response.data.data)
  }
  // this is for supervisors

  const handleSupervisors = (e) => {
    const selectedOption = e.target.selectedOptions[0]
    selectedOption ? setSelectedSupervisor(selectedOption.getAttribute("supervisor_id")) : ""
    setData((prev) => {
      return {
        ...prev,
        [e.target.name] : e.target.value
      }
    })
  }

  const handleChange = (e) => {
    setData((prev) => {
      return {
        ...prev,
        [e.target.name] : e.target.value
      }
    })
  }

  // for handling team members
  const handleTeam = (selected) => {
    const select = selected.map(member => member.value)
    setTeam(select)
  }

  const handleSubmit = async () => {    
    const projectData = {
      ...data,
      team
    }

    try {
      const notification = {
        message: `You have got invitation to accept supervision for ${data.title}`,
        notificationType: 'projectRequest'
      }   
      // for sending notification
      await axios.post(`${url}/api/notification/create/${selectedSupervisor}`, notification,  {headers: {token}})      
      // for adding project to queue
      await axios.post(`${url}/api/project/add`, projectData, {headers: {token}})  
      toast.success('Added Successfully', {
        autoClose: 3000,
        position: 'bottom-left'
      })
    } catch (error) {
      console.log(error);
      toast.error('Error Occured', {
        position: 'bottom-left',
        autoClose: 2000
      })
    }
  }
  
  // for team members option
  const options = students.map((item) => {
    return {
      value: item.fullname,
      label: item.fullname
    }
  })

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: '320px',
      backgroundColor: '#f9fafb'
    })
  }
  
  return (
    <div className='py-2'>
    <div className='p-4'>
      <h1 className='text-xl font-bold font-outfit'>Add Project</h1>
      {/* input sections  */}
      <div className='m-4'>
      <div className='wrapping flex gap-8 mb-2'>
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-semibold' htmlFor="title">Title*</label>
          <input className='border w-80 h-9 bg-gray-50 rounded-md outline-offset-2 outline-blue-500 px-2 text-sm' type="text" name='title' onChange={handleChange} />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-semibold' htmlFor="category">Category*</label>
          <select onChange={handleChange} className='border w-80 h-9 bg-gray-50 rounded-md outline-offset-2 outline-blue-500 px-2 text-sm' name="category"> 
            <option disabled selected hidden value="">Select Category</option>  
            <option value="Web Development">Web Development</option>
            <option value="App Development">App Development</option>
            <option value="Artificial Intelligence">Artificial Intelligence </option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Desktop Application">Desktop Application</option>
            <option value="IOT">IOT</option>
            <option value="Data Science">Data Science</option>
          </select>
        </div>
      </div>
        {/* next line input field */}
        <div className="wrapping flex gap-8 mb-2">
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-semibold' htmlFor="supervisor">Supervisor Name*</label>
          <select className='border w-80 h-9 bg-gray-50 rounded-md outline-offset-2 outline-blue-500 px-2 text-sm' onChange={handleSupervisors} name="supervisor">
            <option value="" selected hidden disabled>Select Supervisor</option>
            {supervisors.map((item) => {
              return (user.university === item.university ? <option key={item._id} supervisor_id={item._id} value={item.fullname}>{item.fullname}</option> : null)
            })}
          </select>
         
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-semibold' htmlFor="team">Team Members*</label>
          <Select name='team' isMulti styles={customStyles} options={options} onChange={handleTeam}/>
        </div>
        </div>
        {/* description */}
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-semibold' htmlFor="description">Description*</label>
          <textarea className='border w-96 h-36 bg-gray-50 rounded-md outline-offset-2 outline-blue-500 p-2 text-sm' type="text" name='description' onChange={handleChange} />
        </div>
        {/* button */}
        <Button onClick={handleSubmit} text={'Add'}/>
        </div>
    </div>
    </div>
  )
}

const MyProject = () => {
  const {url, user} = useContext(UserContext)
  const [selectedProject, setSelectedProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("token")
  useEffect(() => {
    fetchProject()
  }, [])
  const fetchProject = async () => {
    try {
      const response = await axios.get(`${url}/api/project/${user._id}`, {headers: {token}})
      setSelectedProject(response.data.project)
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-sm:mt-12'>
    {
      loading ? 
      <div className='flex items-center justify-center'>
        <div className='flex items-center justify-center h-svh'>
          <ProgressBar borderColor='#1E88E5' barColor='#1E88E5'/>
        </div>
      </div> 
      : 
      (
        selectedProject
        ?
        <ProjectDisplay selectedProject={selectedProject}/>
        : 
        <AddProject/>
        )
     
    }
    </div>
  )
}

export default MyProject