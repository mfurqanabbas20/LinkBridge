import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import EditProfile from "../components/EditProfile";
import UserContext from "../context/UserContext";
import { jwtDecode } from "jwt-decode";
import sample_profile from "../assets/avatar.jpg";
import cover_pic from "../assets/cover.jpg";
import { toast } from 'react-toastify'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {ProgressBar} from 'react-loader-spinner'
import { PeerPost } from "../components/Peer";

export const ProjectCard = ({project}) => {
  const {url} = useContext(UserContext)
  return (
  <>
    <div className="my-5 bg-slate-100 w-80 p-5 rounded-lg flex flex-col gap-1 cursor-pointer">
      <h1 className="text-xl font-bold ">{project?.title}</h1>
      <p className="text-sm opacity-80">{project?.description}</p>
      <p className="text-sm font-bold opacity-60">Category: {project?.category}</p>
      <div className="w-full flex justify-between items-center">
        <p className="text-sm font-bold opacity-60">Supervisor: {project?.supervisor?.fullname || 'N/A'}</p>
        <div className="flex">
          {
            project?.members?.map((item) => {
              return (
                <img className="w-6 h-6 rounded-full" src={`${url}/${item.profilePicture}`} alt="" />
              )
            })
          }
        </div>      
      </div>
    </div>
  </>  
  )
}

const Profile = () => {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user, url, setUser, setProject, project, connections, setConnections } = useContext(UserContext);
  const [posts, setPosts] = useState([])
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPosts, setShowPosts] = useState(false)
  const token = localStorage.getItem("token")
  let decode = "";

  useEffect(() => {
    try {
      if (localStorage.getItem("token")) {
        fetchData()
      }
    } catch (error) {
      console.log(error);
    }
   
  }, []);

  // this is for fetching both user and project
  const fetchData = async () => {
    try {
      setLoading(true)
      decode = jwtDecode(localStorage.getItem("token"));
      await Promise.all([fetchUser(), fetchProject(), fetchConnections(), fetchPosts()])
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }
  }

  const fetchUser = async () => {
    if (localStorage.getItem("token")) {
      const response = await axios.get(`${url}/api/user/${decode.id}`);
      setUser(response.data.user);
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${url}/api/post/profile/posts`, {headers: {token}})      
      setPosts(response.data.posts)
    } catch (error) {
      
    }
  }

  const fetchConnections = async() => {
    try {
      const response = await axios.get(`${url}/api/user/connects/accepted/${decode.id}`, {headers: {token}})    
      setConnections(response.data.connections)
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }
  }

  const fetchProject = async () => {
      try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${url}/api/project/${decode.id}`, {headers: {token}})
      setProject(response.data.project)
      } catch (error) {
        console.log(error);
      }   
  }

  const handleProfileImg = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profilePic", file);
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${url}/api/user/upload-profile`,
      formData,
      { headers: { token } }
    );
    setUser(response.data.user);
  };
  
  const handleCoverImg = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("coverPic", file);
    const token = localStorage.getItem("token");
    const response = await axios.put(`${url}/api/user/upload-cover`, formData, {
      headers: { token },
    });
    setUser(response.data.user);
  };

  const deleteAccount = async () => {
    try {
      await axios.delete(`${url}/api/user/${user._id}`)
      toast.success("User Deleted Successfully", {
        position: 'bottom-left',
        autoClose: 3500, 
      })
      navigate('/login')
    } catch (error) {
      console.log(error);
    }
  }
  

  return (
    <>
      <Navbar />
      {
      loading ?
      <div className='flex justify-center items-center w-full h-[80vh]'>
        <ProgressBar borderColor='#1E88E5' barColor='#1E88E5'/>         
      </div>
      :
      <div className="px-14 my-4 max-sm:px-3 min-w-screen">
        {showEditProfile && (
          <div className="flex justify-center ">
            <EditProfile
              showEditProfile={showEditProfile}
              setShowEditProfile={setShowEditProfile}
            />
          </div>
        )}
        <div className="z-0 relative profile-container w-9/12 rounded-xl max-sm:w-screen min-[330px]:pr-3">
          <div className="cover-photo w-full h-56 relative mb-12 rounded-xl">
            {/* profile cover photo */}
            <label htmlFor="cover">
              <img
                className="w-full h-full rounded-xl object-cover"
                src={
                  user.coverPicture ? `${url}/${user.coverPicture}` : cover_pic
                }
                alt="Cover Photo of User"
              />
            </label>
            <input
              id="cover"
              type="file"
              className="w-full h-full hidden"
              onChange={handleCoverImg}
            />
            <div className="profile-photo rounded-full w-32 h-32 ml-4 bg-red-950 absolute -bottom-12">
              <label htmlFor="profile">
                <img
                  className="w-full h-full rounded-full object-cover"
                  src={
                    user.profilePicture
                      ? `${url}/${user.profilePicture}`
                      : sample_profile
                  }
                  alt=""
                />
              </label>
              <input
                id="profile"
                type="file"
                onChange={handleProfileImg}
                className="w-full h-full hidden"
              />
            </div>
          </div>
          <div className="user-info mx-4 mt-16 max-sm:mx-0">
            <div className="flex items-center justify-between">
              <h1 className="font-poppins text-xl font-medium">
                {user.fullname}
              </h1>
              <i
                onClick={() => setShowEditProfile(!showEditProfile)}
                className="fa-solid fa-pencil"
              ></i>
            </div>
            <p>
              {user.description
                ? user.description
                : "Your description goes here"}
            </p>
            {(user.role === "Student" || user.role === "Teacher") && (
              <p>{user.university}</p>
            )}
            {user.role === "Industry Professional" && (
              <p>Industry{user.industry}</p>
            )}

            <p onClick={() => navigate('/user/connections')} className="hover:text-blue-900 font-semibold hover:underline cursor-pointer transition-transform">
              You have Total {user.connections.length > 0 ? connections.length : "0"}{" "}
              Connections
            </p>
            {user.role === 'Student' &&  
            <div className="fyp-profile my-3">
              <h1 className="text-xl font-bold font-outfit">Final Year Project</h1> 
              {
                Object.keys(project).length !== 0  ? <ProjectCard project={project}/> : "Not added yet!"
              }
              </div>
            }
           
           

          </div>
          {
            user.role === 'Student' ? 
            <div className="recent-activities mx-4">
            <h1 className="text-xl font-bold font-outfit my-4">My Recent Activities</h1>
            {
              showPosts ? 
              posts.slice(0, 100).map((item) => {                
                return <PeerPost profile post={item}/>
              })
              :
              posts.slice(0,1).map((item) => {                
                return <PeerPost profile post={item}/>
              })
            }
            <div className="my-4">
              {
                posts.length > 0
                ?
                <div className="px-40">
                <button onClick={() => setShowPosts(!showPosts)} className="bg-green-600 w-32 h-10 font-outfit font-bold text-white rounded-xl">{showPosts ? "Show Less" : "Show More"}  &nbsp;+ </button>
                </div>
                :
                <div className="">
                  <h1>No Recent Activity to show</h1>
                </div>
              }
            </div>
          </div>
          : 
          ""
          }
        </div>
        {/*  */}

        <button onClick={deleteAccount} className='bg-red-600 text-sm text-white font-semibold w-36 rounded-full p-2 mt-8 mb-2 mx-2'>
          Delete Account
        </button>
      </div>
      }
    </>
  );
};

export default Profile;



