import React, { useContext, useState, useEffect } from 'react'
import Button from './Button'
import ProblemCard from './ProblemCard'
import UserContext from '../context/UserContext'
import axios from 'axios'
import {format} from 'timeago.js'
import { useNavigate } from 'react-router-dom'
import OfferCard from './OfferCard'
import {ProgressBar} from 'react-loader-spinner'
import {toast} from 'react-toastify'
import CompletedCard from './CompletedCard'

const PostedByMe = ({problem}) => {
  const navigate = useNavigate()  
  return(
    <>
    {
      problem.length <= 0 && <div className='flex items-center justify-center mt-32'>
        <h1 className='font-poppins text-2xl font-bold'>No Problems Available 🥺</h1>
      </div>
    }
  {problem.map((item) => {
  return(
    
    <div className='my-3 problem-card p-4 w-[75vw] flex flex-col gap-1 rounded-xl shadow-blue-600 shadow-xs max-lg:w-screen'>
      <p className='text-xs opacity-80 font-poppins'>Posted {format(item.createdAt)}</p>
      <h1 onClick={() => navigate('/coverLetters', {state: item})} className='text-blue-600 font-semibold text-xl hover:underline cursor-pointer font-poppins'>{item.title}</h1>
      <p className='text-xs opacity-90 font-poppins'>Fixed-price - Est. Budget: ${item.budget}</p>
      <p style={{fontSize: '14px'}} className='text-md opacity-90 mt-2'>{item.description}</p>
      <p className='text-xs mt-4 font-poppins opacity-90'>Category: {item.category}</p>
      <div className='flex justify-between font-poppins'>
         <p className='text-xs opacity-90 pt-1'>Deadline: {item.deadline}</p>
         {item.status === 'pending' 
         ? 
         <button onClick={() => navigate('/coverLetters', {state: item})} className='h-10 w-40 bg-blue-600 text-white font-semibold font-outfit rounded-full'>View Proposals</button>
         :
         <button onClick={() => navigate(`/accepted/${item._id}`, {state: item})} className='h-10 w-40 bg-blue-600 text-white font-semibold font-outfit rounded-full'>View Problem</button>
         }
         
      </div>
   </div>
  )
  })}
    </>
  )
}

const AddProblem = () => {
  const {url} = useContext(UserContext)
  const [data, setData] = useState({
    title: '',
    category: '',
    deadline: '',
    budget: '',
    description: ''
  })
  const handleChange = (e) => {
    setData((prev) => {
      return {
        ...prev,
        [e.target.name] : e.target.value
      }
    })
  }
  const token = localStorage.getItem("token")

  const handleSubmit = async () => {
    try {
      await axios.post(`${url}/api/industry/add`,data, {headers: {token}})
      toast.success('Problem Added', {
        position: 'bottom-left',
        autoClose: 2000, 
      })
      setData({
        title: '',
        category: '',
        deadline: '',
        budget: '',
        description: ''
      })
    } catch (error) {
      toast.error('Something went wrong', {
        position: 'bottom-left',
        autoClose: 2000, 
      })
    }
  }

  return(
    <div className=''>
      {/* input sections  */}
      <div className='m-4'>
      <div className='wrapping flex gap-8 mb-2'>
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-semibold' htmlFor="title">Title*</label>
          <input className='border w-80 h-9 bg-gray-50 rounded-md outline-offset-2 outline-blue-500 px-2 text-sm' type="text" name='title' value={data.title} onChange={handleChange} />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-semibold' htmlFor="category">Category*</label>
          <select onChange={handleChange} className='border w-80 h-9 bg-gray-50 rounded-md outline-offset-2 outline-blue-500 px-2 text-sm' value={data.category} name="category"> 
            <option disabled selected hidden value="">Select Category</option>  
            <option value="Web Development">Web Development</option>
            <option value="App Development">App Development</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Desktop Application">Desktop Application</option>
            <option value="Data Strucutres & Algorithms">Data Strucutres & Algorithms</option>
            <option value="Database System">Database System</option>
            <option value="Others">Others</option>
          </select>
        </div>
      </div>
        {/* next line input field */}
        <div className="wrapping flex gap-8 mb-2">
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-semibold' htmlFor="deadline">Deadline*</label>
          <input className='border w-80 h-9 bg-gray-50 rounded-md outline-offset-2 outline-blue-500 px-2 text-sm' type="date" value={data.date} name='deadline' onChange={handleChange} />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-semibold' htmlFor="budget">Budget*</label>
          <input className='border w-80 h-9 bg-gray-50 rounded-md outline-offset-2 outline-blue-500 px-2 text-sm' type="number" name='budget' value={data.budget} onChange={handleChange} />
        </div>
        </div>
        {/* description */}
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-semibold' htmlFor="description">Description*</label>
          <textarea className='border w-96 h-36 bg-gray-50 rounded-md outline-offset-2 outline-blue-500 p-2 text-sm' type="text" name='description' value={data.description} onChange={handleChange} />
        </div>
        {/* button */}
        <Button onClick={handleSubmit} text={'Submit'}/>
        </div>
    </div>
  )

}


