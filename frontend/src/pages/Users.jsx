import React, {useContext, useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import SearchUser from '../components/SearchUser'
import {ColorRing} from 'react-loader-spinner'
import search_poster from '../assets/search_poster.png'
import UserContext from '../context/UserContext'
import axios from 'axios'
const Users = () => {
  const {url, user} = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  // this is for storing all the users
  const [users, setUsers] = useState([])
  // this is for storing all the filter users
  const [filterUsers, setfilterUsers] = useState([])

  const searchParams = new URLSearchParams(window.location.search)
  const searchUser = searchParams
  const searchTerm = searchParams.get("search")

  const fetchUsers = async() => {
    try {
      setLoading(true)
      const response = await axios.get(`${url}/api/user/all/users`)
      setUsers(response.data.user)
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false)
    }
  }
  
  useEffect(() => {
    console.log('Inside Use Effect');
    
    fetchUsers()
  }, [])

  const setFilterUsers = () => {
    const filterResult = users.filter((user) => {
      return user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    })
    setfilterUsers(filterResult)
  }

  useEffect(() => {
    setFilterUsers()
  }, [users, searchTerm])

  return (
    <div>
      <Navbar/>
      <h2 className='pt-3 pl-12 text-2xl font-bold font-outfit bg-slate-50'>Best Find For You :)</h2>
      <div className='bg-slate-50 h-min-screen w-screen flex justify-between pr-16'>
      {loading ?
      <div className='m-auto'>
        <ColorRing/>
      </div>
      :
      <div className='px-20 ' >
      {filterUsers.filter(item => item.fullname !== user.fullname).map((item) => {
        console.log('User', item);
        
        return <SearchUser
        searchUser={item}
        />
      })}
      </div>
      }
      <img className='w-60 h-60 object-cover drop-shadow-lg rounded-lg max-md:hidden' src={search_poster} alt="" />
      </div>
    </div>
  )
}

export default Users