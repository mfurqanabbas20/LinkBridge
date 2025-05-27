import React, { useContext, useEffect, useState } from 'react'
import sample from '../assets/lognew.png'
import UserContext from '../context/UserContext'
import axios from 'axios'
import {ProgressBar} from 'react-loader-spinner'
import {format} from 'timeago.js'
import {Carousel} from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import compromise from 'compromise'
import Sentiment from 'sentiment'
import {useNavigate} from 'react-router-dom'
import AddPeerPost from './AddPeerPost'
import {toast} from 'react-toastify'

const sentiment = new Sentiment()

const AnalyzeComments = (comments) => {
  const sentimentResult = sentiment.analyze(comments)
  const doc = compromise(comments)
  const people = doc.people().out('array')
  const places = doc.places().out('array')
  const verbs = doc.verbs().out('array')
  return{
    sentimentScore: sentimentResult.score,
    sentimentText: sentimentResult.comparative,
    people,
    places,
    verbs
  }
}

const AddToFeed = ({users}) => {
  const {user, url, connection_message} = useContext(UserContext)
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)
  const token = localStorage.getItem("token")
  const handleDisconnect = async (id) => {
    setIsPending(false)
    await axios.delete(`${url}/api/user/${id}/disconnect`, {headers: {token}})    
  }
  const handleConnect = async (id) => {
    toast.success('Connection Request Sent', {
      position: 'bottom-left',
      autoClose: 2000, 
    })
    setIsPending(true)
    const message = `${user.fullname} ` + connection_message
    const notificationType = 'alert'
    await axios.put(`${url}/api/user/${id}/connect`,{}, {headers: {token}})
    // api for sending connect
    await axios.post(`${url}/api/notification/create/${id}`,{message, notificationType}, {headers: {token}})
  }
  
  return(
    <div className='w-4/12 bg-white px-2 max-md:hidden'>
    <h1 className='text-2xl font-bold py-2 font-outfit'>Add to your feed</h1>
    {users.map((item) => {
      const connectedUsers = user.connections.map((item) => {
        return item.user 
      })
      if(user?.fullname !== item?.fullname && !connectedUsers.some((connectedUser) => connectedUser?.fullname === item?.fullname)){ 
        return (
        <div className='flex my-2 '>
          <img className='m-2 w-12 h-12 rounded-full object-cover' src={`${item.profilePicture}`} alt="" />
          <div className='w-9/12'>
            <h1 onClick={() => navigate(`/user/${item?._id}`)} className='cursor-pointer font-semibold'>{item.fullname}</h1>
            <p className=' text-sm'>{item.description}</p>
            {
              isPending 
              ? 
              <button onClick={() => handleDisconnect(item._id)} className='my-2 bg-white border border-black w-32 h-8 rounded-full font-semibold'><i className="text-md fa-solid fa-user-plus"></i>&nbsp;&nbsp;Requested</button>
              :
              <button onClick={() => handleConnect(item._id)} className='my-2 bg-white border border-black w-32 h-8 rounded-full font-semibold'><i className="text-md fa-solid fa-user-plus"></i>&nbsp;&nbsp;Connect</button>
            }
          </div> 
         </div>
        
        )
      }
      })}
    </div>
  )
}

const Comment = ({comment}) => {
  const {url, user} = useContext(UserContext)  
  
  return(
    <div className='flex gap-2 w-full p-2 my-2 max-sm:p-0'>
      <img className='w-10 h-10 object-cover rounded-full max-sm:size-8' src={`${comment.userId.profilePicture ? comment.userId.profilePicture : user.profilePicture}`} alt="" />
      <div className="content w-full">
        <div className="user-name flex justify-between">
          <h1 className='text-sm font-bold max-sm:text-xs'>{comment.userId.fullname ? comment.userId.fullname : user.fullname}</h1>
          <p className='text-xs max-sm:text-[10px]'>{format(comment.createdAt)}</p>
        </div>
        <p className='text-xs opacity-80 max-sm:text-[10px]'>{comment.userId.description ? comment.userId.description : user.description}</p>
        <p className='text-sm mt-2 max-sm:text-xs max-sm:mt-1'>{comment.comment}</p>
      </div>
    </div>
  )
}

