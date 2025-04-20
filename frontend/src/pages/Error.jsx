import React from 'react'

const Error = () => {
  return (
    <div className='w-screen h-screen flex flex-col gap-4 justify-center items-center'>
      <h1 className='text-6xl font-bold'>🫥</h1>
      <h1 className='text-4xl font-bold text-red-500'>Oops! Page Not Found</h1>
      <img src="/assets/" alt="" />
    </div>
  )
}

export default Error