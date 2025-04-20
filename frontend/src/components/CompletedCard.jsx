import React from 'react'
import {format} from 'timeago.js'

const CompletedCard = ({problem, offer}) => {

  return (
    <div className='my-3 border problem-card p-4 w-[75vw] flex flex-col gap-1 rounded-xl shadow-blue-600 shadow-xs max-sm:w-full'>
        <div className='flex items-center justify-between'>
            <p className='text-xs opacity-80 font-poppins'>Posted {format(problem.createdAt)}</p>
            <div className='flex items-center gap-1'>
                <i className="fa-solid fa-circle-check text-green-600"></i>
                <p className='text-xs font-poppins font-medium'>Completed</p>
            </div>
        </div>
        
        <h1 className='text-blue-600 font-semibold text-xl hover:underline cursor-pointer font-poppins max-sm:text-lg'>{problem.title}</h1>
        <p className='text-xs opacity-90 font-poppins'>Fixed-price - Est. Budget: ${problem.budget}</p>
        <p style={{fontSize: '14px'}} className='text-md opacity-90 mt-2'>{problem.description}</p>
        <p className='text-xs mt-4 font-poppins opacity-90'>Category: {problem.category}</p>
        <div className='flex justify-between font-poppins'>
           <p className='text-xs opacity-90 pt-1'>Deadline: {problem.deadline}</p>
           {/* <button onClick={handleClick} className='mt-4 bg-green-600 rounded-full w-36 h-9 text-white font-semibold text-sm'>Open Offer</button> */}
        </div>
    </div>
  )
}

export default CompletedCard