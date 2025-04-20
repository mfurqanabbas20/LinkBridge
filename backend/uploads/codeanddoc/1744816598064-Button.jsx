import React from 'react'

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick} className='mt-4 bg-blue-600 rounded-full w-28 h-8 text-white font-semibold'>{text}</button>
  )
}

export default Button