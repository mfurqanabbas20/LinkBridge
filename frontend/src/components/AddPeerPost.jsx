import React from 'react'
import { useContext, useState } from 'react'
import axios from 'axios'
import UserContext from '../context/UserContext'
import {toast} from 'react-toastify'

const AddPeerPost = () => {
    const {url, user} = useContext(UserContext)
    const [post, setPost] = useState({
      user: user._id,
      description: ''
    })
  
    const [mediafiles, setMediafiles] = useState([])
  
    // handleChange for image uploading
    const handleChange = (e) => {
      const file = Array.from(e.target.files)
      setMediafiles(file)
    }
  
    const handleDescription = (e) => {
      setPost((prev) => {
        return{
          ...prev,
          [e.target.name] : e.target.value
        }
      })
    }
  
    const handleSubmit = async () => {
      try {
      const formData = new FormData()
      formData.append("user", post.user)
      formData.append("description", post.description )
      mediafiles.forEach((file) => {      
      formData.append("media", file)
      })
      
      await axios.post(`${url}/api/post/add`, formData)
      
      toast.success('Post Created', {
        position: 'bottom-left',
        autoClose: 2000
      })

      setPost((prev) => {
        return {
          ...prev,
          description: ''
        }
      })


      } catch (error) {
        console.log(error);
        toast.error('Error Occured', {
          position: 'bottom-left',
          autoClose: 2000
        })
        
      }
      
    }
    
    return(
      <div className='flex flex-col gap-4 p-3 bg-white drop-shadow-sm rounded-lg border max-sm:mt-12 max-sm:mx-2'>
        <div className='flex gap-3'>
          <img className='size-12 rounded-full object-cover max-sm:size-10' src={`${user.profilePicture}`} alt="" />
          <input className='w-full h-12 max-sm:h-10 max-sm:text-xs border px-4 py-2 text-sm outline-blue-500 rounded-full placeholder-slate-700' type="text" value={post.description} onChange={handleDescription} name='description' placeholder='Get feedback from your peers' />
        </div>
        <div className='flex items-center justify-between px-2'>
          <div className='flex items-center gap-2'>
            <label htmlFor="media">
              <p className='text-sm'> <i className="text-blue-500 text-xl fa-solid fa-image"></i> Media</p>
            </label>
            <input multiple accept='image/*' onChange={handleChange} type="file" name='media' id='media' className='hidden' />
          </div>
          <div>
            <button onClick={handleSubmit} className='bg-blue-500 w-32 max-sm:w-24 max-sm:text-sm max-sm:h-7 h-8 text-white rounded-full'>Submit</button>
          </div>
        </div>
      </div>
    )
}
  

export default AddPeerPost