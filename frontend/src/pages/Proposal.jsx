import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useLocation } from 'react-router-dom'
import {format} from 'timeago.js'
import axios from 'axios'
import UserContext from '../context/UserContext'
import {toast} from 'react-toastify'
const Proposal = () => {
  const {url} = useContext(UserContext)
  const token = localStorage.getItem("token")
  const [coverLetter, setCoverLetter] = useState('')
  const location = useLocation()
  const {problem} = location.state

  const handleChange = (e) => {
    setCoverLetter(e.target.value)
  }

  const handleSubmit = async () => {
    try {
      await axios.put(`${url}/api/industry/${problem._id}/addCoverLetter`, {coverLetter}, {headers: {token}})
      toast.success('Proposal Sent', {
        autoClose: '2000',
        position: 'bottom-left'
      })
    } catch (error) {
      console.log(error);
      toast.error('Error Occured', {
        autoClose: '2000',
        position: 'bottom-left'
      })
    }
  }


  return (
    <div>
        <Navbar/>
        {/* proposal page container */}
        <div className='py-2 px-16 font-poppins'>
            <h1 className='text-2xl font-semibold px-8'>Submit a Proposal</h1>
            <div className="problem-detail border my-4 py-4 px-8 flex flex-col gap-2 rounded-xl">
                <h1 className='text-xl font-semibold text-blue-600'>{problem.title}</h1>
                <p className='text-xs opacity-90'>Posted {format(problem.createdAt)} </p>
                <p style={{fontSize: '12px'}} className='text-sm w-3/4'>{problem.description}</p>
                <hr className='my-2' />
                <p className='text-md font-semibold'>Category</p>
                <p className='bg-blue-600 text-white w-44 h-9 text-center rounded-full flex items-center justify-center text-sm'>{problem.category}</p>
            </div>
            {/* cover letter section starts from below*/}
            <div className="cover-letter py-4 px-8 border rounded-lg">
                <h1 className='text-xl font-semibold'>Cover Letter</h1>
                <textarea name="coverLetter" id="coverLetter" value={coverLetter} onChange={handleChange} className='w-full h-48 mt-4 p-4 border-2 outline-none border-blue-400 rounded-lg text-sm' type="text" />
            </div>
            <div className='flex gap-4 px-8 pb-4'>
              <button className='mt-4 bg-blue-600 rounded-full w-28 h-8 text-white text-md font-outfit' onClick={handleSubmit}>Send</button>
              <button className='mt-4 bg-blue-600 rounded-full w-28 h-8 text-white text-md font-outfit' onClick={() => setCoverLetter('')}>Cancel</button>
            </div>
        </div>


    </div>
  )
}

export default Proposal