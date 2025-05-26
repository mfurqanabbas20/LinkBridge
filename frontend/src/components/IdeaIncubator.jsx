import React, {useContext, useEffect, useState} from 'react'
import axios from 'axios'
import { MutatingDots, ProgressBar} from 'react-loader-spinner'
import UserContext from '../context/UserContext'
import ReactRating from 'react-rating'
import Button from './Button'
import {format} from 'timeago.js'
import {toast} from 'react-toastify'
import idea_img from '../assets/bear.png'
// for adding idea

const AddIdea = () => {  
  const {url} = useContext(UserContext)
  const [data, setData] = useState({
    idea: '',
    category: '',
  })

  const handleChange = (e) => {
    setData((prev) => {
      return {
        ...prev,
        [e.target.name] : e.target.value
      }
    })
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem("token")
    try {
      await axios.post(`${url}/api/idea/add`, data, {headers: {token}})
      toast.success('Idea Added', {
        position: 'bottom-left',
        autoClose: 3000, 
      })     
    } catch (error) {
      console.log(error);
      toast.error('Error Occured', {
        position: 'bottom-left',
        autoClose: 3000, 
      })
    }
  }

  return(
    <div className=''>
      {/* input sections  */}
      <div className='m-4 max-sm:w-full'>
      <div className='wrapping flex gap-8 mb-2'>
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-semibold' htmlFor="idea">FYP Idea*</label>
          <input className='border w-80 h-9 bg-gray-50 rounded-md outline-offset-2 outline-blue-500 px-2 text-sm' type="text" name='idea' onChange={handleChange} />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-semibold' htmlFor="category">Category*</label>
          <select onChange={handleChange} className='border w-80 h-9 bg-gray-50 rounded-md outline-offset-2 outline-blue-500 px-2 text-sm' name="category"> 
            <option disabled selected hidden value="">Select Category</option>  
            <option value="Web Development">Web Development</option>
            <option value="App Development">App Development</option>
            <option value="Artificial Intelligence">Artificial Intelligence </option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Desktop Application">Desktop Application</option>
            <option value="Data Strucutres & Algorithms">Data Strucutres & Algorithms</option>
            <option value="Database System">Database System</option>
            <option value="Others">Others</option>
          </select>
        </div>
      </div>
      <Button onClick={handleSubmit} text={'Add Idea'}/>
      </div>
    </div>
  )
}

const PostedByMe = () => {
  const {url} = useContext(UserContext)
  const [ideas, setIdeas] = useState([])
  const token = localStorage.getItem("token")
  const fetchIdeas = async() => {
    const response = await axios.get(`${url}/api/idea/userIdeas`, {headers: {token}})
    setIdeas(response.data.ideas.reverse())
    console.log(response.data);
  }
  useEffect(() => {
    fetchIdeas()
  }, [])
  return(
    <>
    {ideas.map((item) => {
      return(
        <PostedByMeCard idea={item}/>
      )
    })}
    </>
  )

}