const ProfessionalIndustry = ({selectedTab, setselectedTab}) => {
  const {url} = useContext(UserContext)
  const token = localStorage.getItem("token")
  const [loading, setLoading] = useState(true)
  const [problems, setProblems] = useState([])
  const fetchProblems = async () => {
    try {
      const response = await axios.get(`${url}/api/industry/postedByMe`, {headers: {token}})
      setProblems(response.data.problems.reverse())
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchProblems()
  }, [])
  return(
  <> 
  {
    loading 
    ?
    <div className='flex items-center justify-center min-h-96 min-w-full'>
      <ProgressBar borderColor='#1E88E5' barColor='#1E88E5'/>
    </div>
    :
    <>
     <div className="tab flex gap-10 cursor-pointer">
        <h1 className={`${selectedTab === 'posted' ? 'text-md border-b-2 border-blue-600 text-blue-500 font-semibold' : 'text-md'}`} onClick={() => setselectedTab('posted')}>Posted by me</h1>
        <h1 className={`${selectedTab === 'add' ? 'text-md border-b-2 border-blue-600 text-blue-500 font-semibold' : 'text-md'}`} onClick={() => setselectedTab('add')}>Add Problems</h1>
        <hr />
    </div>
    {
      selectedTab === 'posted' 
      ? 
      <PostedByMe problem={problems}/>
      : 
    <AddProblem/>
    }
    </>
  }
   
  </> 
  )
}

