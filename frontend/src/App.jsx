import './App.css'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home/Home'
import Student from './pages/Student'
import Professional from './pages/Professional'
import Teacher from './pages/Teacher'
import Signup from './pages/Signup'
import UserDetails from './pages/UserDetails'
import Error from './pages/Error'
import Login from './pages/Login'
import Forgot from './pages/Forgot'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Reset from './pages/Reset'
import UserContext from './context/UserContext'

// sub modules importing
import Profile from './pages/Profile'
import { useEffect, useContext, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import Users from './pages/Users'
import Chat from './pages/Chat'
import Alerts from './pages/Alerts'
import Proposal from './pages/Proposal'
import Connections from './pages/Connections'
import OtherProfile from './pages/OtherProfile'
import CoverLetters from './pages/CoverLetters'
import Payment from './pages/Payment'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Successful from './pages/Successful'
import AcceptedProblem from './pages/AcceptedProblem'
import StripeAccount from './pages/StripeAccount'

function App() {

  const {url, setUser, setConnections} = useContext(UserContext)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("token")
  let decode = ""

  const fetchConnections = async() => {
    try {
      setLoading(true)
      const response = await axios.get(`${url}/api/user/connects/accepted/${decode.id}`, {headers: {token}})    
      setConnections(response.data.connections)
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }
  }

  const fetchUser = async () => {
      try {
        const response = await axios.get(`${url}/api/user/${decode.id}`)
        setUser(response.data.user)
      } catch (error) {
        console.log(error);
      }
      finally {
        setLoading(false)
      }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      await Promise.all([fetchUser(), fetchConnections()])
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if(localStorage.getItem("token")){
      decode = jwtDecode(localStorage.getItem("token"))
      fetchData()
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3000);
  }, [])
  

  return (
    <>
    
    {
      loading 
      ? 
      <div className='w-screen h-screen flex flex-col justify-center items-center'>
        <DotLottieReact
        src="https://lottie.host/7f92d82a-6405-42a9-98e6-76885d8393ef/4MwO6D5Ww4.lottie"
        loop
        autoplay
        />
      </div>
      : 
      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/users' element={<Users/>} />
      <Route path='/student' element={<Student/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/signup/details' element={<UserDetails/>}/>
      <Route path='/login' element={<Login/>} />
      <Route path='/forgot' element={<Forgot/>}/>
      <Route path='/reset/:userid' element={<Reset/>}/>
      <Route path='/s/:username' element={<Student/>}/>
      <Route path='/i/:username' element={<Professional/>}/>
      <Route path='/t/:username' element={<Teacher/>} />
      <Route path='/messages' element={<Chat/>}/>
      <Route path='/notifications' element={<Alerts/>} />
      <Route path='/proposal/:id/apply' element={<Proposal/>} />
      <Route path='/user/connections' element={<Connections/>}/>
      <Route path='/coverletters' element={<CoverLetters/>}/>
      <Route path='/payment/:id' element={<Payment/>} />
      <Route path='/payment/successful/:id/:userId' element={<Successful/>} />
      <Route path='/accepted/:id' element={<AcceptedProblem/>} />
      <Route path='/created-stripe/:id' element={<StripeAccount/>} />
      {/* Sub Modules */}
      <Route path='/:role/:username/profile' element={<Profile/>} />
      <Route path='/user/:id' element={<OtherProfile/>} />

      <Route path='*' element={<Error/>}/>
    </Routes>
    }
    
     <ToastContainer theme="colored"/>
    
    </>
  )
}

export default App
