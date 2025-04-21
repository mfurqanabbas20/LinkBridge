import React, { useContext, useEffect, useState } from 'react'
import ReactRating from 'react-rating'
import CountUp from 'react-countup'
import UserContext from '../context/UserContext'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {ProgressBar} from 'react-loader-spinner'

const ProjectCard = ({project, token}) => {
  const [rating, setRating] = useState(0)
  const [stars, setStars] = useState(0)
  const {user} = useContext(UserContext)
  const getRating = () => {
    try {
      let count = 0
      const isRated = project.rating.find((item) => {
        return item.ratedBy == user._id
      })
      if(isRated){
        setStars(isRated.count)
      }
      project.rating.map((item) => {
        count = count + item.count
      })
      setRating(count / project.rating.length)
    } catch (error) {
      console.log(error);
    }
  }

  const updateRating = async (value) => {
    const rating = value
    const response = await axios.put(`${url}/api/project/updateRating/${project._id}`,{rating}, {headers: {token}})
    console.log(response.data);
    
  }

 useEffect(() => {
  getRating()
 }, [])

  const {url} = useContext(UserContext)
  const navigate = useNavigate()
  console.log(project);
  const date = new Date(project.createdAt)
  const formatedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  
  return(
    <div className='border w-80 max-sm:w-screen h-auto font-poppins p-3 rounded-xl'>
      <p className='font-outfit text-sm'>{formatedDate}</p>
      <div className='py-2'>
        <div className='my-3'>
          <h1 className='font-bold text-lg text-center'>{project.title}</h1>
          <p className='text-sm text-center'>{project.description}</p>
        </div>
       
        {/* group members */}
        <h1 className=''>Project Members</h1>
        <div className='flex'>
          {/* onclik we refer to that user profile */}
          {project?.members?.map((item) => {
              return (
                <img onClick={() => navigate(`/user/${item._id}`)} className="w-7 h-7 rounded-full object-cover cursor-pointer" src={`${url}/${item.profilePicture}`} alt="" />
              )
            })
          }
        </div>
        <h1 className='mt-2'>Project Supervisor</h1>
        <div>
          <img onClick={() => navigate(`/user/${project.supervisor._id}`)} className="w-7 h-7 cursor-pointer object-cover rounded-full" src={`${url}/${project.supervisor.profilePicture}`} alt="" />
        </div>
        {/* Rating stars */}
        <div className='mt-3'>
          <ReactRating
            initialRating={rating}
            emptySymbol="text-gray-300 fa-solid fa-star"
            fullSymbol="text-yellow-500 fa-solid fa-star"
            onClick={updateRating}
          />
        </div>
      </div>
    </div>
  )
}

const ShowcaseProjects = () => {
  const [projects, setProjects] = useState([])
  const {url} = useContext(UserContext)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("token")

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${url}/api/project/all/projects`)
      setProjects(response.data.projects.reverse())
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <div className='px-2 max-md:mt-12'>
      <h1 className='text-2xl font-bold font-outfit my-2 rounded-lg'>
        <span className='text-blue-700'>Excellent</span>{" "}
        <span className='text-rose-600'>Projects 😎</span>
      </h1>
      <div className='top-bar flex items-center gap-10 font-poppins'>
        <div>
          <h1 className='font-bold'><CountUp end={projects.filter((item) => item.approvalStatus !== 'Pending').length}/></h1>
          <p className='text-sm'>Pending</p>
        </div>
        <div>
          <h1 className='font-bold'><CountUp end={1000}/>+</h1>
          <p className='text-sm'>Upcoming</p>
        </div>
        <div>
          <h1 className='font-bold'><CountUp end={projects.length}/></h1>
          <p className='text-sm'>Total Projects</p>
        </div>
      </div>
      <div className='project-container flex flex-wrap justify-start gap-5 my-3'>
        {
          loading
          ?
          <div className='flex items-center justify-center min-h-96 min-w-full'>
            <ProgressBar borderColor='#1E88E5' barColor='#1E88E5'/>
          </div>
          :
          projects.map((item, index) => {
            return <ProjectCard project={item} key={index} token={token}/>
          })
        }
      </div>
      {/* <Pagination/> */}
    </div>
  )
}

export default ShowcaseProjects