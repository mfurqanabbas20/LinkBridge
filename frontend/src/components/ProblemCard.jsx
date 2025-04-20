import React, { useContext } from 'react'
import Button from './Button'
import { useNavigate } from 'react-router-dom'
import UserContext from '../context/UserContext'
import {format} from 'timeago.js'
import check_icon from '../assets/accept.png'

const ProblemCard = ({problem, offer}) => {
  const {user} = useContext(UserContext)
  const navigate = useNavigate()

  const applied = problem.coverLetter.some((item) => {
    return item.userId === user._id
  })

  // const isHire = problem
  
  
  const handleClick = () => {
    navigate(`/proposal/${user._id}/apply`, {state: {problem}})
  }

  return (
    <div className='my-3 border problem-card p-4 w-[75vw] flex flex-col gap-1 rounded-xl shadow-blue-600 shadow-xs max-lg:w-full'>
        <p className='text-xs opacity-80 font-poppins'>Posted {format(problem.createdAt)}</p>
        <h1 className='text-blue-600 font-semibold text-xl hover:underline cursor-pointer font-poppins max-sm:text-lg'>{problem.title}</h1>
        <p className='text-xs opacity-90 font-poppins'>Fixed-price - Est. Budget: ${problem.budget}</p>
        <p style={{fontSize: '14px'}} className='text-md opacity-90 mt-2'>{problem.description}</p>
        <p className='text-xs mt-4 font-poppins opacity-90'>Category: {problem.category}</p>
        <div className='flex justify-between font-poppins'>
        <p className='text-xs opacity-90 pt-1'>Deadline: {problem.deadline}</p>
           {
            applied ? 
            <button disabled className='mt-4 bg-red-500 rounded-full w-36 h-9 text-white font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-1'>
              Applied <img className='w-4 h-4' src={check_icon} alt="" />
            </button>
            :
            <button onClick={handleClick} className='mt-4 bg-green-600 rounded-full w-36 h-9 text-white font-semibold text-sm'>Apply</button>
           }
           
        </div>
    </div>
  )
}

export default ProblemCard