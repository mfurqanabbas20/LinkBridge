import React from 'react'
import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import {DotLottieReact} from '@lottiefiles/dotlottie-react'
import linkbridge_icon from '../assets/linkbridge-blue-logo.png'

const Forgot = () => {

  const [forgotPassword, setForgotPassword] = useState({
    email: ''
  })

  const handleSubmit = async () => { 
    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot', forgotPassword)
      toast.success("Link Sent Successfully", {
        position: 'bottom-left',
        autoClose: 3000, 
    })
    } catch (error) {
      toast.error("Error Occured", {
        position: 'bottom-left',
        autoClose: 3000, 
    })
    } 
  }
  const handleChange = (event) => {
    setForgotPassword((prev) => {
      return {
        ...prev,
        [event.target.name] : event.target.value
      }
    })
  }

  useEffect(() => {
    document.title = 'LinkBridge - Forgot Password'
  }, [])

  return (
    <>
    <div className="logo w-40 min-[640px]:hidden mt-6">
      <img src={linkbridge_icon} alt="" />
    </div>
    <div className="w-screen min-h-screen flex flex-col sm:flex-row font-poppins max-md:my-20">
    <div
     style={{ width: "40%" }}
     className="bg-cover bg-no-repeat min-h-screen hidden md:block"
    >
    <DotLottieReact
      src="https://lottie.host/18b24a4e-0411-4619-abae-77ce3bcd846c/4pRf3eeFRd.lottie"
      loop
      autoplay
    />
    </div>
    <div className="flex flex-col justify-center mx-auto gap-6 px-4 sm:px-0">
     <h2 className="text-2xl font-bold text-blue-600">Forgot Password</h2>
      <div className="input-fields flex flex-col gap-2">
      <label className='text-sm' htmlFor="email">Email address*</label>
        <input
          className="w-full sm:w-96 border border-s-4 rounded-md h-10 p-3 outline-blue-600 text-sm"
          type="email"
          required
          onChange={handleChange}
          name="email"
          placeholder='example123@gmail.com'
        />
      </div>
      <button onClick={handleSubmit} className="bg-blue-600 w-44 rounded-full p-2 text-white">
        Send Reset Link
      </button>
      <Link to='/login'>
         <p className='text-sm'><i className="fa-solid fa-arrow-left text-xs"></i>  Back to Login</p>
      </Link>
    </div>
  </div>
  </>

  )
}

export default Forgot