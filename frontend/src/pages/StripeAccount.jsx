import React, { useContext, useEffect } from 'react'
import UserContext from '../context/UserContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import card from '../assets/card.jpg'
const StripeAccount = () => {
    const {url} = useContext(UserContext)

    const params = useParams() 
    
    const token = localStorage.getItem("token")
    
    const transferMoney = async() => {
        const response = await axios.post(`${url}/api/industry/payment/transfer-money/${params.id}`,{}, {headers: {token}})   
        console.log(response);      
    }

    const updatePaymentStatus = async () => {
      const response = await axios.post(`${url}/api/industry/payment/approve-receive-payment/${params.id}`)
      console.log(response);
    }
    useEffect(() => {
        transferMoney()
        updatePaymentStatus()
    }, [])
  return (
    <>
    <Navbar/>
    <div className='flex flex-col items-center h-[80vh] w-full'>
      <img className='w-72' src={card} alt="" />
      <h1 className='font-poppins text-2xl font-semibold max-sm:px-4 max-sm:text-xl'>Money has been transfered to your back account</h1>
    </div>
    </>
  )
}

export default StripeAccount