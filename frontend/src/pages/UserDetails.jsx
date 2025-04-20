import React, { useContext, useEffect } from 'react'
import {useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import university from '../assets/university'
import axios from 'axios'
import UserContext from '../context/UserContext'
import { toast } from 'react-toastify'

const UserDetails = () => {
  const {setUser, url} = useContext(UserContext)
  const navigate = useNavigate()
  const location = useLocation()
  const {signupData, loginData} = location.state
    const [userInfo, setUserInfo] = useState({
        fullname: '',
        role: '',
        university: '',
        industry: ''
    })
    const handleChange = (event) => {
      console.log(event.target.value);
      
      setUserInfo((prevData) => {
        return {
          ...prevData,
          [event.target.name]: event.target.value,
        };
      });
    }

    const handleSubmit = async () => {
        const combinedData = {
          ...signupData,
          ...userInfo
        }
        console.log(combinedData);
        
        try {
          const response = await axios.post(`${url}/api/auth/register`, combinedData)
          setUser(response.data.user)
          localStorage.setItem("token", response.data.token)
          const { role, username } = response.data.user;
          navigate(`/${role.charAt(0).toLowerCase()}/${username}`)
        } catch (error) {
          console.log(error.status);
          if(error.status === 409){
            toast.error('User Already Exists', {
              position: 'bottom-left',
              autoClose: 3500, 
            })
          }
          else {
            toast.error('Error Occured', {
              position: 'bottom-left',
              autoClose: 3500, 
            })
          }
          console.log(error);
        }
    }
    return (
      <div className="flex w-screen h-screen font-poppins">
        <div className="flex flex-col justify-center items-center mx-auto gap-6">
          <h2 className="text-3xl font-medium">Few Steps To Your Professional Life</h2>
          <div className="flex flex-col gap-2">
            <label className='text-sm' htmlFor="email">Full Name</label>
            <input
              className="w-96 border border-s-4 rounded-md h-10 p-3 outline-blue-600 text-sm"
              type="text"
              required
              onChange={handleChange}
              name="fullname"
              placeholder="e.g. My Name"
             />
            <label className='text-sm' htmlFor="email">Your Role</label>
            <select onChange={handleChange} name='role' className='w-96 border border-s-4 rounded-md h-10 px-2 outline-blue-600 text-sm'>
                <option value="">Select Your Role</option>
                <option value="Student">Student</option>
                <option value="Industry Professional">Industry Professional</option>
                <option value="Teacher">Teacher</option>
            </select>
            {userInfo.role === 'Teacher' || userInfo.role === 'Student' ? 
            <>
            <label className='text-sm' htmlFor="university">University Name</label>
            <select onChange={handleChange} name='university' className='w-96 border border-s-4 rounded-md h-10 px-3 outline-blue-600 text-sm'>
                <option className='text-xs' value="">Select Your University</option>
                {
                  university.map((item, index) => {
                    return (
                      <option key={index} className='text-xs' value={item}>{item}</option>
                    )
                  })
                }
            </select>
            </>
            : 
            <>
            <label className='text-sm' htmlFor="industry">Industry Name</label>
            <input
              className="w-96 border border-s-4 rounded-md h-10 p-3 outline-blue-600 text-sm"
              type="text"
              required
              onChange={handleChange}
              name="industry"
              placeholder="e.g. Oracle"
            />
            </>
            }
          </div>
          <button
            className="bg-blue-600 w-40 rounded-full p-2 text-white"
            onClick={handleSubmit}
          >
            Sign up
          </button>
        </div>
      </div>
    )
  }

export default UserDetails