export const PeerPost = ({profile, post}) => {
  const {user, url} = useContext(UserContext)
  const [comments, setComments] = useState(post?.comments)
  const [likes, setLikes] = useState(post?.likes.length)

  const [newComment, setnewComment] = useState({
    userId: user?._id,
    comment: ''
  }) 

  // this is for tracking weather new comment added or not
  let commentAdded = false
  
  useEffect(() => {
    fetchComments()
  }, [commentAdded])

  const fetchComments = async () => {
    const response = await axios.get(`${url}/api/post/${user?._id}`)
    setComments(response?.data?.posts.comments || post.comments)
  }

  const [isLike, setisLike] = useState(post?.likes?.includes(user._id))

  const [showAllComments, setshowAllComments] = useState(false)
  
  const token = localStorage.getItem("token")

  const [score, setScore] = useState(0)

  useEffect(() => {
    let positive = 0, negative = 0, neutral = 0;
    try {
      const comments = post.comments
      comments.map((item) => {
        const analysis = AnalyzeComments(item.comment)
        if(analysis.sentimentScore > 0)
          positive++;
        else if(analysis.sentimentScore < 0)
          negative++
        else
          neutral++
        })
    } catch (error) {
      console.log(error);
    }
    let totalScore = (positive - negative) / comments.length
    setScore(totalScore)
    
  }, [commentAdded])
   
  const handleLike = async () => {
    const newLikeState = !isLike
    setisLike(newLikeState)
    setLikes((prevLikes) => newLikeState ? prevLikes + 1 : prevLikes - 1)
    await axios.put(`${url}/api/post/like/${post._id}`,{}, {headers: {token}})
  }

  const handleChange = (e) => {
    setnewComment((prev) => {
      return {
        ...prev,
        comment: e.target.value
      }
    })
  }    

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${url}/api/post/delete/${id}`, {headers: {token}})
      toast.success('Post Deleted', {
        autoClose: 2000,
        position: 'bottom-left'
      })
    } catch (error) {
      toast.error('Error Occured', {
        autoClose: 2000,
        position: 'bottom-left'
      })
    }
  }
  
  const handleSubmit = async () => {
    const comment = {
      userId: user._id,
      comment: newComment.comment
    }
    commentAdded = true
    await axios.put(`${url}/api/post/comment/${post._id}`, comment)
    setComments((prevComments) => [...prevComments, comment])    
    setnewComment({
      comment: ''
    })
  }  

  const navigate = useNavigate()
  
  return(
    <div className='max-md:mx-2'>
    {
      post.length === 0
      ?
      <h1>No post to show</h1>
      :
      <div className={`bg-white border rounded-lg shadow-sm my-2 max-sm:my-0 ${profile ? "w-8/12" : "w-auto max-sm:w-full"}`}>
      <div className='post-top flex gap-1 p-2 relative'>
        <img className='h-9 w-9 rounded-full object-cover max-sm:size-8' src={`${post.user.profilePicture}`} alt="" />
      <div className='flex flex-col'>
        <h1 onClick={() => navigate(`/user/${post?.user._id}`)} className='cursor-pointer text-sm font-bold max-sm:text-xs'>{post?.user.fullname}</h1>
        <p className='text-xs max-sm:text-[10px]'>{format(post?.createdAt)}</p>
      </div>
      {
        profile 
        ?
        <div className='absolute right-2 top-2 text-sm font-thin cursor-pointer'>
          <i onClick={() => handleDelete(post._id)} className="fa-solid fa-trash"></i>
        </div>
        :
        ""
      }
      
      </div>
      <p className='text-sm px-2 max-sm:text-xs'>{post?.description}</p>
     <Carousel 
     showThumbs={false}
     infiniteLoop
     showStatus={false}
     emulateTouch
     dynamicHeight
     >
      {
          post.media.map((item) => {        
            return (
              <img className='mt-2 w-full h-72 max-sm:h-52 object-contain' src={`${item}`}/>
            )
          })
      }
      </Carousel>
      <div className="my-2 px-2 like-section flex justify-between">
        <div className='like-btn flex items-center gap-1'>
          <i className="text-red-700 text-md fa-brands fa-gratipay"></i>
          <p className='text-xs'>{likes} Likes</p>
        </div>
        <div className="comment-count">
          <p className='text-xs'>{comments.length} Comments</p>
        </div>
      </div>
      <div className="my-4 px-2 buttons-section cursor-pointer flex gap-8 items-center justify-between">
    
      <div className='flex gap-6'>
        <div onClick={handleLike} className="like-btn flex items-center gap-2 max-sm:gap-1">
          <i className={`${isLike? "text-red-600 text-2xl max-sm:text-xl fa-solid fa-heart" : "text-2xl fa-regular fa-heart"}`}></i>
          <h2 className='text-sm max-sm:text-xs'>Like</h2>
        </div>
        <div onClick={() => setshowAllComments(!showAllComments)} className="comment-btn flex items-center gap-2 max-sm:gap-1">
          <i className=" text-2xl fa-regular fa-comment max-sm:text-xl"></i>
          <h2 className='text-sm max-sm:text-xs'>Comment</h2>
        </div>
      </div>

      <div className="nlp-feedback">
          <p className='text-sm font-sans font-bold flex gap-2 items-center max-sm:text-xs'>
            Feedback: {score > 0 ? <p className='text-xl max-sm:text-[16px]'>😎</p> : score < 0 ? <p className='text-xl max-sm:text-[16px]'>🥲</p> : <p className='text-xl max-sm:text-[16px]'>😐</p>}
          </p>
      </div>
      </div>
      <div className='comments-section mx-2'>
        {comments.slice(0,1).map((item) => {
          return  <Comment comment={item}/>
        })}
        {showAllComments && comments.slice(1).map((item) => {
          return <Comment comment={item}/>
        })}
      </div>
      <div className='w-full flex my-2 gap-2 px-2 max-sm:mt-2'>
        <img className='w-10 h-10 rounded-full max-sm:size-8' src={user.profilePicture ? `${user.profilePicture}` : sample} alt="" />
        <div className="flex items-center relative w-full">
          <input className='w-full h-10 max-sm:h-8 border border-slate-300 rounded-lg font-sans px-2 text-sm outline-blue-500 placeholder-slate-700 max-sm:text-xs' type="text" name='comment' value={newComment.comment} onChange={handleChange} placeholder={`Comment as ${user.fullname}`} />
          <i onClick={handleSubmit} className="cursor-pointer text-blue-800 fa-solid fa-paper-plane absolute right-3"></i>
        </div>
      </div>
      </div>
    }
    </div>
  )
}



const Peer = () => {
  const {user, url} = useContext(UserContext)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [feedUsers, setfeedUsers] = useState([])
  const token = localStorage.getItem("token")
  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    // fetchLikes()
  }, [])

  useEffect(() => {
    fetchFeedUsers()
  }, [])

  // function to fetch the feed display users
  const fetchFeedUsers = async () => { 
    try {
      const response = await axios.get(`${url}/api/user/peer/feed/${user.university}`, {headers: {token}})
      setfeedUsers(response.data.feed)
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false)
    }
  }

  // function to fetch all the posts
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${url}/api/post/${user?._id}`, {headers: {token}})
      setPosts(response.data.posts.reverse())
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false)
    }
    
  }
  
  return (
  <div className='flex justify-between p-2 max-sm:p-0'>
    {
      loading
      ? 
      <div className='flex items-center justify-center min-h-96 min-w-full'>
        <ProgressBar borderColor='#1E88E5' barColor='#1E88E5'/>
      </div>
      :
      <>
      <div className='w-6/12 max-lg:w-screen max-sm:flex max-sm:flex-col max-sm:gap-2'>
      <AddPeerPost />
      <hr className='border my-2 border-gray-300 max-sm:my-0 max-sm:mx-2' />
      {
        posts.map((item) => {
          return <PeerPost post={item} />
        })
      }
      </div>
      </>
    }
    <AddToFeed users={feedUsers}/>
  </div>
  )
}

export default Peer