import React, { useContext } from 'react'
import {useState } from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import img from '../assets/img.jpg'
import { toast } from 'react-toastify'
import axios from 'axios'
import UserContext from '../context/UserContext'

const Reset = () => {
  const {url} = useContext(UserContext)
  const {userid} = useParams()
  
  const navigate = useNavigate()
  const [visibility, setVisibility] = useState("password");
  const [passwordText, setPasswordText] = useState("Show");
  const [data, setData] = useState({
    password: '',
    confirmPassword: ''
  })


  const handleChange = (e) => {
    setData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }
  const handleSubmit = async () => {
    console.log(data);
    const response = await axios.put(`${url}/api/auth/reset/${userid}`, data)
    console.log(response);
    navigate('/login')
    
  }
  return (
    <div className="w-screen min-h-screen flex font-poppins">
    {/* forgot left */}
    <div
      style={{ backgroundImage: `url(${img})`, width: "44%" }}
      className="bg-contain min-h-screen"
    >
    </div>
    <div className="flex flex-col justify-center mx-auto gap-6">
    <h2 className="text-2xl font-bold text-blue-600 font-poppins">Reset Password</h2>
      <div className="input-fields flex flex-col gap-4">
        <div className='flex flex-col gap-1'>
          <label className="text-sm" htmlFor="confirmpassword">New Password</label>
          <input
            className="w-96 border border-s-4 rounded-md h-10 p-3 outline-blue-600 text-sm"
            type={visibility}
            required
            onChange={handleChange}
            name="password"
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className="text-sm" htmlFor="confirmpassword">Confirm Password</label>
          <input
            className="w-96 border border-s-4 rounded-md h-10 p-3 outline-blue-600 text-sm"
            type={visibility}
            required
            onChange={handleChange}
            name="confirmPassword"
          />
        </div>
          {/* input field section ends here */}
        </div>
      <button onClick={handleSubmit} className="bg-blue-600 w-48 rounded-full p-2 h-10 text-sm text-white">
        Update Password
      </button>
      <Link to='/login'>
         <p><i className="fa-solid fa-arrow-left text-sm"></i>  Back to Login</p>
      </Link>
    </div>
  </div>
  )
}

export default Reset