const StudentIndustry = () =>{
  const {url} = useContext(UserContext)
  const [problems, setProblems] = useState([])
  const [offers, setOffers] = useState([])
  const [completed, setCompleted] = useState([])
  const [search, setSearch] = useState('')
  const [isOfferTab, setisOfferTab] = useState(false)
  const [selectedTab, setselectedTab] = useState('')
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("token")

  const fetchOffers = async () => {
    const response = await axios.get(`${url}/api/industry/getOffers`, {headers: {token}})
    setOffers(response.data.problems.reverse())
  }
  
  // for api call
  const fetchProblems = async () => {
      try {
        const response = await axios.get(`${url}/api/industry/problems`)
        setProblems(response.data.problems.reverse())
      } catch (error) {
        console.log(error);
      }
      finally {
        setLoading(false)
      }
  }    
  
  const fetchCompleted = async () => {
    try {
      const response = await axios.get(`${url}/api/industry/getCompleted`, {headers: {token}})
      setCompleted(response.data.problems.reverse())
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {    
    fetchProblems()
    fetchOffers()
    fetchCompleted()
  }, [])

  let filteredProblems = []

  return(
  <>
  {
    loading 
    ?
    <div className='flex items-center justify-center min-h-96 min-w-full'>
      <ProgressBar borderColor='#1E88E5' barColor='#1E88E5'/>
    </div>
    :
    <div className='pr-6 py-2 flex flex-col max-sm:pr-0'>
      <div className="flex items-center justify-between pr-5 max-sm:pr-0">
        <input className='m-2 w-80 max-sm:w-64 h-10 border rounded-lg px-3 outline-blue-500 placeholder-slate-800 text-sm' type="text" placeholder='Find problems' onChange={(e) => setSearch(e.target.value)} />
        <div className='flex items-center gap-1 min-[640px]:hidden'>
          <i onClick={() => setselectedTab(selectedTab === 'offers' ? '' : 'offers')} className="fa-solid fa-layer-group text-xl text-green-900"></i>
          <p className='text-md font-poppins'>({offers.length})</p>
        </div>
        <div className='flex items-center gap-8'>
          <h1 disabled={problems.length <= 0} onClick={() => setselectedTab(selectedTab === 'completed' ? '' : 'completed')} className={selectedTab === 'completed' ? "font-poppins text-sm cursor-pointer font-bold max-sm:hidden" : "font-poppins text-sm cursor-pointer max-sm:hidden"}>Completed ({completed.length})</h1>
          <h1 onClick={() => setselectedTab(selectedTab === 'offers' ? '' : 'offers')} className={selectedTab === 'offers' ? "font-poppins text-sm cursor-pointer font-bold max-sm:hidden" : "font-poppins text-sm cursor-pointer max-sm:hidden"}>Active ({offers.filter((item) => !item.isPaymentReceived).length})</h1>
        </div>
      </div>
      {
        selectedTab === 'offers' ? 
        offers.length <= 0 ?
        <div className='flex items-center justify-center mt-32'>
          <h1 className='font-poppins font-bold text-2xl'>No Offer Yet 🥺</h1>
        </div>
        :
        <h1 className='font-outfit text-lg font-bold text-rose-700 pl-2'>You have <span className='text-orange-500'>{offers.filter((item) => !item.isPaymentReceived).length} Active {offers.length > 1 ? "Offers" : "Offer"}</span></h1>
        :
        ""
      }
      {
        selectedTab === 'completed' ? 
        completed.length <= 0 ?
        <div className='flex items-center justify-center mt-32'>
          <h1 className='font-poppins font-bold text-2xl'>No Task Completed Yet 🥺</h1>
        </div>
        :
        <h1 className='font-outfit text-lg font-bold text-rose-700 pl-2'>You have completed total <span className='text-orange-500'>{completed.length} {completed.length > 1 ? "Problems" : "Problem"}</span> 🤩</h1>
        :
        ""
      }
    
      {
      selectedTab === 'offers' ? 
      (
        offers
        .filter((item) => {
        return search.toLowerCase() === '' ? item : 
        item.title.toLowerCase().includes(search)
        })
        .filter((item) => !item.isPaymentReceived)
        .map((item) => {
          return <OfferCard offer problem={item}/>
        })
      )
      :
      selectedTab === 'completed' ?
      (
        completed
        .filter((item) => {
        return search.toLowerCase() === '' ? item : 
        item.title.toLowerCase().includes(search)
        })
        .map((item) => {
          return <CompletedCard offer problem={item}/>
        })
      )
      : (
      <>  
      {filteredProblems = problems
      .filter((item) => {
      return search.toLowerCase() === '' ? item : 
      item.title.toLowerCase().includes(search)
      })
      .filter((item) => !item.isPaymentReceived)
      .map((item) => {
        return <ProblemCard problem={item}/>
      })
      }
      <div className='flex items-center justify-center mt-32'>
        {filteredProblems.length === 0 && <h1 className='font-poppins text-2xl font-bold'>No Problems Available 🥺</h1>} 
      </div>
      </>
      )
      }
      
    </div>
  }
  
  </>
  )
}


const IndustryProblems = () => {
  const [selectedTab, setselectedTab] = useState('posted')
  const {user} = useContext(UserContext)
  return (
    <div className=''>
      {
        user.role === 'Student' ?  <h1 className='text-2xl font-bold font-outfit mt-2 px-2'><span className='text-orange-700'>Turn</span> <span className='text-blue-500'>Your</span> Skills into <span className='text-yellow-600'>Bills</span> 💰</h1> :  <h1 className='text-2xl font-bold font-outfit my-2'><span className='text-orange-700'>Payoff</span> <span className='text-blue-500'>Your</span> Work <span className='text-yellow-600'>Load</span> 👨‍💻</h1>
      }
      {
      user.role === 'Student' 
      ? 
      <StudentIndustry/> 
      :
      <ProfessionalIndustry selectedTab={selectedTab} setselectedTab={setselectedTab}/> 
      }
      
    </div>
  )
}

export default IndustryProblems