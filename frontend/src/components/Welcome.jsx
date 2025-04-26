import React, { useContext, useEffect } from 'react'
import UserContext from '../context/UserContext'
import 'react-clock/dist/Clock.css';
import aos from 'aos'
import 'aos/dist/aos.css'

const WelcomeTime = () => {
  return(
    <div className='w-2/5 h-40 p-4 rounded-xl bg-orange-200 flex flex-col justify-end max-lg:hidden'>
      {/* <h1 className='font-poppins text-blue-600 text-4xl font-bold'>It's</h1> */}
      <h1 className='font-outfit text-4xl font-bold max-md:text-md'>{new Date().toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit", hour12: true})}</h1>
      <h1 className='font-outfit text-xl font-bold text-blue-600 max-md:text-md'>{new Date().toLocaleDateString("en-US", {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</h1>
    </div>
  )
}

const WelcomeCards = ({color, text, icon}) => {
  return(
    <div className={`${color === 'orange' ? "bg-orange-500 hover:bg-orange-600 transition-colors cursor-pointer" : color === 'blue' ? "bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer" : color === 'purple' ? "bg-purple-500 hover:bg-blue-600 transition-colors cursor-pointer" : color === 'yellow' ? "bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer" : ""} w-2/6 max-lg:w-[48%] h-52 p-3 flex flex-col justify-between rounded-lg`}>
      <p className='text-white text-xl w-10 h-10 flex items-center justify-center rounded-md shadow-lg bg-white bg-opacity-20'>{icon}</p>
      <h1 className='font-outfit text-white text-xl font-bold'>{text}</h1>
    </div>
  )
}

const Welcome = () => {
  useEffect(() => {
    aos.init()
  }, [])

  const {user} = useContext(UserContext)
  return (
  <div className='max-lg:w-screen mt-10'>
  <div className='flex justify-between gap-6 mt-6 max-md:flex-wrap max-md:w-screen max-md:justify-start w-full px-5' data-aos="fade-right" data-aos-duration="1000" data-aos-easing="ease-in-sine">
    <div className='w-3/5 h-40 flex flex-col justify-end bg-blue-100 p-4 rounded-xl max-lg:w-full'>
      <div>
      <h2 className='font-outfit text-2xl font-bold overflow-hidden whitespace-nowrap text-blue-700'>
      {
            new Date().getHours() < 12 ?  'Good Morning!' : 'Good Afternoon!'
      }
      </h2>
      </div>
      <h2 className='font-outfit text-3xl font-bold overflow-hidden whitespace-nowrap'>
       {user.fullname}👋
      </h2>
    </div>
    <WelcomeTime/>
  </div>
  <div className='flex justify-between px-14 gap-3 mt-8 max-md:px-2 w-full max-md:flex-wrap' data-aos="fade-right" data-aos-delay="600" data-aos-duration="1000" data-aos-easing="ease-in-sine">
      <WelcomeCards color={'orange'} text="Find Projects" icon={<i className="fa-solid fa-magnifying-glass"></i>}/>
      <WelcomeCards color={'blue'} text="Track Projects" icon={<i className="fa-solid fa-gear"></i>}/>
      <WelcomeCards color={'purple'} text="Find Talent" icon={<i className="fa-solid fa-user"></i>}/>
      <WelcomeCards color={'yellow'} text="Solve Problems" icon={<i className="fa-solid fa-pen"></i>}/>
  </div>
    </div>
  )
}

export default Welcome