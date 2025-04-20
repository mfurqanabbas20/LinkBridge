import React, { useContext, useEffect } from 'react'
import UserContext from '../context/UserContext'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import card from '../assets/card2.png'
import Navbar from '../components/Navbar'
const Successful = () => {
  const {user, url} = useContext(UserContext)
  const {id, userId} = useParams()

  const acceptOffer = async () => {
    try {
        const response = await axios.put(`${url}/api/industry/${id}/acceptOffer/${userId}`)
        console.log(response); 
      } catch (error) {
        console.log(error);
    }
}


  useEffect(() => {
    acceptOffer()
  }, [])
  
  return (
    <>
    <Navbar/>
      <div className='flex flex-col items-center h-[80vh] w-full mt-10'>
        <img className='w-72' src={card} alt="" />
        <h1 className='font-poppins text-2xl font-semibold'>Payment successfully deducted from your account</h1>
      </div>
    </>
  )
}

export default Successful