const PostedByMeCard = ({idea}) => {
  const [rating, setRating] = useState(0)
  
  const {url, user} = useContext(UserContext)

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/api/idea/delete/${id}`)
      toast.success('Idea Deleted', {
        position: 'bottom-left',
        autoClose: 3000, 
      })
    } catch (error) {
      console.log(error);
      toast.error('Something Wrong', {
        position: 'bottom-left',
        autoClose: 3000, 
      })
    }
  }
  
  const getRating = () => {
    try {
      let count = 0
      idea.rating.map((item) => {
        count = count + item.count
      })
      setRating(count / idea.rating.length)
    } catch (error) {
      console.log(error);
    } 
 }
 useEffect(() => {
  getRating()
 }, [])
 
  return(
    <>
      <div className='w-1/2 border rounded-lg shadow-sm p-4 my-4 max-xl:w-[70vw]'>
        <div className="topbar flex justify-between gap-2">
          <div className='flex items-center gap-2'>
          <img className='w-10 h-10 rounded-full object-cover' src={`${user.profilePicture}`} alt="" />
          <h1 className='text-sm font-semibold'>{user.fullname}</h1>
          <h1 className='text-lg font-bold'>-</h1>
          <p className='text-sm'>{format(idea.createdAt)}</p>
          </div>
          <div className='cursor-pointer' onClick={() => handleDelete(idea._id)}>
            ❌
          </div>
        </div>
        <div className="content my-2">
          <p className='text-sm'>{idea.idea}</p>
        </div>
        <div className='flex gap-4 items-center justify-between'>
        <div className="rating flex items-center gap-1">
          <i className="text-yellow-500 fa-solid fa-star"></i>
          <p className='font-bold text-sm'>{rating ? rating : "0"}</p>
          <p className='text-sm'>({idea.rating.length} Reviews)</p>
          <div className='pl-4'>
          <ReactRating
          initialRating={rating}
          emptySymbol="text-gray-300 fa-solid fa-star"
          fullSymbol="text-yellow-500 fa-solid fa-star"
          />
          </div>
        </div>
        <div>
          
        </div>
        <div className='bg-blue-700 w-36 rounded-full h-8 flex items-center justify-center ml-8'>
          <p className='text-xs text-center text-white font-semibold'>{idea.category}</p>
        </div>
        </div>
      </div>
      
    </>  
    )
}

// this is for industry professionals to see tabs
const Professional = () => {
  const [selectedTab, setselectedTab] = useState('my-idea')
  return(
  <>
    <div className="tab flex gap-10 cursor-pointer">
        <h1 className={`${selectedTab === 'my-idea' ? 'text-md border-b-2 border-blue-600 text-blue-500 font-semibold' : 'text-md'}`} onClick={() => setselectedTab('my-idea')}>My Idea</h1>
        <h1 className={`${selectedTab === 'add-idea' ? 'text-md border-b-2 border-blue-600 text-blue-500 font-semibold' : 'text-md'}`} onClick={() => setselectedTab('add-idea')}>Add Ideas</h1>
        <hr />
    </div>
    {
      selectedTab === 'my-idea' ? <PostedByMe/> : <AddIdea/>
    }
  </>
  )
}


// this is for single industry idea post

const IndustryIdeaPost = ({idea}) => {
  const {url, user} = useContext(UserContext)
  const token = localStorage.getItem("token")
  const [rating, setRating] = useState(0)
  const [stars, setStars] = useState(0)

  const updateRating = async(value) => {
    // api for making request to update Rating 
    const rating = value
    await axios.put(`${url}/api/idea/updateRating/${idea._id}`,{rating}, {headers: {token}})
  }
  const getRating = () => {
    try {
      let count = 0
      const isRated = idea.rating.find((item) => {
        return item.ratedBy == user._id
      })
      if(isRated){
        setStars(isRated.count)
      }
      idea.rating.map((item) => {
        count = count + item.count
      })
      setRating(count / idea.rating.length)
    } catch (error) {
      console.log(error);
    }

    
  }

 useEffect(() => {
  getRating()
 }, [])
  return(
      <div className='w-1/2 border rounded-lg shadow-sm p-4 my-2 max-sm:w-full max-sm:p-2'>
      <div className="topbar flex items-center gap-2">
        <img className='w-12 h-12 rounded-full object-cover' src={`${idea?.createdBy?.profilePicture}`} alt="" />
        <h1>{idea?.createdBy?.fullname}</h1>
        <h1 className='text-lg font-bold'>-</h1>
        <p className='text-sm'>{format(idea.createdAt)}</p>
      </div>
      <div className="content my-2">
        <p className='text-sm'>{idea.idea}</p>     
      </div>
      <div className='flex gap-4 items-center justify-around'>
      <div className="rating flex items-center gap-1">
        <i className="text-yellow-500 fa-solid fa-star"></i>
        <p className='font-bold text-sm max-sm:text-xs'>{rating ? rating : "0"}</p>
        <p className='text-sm max-sm:text-xs'>({idea.rating.length} Reviews)</p>
      </div>
      <div>
        <ReactRating
        initialRating={stars}
        emptySymbol="text-gray-300 fa-solid fa-star"
        fullSymbol="text-yellow-500 fa-solid fa-star"
        onClick={updateRating}
        className='max-sm:text-xs'
        />
      </div>
      <div className='bg-blue-700 w-36 rounded-full h-8 flex items-center justify-center ml-8'>
        <p className='text-xs text-center text-white font-semibold'>{idea.category}</p>
      </div>
      </div>
    </div>
  )
}

// this is to show students a list of ideas posted by industry professionals
// this is industry ideas tab
const IndustryIdeas = () => {
  const {user, url} = useContext(UserContext)
  const categories = ['All', 'Web Development', 'App Development', 'Artificial Intelligence', 'Machine Learning', 'IOT']
  const [selectedCategory, setselectedCategory] = useState('All')
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchIdeas = async () => {
    try {
      const response = await axios.get(`${url}/api/idea/allIdeas`)
      setIdeas(response.data.ideas.reverse())
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIdeas()
  }, [])

  return(
    <div className='mt-2'>
      {
        loading
        ?
        <div className='flex items-center justify-center h-[70vh]'>
        <ProgressBar borderColor='#1E88E5' barColor='#1E88E5'/>
        </div>
        :
        <>
        <div className="category flex items-center justify-evenly gap-2 my-4">
        {categories.map((item) => {
          return (
              <h1 onClick={() => setselectedCategory(item)} className={selectedCategory === item ? "max-sm:hidden border-b-2 w-40 h-8 font-bold font-outfit border-blue-500 bg-blue-100 flex justify-center items-center text-center p-3 text-sm cursor-pointer transition-transform" : "max-sm:hidden w-40 h-8 flex justify-center items-center text-center p-3 text-sm cursor-pointer transition hover:bg-blue-100"}>{item}</h1>
          )
        })}
      </div>
      {
        ideas
        .filter((item) => {
          return selectedCategory === 'All' ? item : item.category === selectedCategory
        })
        .map((item) => {
          return <IndustryIdeaPost idea={item}/>
        })
      }
      </>
      
  }
    </div>
  )
}

// this is for showing tabs to students

const StudentIdea = () => {
  const [selectedTab, setselectedTab] = useState('ai')

  return(
    <>
    <div className="tab flex justify-between items-center cursor-pointer">
      <div className='flex gap-10 cursor-pointer'>
        <h1 className={`${selectedTab === 'ai' ? 'text-md border-b-2 border-blue-600 text-blue-500 font-semibold' : 'text-md'}`} onClick={() => setselectedTab('ai')}>AI Ideas</h1>
        <h1 className={`${selectedTab === 'industry' ? 'text-md border-b-2 border-blue-600 text-blue-500 font-semibold' : 'text-md'}`} onClick={() => setselectedTab('industry')}>Industry Ideas</h1>
        <hr />
      </div>
    </div>
    {
        selectedTab === 'ai' 
        ? 
        <AiIdea/>
        :
        <IndustryIdeas/>
    }
    </>
  )
}


// this is for ai idea 


const AiIdea = () => {
  const Key = import.meta.env.VITE_AI_KEY
  const [ideaInput, setideaInput] = useState('')
  const [idea, setIdea] = useState('')
  const [loading, setLoading] = useState(false)
  const [showImg, setShowImg] = useState(true)
  const handleClick = async () => {
    setShowImg(false) 
    setLoading(true)
    try {
    const response = await axios.post('https://api.cohere.ai/generate', {
        model: "command-light",
        prompt: `${ideaInput}`,
        maxToken: 300
    },
    {
    headers: {
        'Authorization': `Bearer ${Key}`,
        'Content-Type': 'application/json'
    }
    })
    
    setIdea(response.data.text)
    }
    catch (error) {
      console.log(error);   
    }
    finally {
      setLoading(false)
      // formatText()
    }
  }

  
  return(
    <div className='my-4 flex flex-col items-center justify-center'>
      <div className='flex items-center relative'>
        <input onChange={(e) => setideaInput(e.target.value)} className='w-96 h-10 p-2 bg-white border border-gray-300 rounded-md text-sm  outline-blue-500 placeholder-slate-800' type="text" placeholder='Enter about yourself to find FYP ideas' />
        <i onClick={handleClick} className="fa-solid fa-magnifying-glass absolute right-3"></i>
      </div>
      {
        showImg ? 
        <div className='img-idea flex items-center justify-center'>
        <img className='w-1/2 h-1/2 mt-2' src={idea_img} alt="" />
      </div>
      : 
      ""
      }
      
      <div className='py-8'>
      {
        loading ? <MutatingDots/> : 
        (
        <div className='px-16 text-justify text-md opacity-80'>
          <p style={{whiteSpace: 'pre-line'}} className=''>
          {idea}
          </p>
        </div>
        )
      }
      </div>
    </div>
  )
}

// this is main module

const IdeaIncubator = () => {
  const {user} = useContext(UserContext)

  return (
    <div className='px-2 max-md:mt-12'>
      <h1 className='text-2xl font-bold my-2 font-outfit'><span className='text-orange-700'>Build</span> <span className='text-blue-500'>Unique</span> FYP! 🎓</h1>
      {
        user.role === 'Student' 
        ? 
        <StudentIdea/>
        :
        <Professional/>
      }
      
    </div>
  )
}

export default IdeaIncubator