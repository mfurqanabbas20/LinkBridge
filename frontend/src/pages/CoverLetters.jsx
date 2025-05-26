import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import UserContext from '../context/UserContext'
import { useLocation, useNavigate } from 'react-router-dom'


const CoverLetters = () => {
  const {url} = useContext(UserContext)
  const [coverLetters, setCoverLetters] = useState([])
  const location = useLocation()  
  const navigate = useNavigate()
  
  const fetchProblems = async() => {    
    const response = await axios.get(`${url}/api/industry/${location.state._id}/getCoverLetters`)    
    setCoverLetters(response.data.coverLetter)
  }

  useEffect(() => {
    // this is for fetching problems cover letters
    fetchProblems()
  }, [])
  
  return (
    <div>
        <Navbar/>
        <div className='px-4 py-2'>
          <h1 className='mx-4 my-2 font-outfit text-3xl font-bold text-blue-600'>Cover Letters</h1>
          {
            coverLetters.length < 1 && <div className='p-4'>
            <h1 className='text-lg'>No Cover Letter Available 😐</h1>
            </div>
          }
          {
            coverLetters.map((item) => {
              return (
                <div className='p-4'>
                  <div className='flex gap-4'>
                    <img className='size-28 rounded-full object-cover shrink-0' src={`${item.userId?.profilePicture}`} alt="" />
                    <div>
                      <p className='text-sm font-sans w-1/3 text-justify'>{item.title}</p>
                      <button onClick={() => navigate(`/payment/${location.state._id}`, {state: item})} className='mt-4 bg-blue-600 rounded-full w-28 h-8 text-white text-md font-semibold'>Hire</button>
                    </div>           
                  </div>
                </div>
              )
            })
          }
        </div>
    </div>
  )
}

export default CoverLetters