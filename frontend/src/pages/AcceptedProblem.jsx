import React, { useContext, useState } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { format } from 'timeago.js';
import axios from 'axios';
import UserContext from '../context/UserContext';
import { ProgressBar } from 'react-loader-spinner';
import { toast } from 'react-toastify'

const AcceptedProblem = () => {
    const {url, user} = useContext(UserContext)
    const [accountLink, setAccountLink] = useState(null)
    const [linkLoading, setLinkLoading] = useState(false)
    const location = useLocation()
    const params = useParams()
    const id = params.id    
    const item = location.state
    const problem = item
    const navigate = useNavigate()

    const token = localStorage.getItem("token")
    
    const handleSubmit = async () => {
      try {
        const response = await axios.put(`${url}/api/industry/payment/approve-payment/${problem._id}`, {}, {headers: {token}})
        toast.success('Payment Approved', {
          autoClose: '2000',
          position: 'bottom-left'
        })
      } catch (error) {
        toast.error('Error Occured', {
          autoClose: '2000',
          position: 'bottom-left'
        })
      }
      console.log(response);
    }

    const handleLink = async () => {
      try {
        setLinkLoading(true)
        const response = await axios.post(`${url}/api/industry/payment/create-account/${problem._id}`, {email: problem.assignedTo.email}, {headers: {token}})
        console.log(response);
        if(response.data.message == 'Account Existed'){
          return navigate(`/created-stripe/${problem._id}`)
        }
        setAccountLink(response.data.accountLink?.url)
      } catch (error) {
        console.log(error);
      }
      finally{
        setLinkLoading(false)
      }
      
    }
    
  return (
    <div>
        <Navbar/>
        <div className=' px-16 font-poppins'>
            <div className="problem-detail border my-4 py-4 px-8 flex flex-col gap-2 rounded-xl">
                <h1 className='text-xl font-semibold'>Problem details</h1>
                <h1 className='text-lg font-semibold text-blue-600'>{problem.title}</h1>
                <p className='text-xs opacity-90'>Posted {format(problem.createdAt)} </p>
                <p style={{fontSize: '13px'}} className='text-md w-3/4'>{problem.description}</p>
                <hr className='my-2' />
                <div className='flex flex-col gap-2 w-5/12'>
                <h1 className='text-xl font-semibold'>Accepted By</h1>
                <div className='flex flex-col items-center gap-1 my-2'>
                  <img className='w-28 h-28 object-cover rounded-full' src={`${url}/${problem.assignedTo.profilePicture}`} alt="" />
                  <h1 className='font-poppins text-lg font-semibold'>{problem.assignedTo.fullname}</h1>  
                </div>
                {
                  user.role === 'Student'
                  ?
                  (
                  problem.isPaymentApproved
                  ?
                  <>
                  <p className='text-xs font-poppins text-center'>Your Payment has been approved</p>
                  <p onClick={handleLink} className='text-xs font-poppins text-center cursor-pointer font-semibold'>Go to Link</p>
                  <div className='flex items-center justify-center'>
                  {linkLoading ? <ProgressBar borderColor='#1E88E5' barColor='#1E88E5'/> : ""}
                  </div>
                  {accountLink ? <a href={accountLink} target='_blank' className='text-xs font-poppins text-center cursor-pointer hover:underline'>{accountLink}</a> : ""}
                  </>
                  :
                  <p className='text-xs font-poppins'>Note: You will recieve your money when your client approves your work</p>
                  )
                  :
                  ""
                }
                {
                  user.role === 'Industry Professional'
                  ?
                  (           
                  problem.isPaymentApproved
                  ?
                  <button disabled className='mt-4 bg-blue-600 rounded-full w-44 h-10 text-white font-[600] text-sm'>Payment Approved</button>
                  :
                  <button onClick={handleSubmit} className='mt-4 bg-blue-600 rounded-full w-44 h-10 text-sm text-white font-[600]'>Approve Payment</button>
                  )
                  :
                  ""
                }
                
                </div>
        
            </div>

        </div>
    </div>
  )
}

export default AcceptedProblem