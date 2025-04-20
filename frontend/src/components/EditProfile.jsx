import React, { useContext, useState } from 'react'
import UserContext from '../context/UserContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const EditProfile = ({showEditProfile, setShowEditProfile}) => {
  const {user, url, setUser} = useContext(UserContext)
  const token = localStorage.getItem('token')
  const [userData, setUserData] = useState({
    username: user.username,
    fullname: user.fullname,
    email: user.email,
    role: user.role,
    description: user.description,
    university: user.university,
    industry: user.industry
  })

  const handleChange = (e) => {
    setUserData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }
  const handleSubmit = async () => {
    // calling backend api
    console.log(`${url}/api/user/${user._id}`);
    try {
      const response = await axios.put(`${url}/api/user/${user._id}`, userData, {headers: {token}})
      toast.success('Profile Updated', {
        position: 'bottom-left',
        autoClose: 2000
      })
      setUser(response.data.user)
      setShowEditProfile(!showEditProfile)

    } catch (error) {
      console.log(error);
      toast.error('Something went wrong', {
        position: 'bottom-left',
        autoClose: 2000
      })
    }
    
  }
  return (
    <div className='bg-white fixed z-10 p-8 h-auto w-auto rounded-2xl shadow-xl'>
    <div className='flex items-center justify-between'>
      <h1 className=' text-xl font-bold'>Edit Profile</h1>
      <i onClick={() => setShowEditProfile(!showEditProfile)} className="fa-solid fa-xmark text-xl cursor-pointer"></i>
    </div>
    <div className='flex justify-center gap-8 my-2'>
      <div className='flex flex-col gap-1'>
        <label className='' htmlFor="username">User Name</label>
        <input className='w-80 h-9 p-2 border rounded-md outline-blue-500' value={userData.username} name='username' type="text" onChange={handleChange} />
      </div>
      <div className='flex flex-col gap-1'>
        <label className='' htmlFor="fullname">Full Name</label>
        <input className='w-80 h-9 p-2 border rounded-md outline-blue-500' value={userData.fullname} name='fullname' type="text" onChange={handleChange} />
      </div>
    </div>
    <div className='flex justify-center gap-8 my-2'>
      <div className='flex flex-col gap-1'>
        <label className='' htmlFor="email">Email Address</label>
        <input className='w-80 h-9 p-2 border rounded-md outline-blue-500' value={userData.email} name='email' type="text" onChange={handleChange} />
      </div>
      <div className='flex flex-col gap-1'>
        <label className='' htmlFor="password">
          {user.role === 'Industry' ? 'Industry' : 'University'}
        </label>
        <input className='w-80 h-9 p-2 border rounded-md outline-blue-500' value={user.role === 'Industry' ? userData.industry : userData.university} name={user.role === 'Industry' ? 'industry' : 'university'} type="text" onChange={handleChange} />
      </div>
    </div>
    <div className='flex justify-center gap-8 my-2'>
      <div className='flex flex-col gap-1'>
        <label className='' htmlFor="description">Description</label>
        <textarea style={{width: '680px'}} className='p-2 h-20 border rounded-md outline-blue-500' name='description' value={userData.description} type="text" onChange={handleChange} />
      </div>
    </div>
    <button onClick={handleSubmit} className='bg-blue-500 text-white font-semibold w-36 rounded-full p-2 mt-2'>Update</button>
      
    </div>
  )
}

export default EditProfile