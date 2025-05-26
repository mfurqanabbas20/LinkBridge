import React, { useContext, useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import UserContext from "../context/UserContext";
import axios from "axios";
import {toast} from 'react-toastify'

export const ProjectDisplay = ({ selectedProject }) => {
  const {user, url} = useContext(UserContext)
  const [progress, setProgress] = useState([])
  const [percentage, setPercentage] = useState(0);
  const [milestone, setMilestone] = useState({
    requirement: false,
    system: false,
    ui: false,
    frontend: false,
    backend: false,
    testing: false,
    deployment: false
  });
  const [loading, setLoading] = useState(true)

  const [showChangeBtn, setshowChangeBtn] = useState(false)

  const calculatedPercentage = {
    requirement: 10,
    system: 10,
    ui: 10, 
    frontend: 25,
    backend: 30,
    testing: 10,
    deployment: 5
  }

  const handleChange = (e) => {
    setshowChangeBtn(true)
    setMilestone((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.checked
      };
    });    
    setPercentage(e.target.checked ? percentage + calculatedPercentage[e.target.name] : percentage - calculatedPercentage[e.target.name])
  };

  const handleSubmit = async () => {
    setshowChangeBtn(false)
    await axios.put(`${url}/api/progress/update`, {milestone, percentage, projectId: selectedProject._id})    
  };

  // for handling upload documentation
  const handleDocumentation = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('projectId', selectedProject._id)
    formData.append('doc', file)
    const toastId = toast.loading("Uploading Documentation", {
      position: 'bottom-left',
    })
    try {
      await axios.put(`${url}/api/progress/uploadDoc`, formData)
      toast.success("Documentation Uploaded", {
        position: 'bottom-left',
        autoClose: 2000
      })
    } catch (error) {
      toast.error("Error Occured", {
        position: 'bottom-left',
        autoClose: 2000
      })
    }
    finally {
      toast.dismiss(toastId)
    }
  }

  const handleCode = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('projectId', selectedProject._id)
    formData.append('code', file)
    const toastId = toast.loading("Uploading Code", {
      position: 'bottom-left',
    })
    try {
      const response = await axios.put(`${url}/api/progress/uploadCode`, formData)
      toast.success("Code Uploaded", {
        position: 'bottom-left',
        autoClose: 2000
      })
    console.log(response);
    } catch (error) {
      console.log(error);
      toast.error("Error Occured", {
        position: 'bottom-left',
        autoClose: 2000
      })
    }
    finally {
      toast.dismiss(toastId)
    }
  }

  useEffect(() => {
    fetchProgress()
  }, [])

  const fetchProgress = async () => {
    try {
      const response = await axios.get(`${url}/api/progress/${selectedProject._id}`)
      setMilestone(response.data.progress.currentStage)
      setPercentage(response.data.progress.progressPercentage)
      setProgress(response.data.progress)
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false)
    }
  }
  
  const downloadDoc = () => {
    window.location.href = `${url}/${progress.projectDocumentation}`;
  }
   const downloadCode = () => {
    window.location.href = `${url}/${progress.projectCode}`;
  }

  return (
    <>
    {
      user.role === 'Student' && selectedProject.approvalStatus === 'Pending' 
      ?
      <div className="flex flex-col gap-1 items-center h-[80vh] justify-center">
        <h1 className="text-3xl font-bold font-outfit">Your <span className="text-blue-600">Project</span> has been submitted for <span className="text-indigo-600">approval...</span> </h1>
        <h1 className="text-2xl font-bold font-outfit">Be Patient! 🙏</h1>
      </div>
      :
    <div className="px-8 max-sm:w-fit">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl my-4 font-bold text-blue-500 font-poppins">{selectedProject.title}</h1>
        <div className="" style={{ width: "150px", height: "150px" }}>
          <CircularProgressbar styles={buildStyles({
            pathColor: '#EF4444',
            trailColor: '#f3f4f6',
            textColor: '#111827'
          })} value={percentage} text={percentage + "%"} />
        </div>
      </div>
      {/* Current Milestones */}
      <div className="current-milestones max-sm:mt-2">
        <div className="flex gap-2 items-center">
          <input
            className="hidden"
            type="checkbox"
            // value={milestone.requirement}
            checked={milestone.requirement}
            name="requirement"
            onChange={handleChange}
            id="requirement"
          />
          <label htmlFor="requirement">
          {milestone.requirement ? (
            <i className="fa-solid fa-circle-check text-green-600"></i>
          )
          : (
            <i className="fa-solid fa-circle-xmark text-red-600"></i>
          )
        }
          &nbsp;Requirement Gathering
          </label>
        </div>
        <div className="flex gap-2 items-center">
          <input
            className="hidden"
            type="checkbox"
            checked={milestone.system}
            name="system"
            onChange={handleChange}
            id="system"
          />
          <label htmlFor="system">
          {milestone.system ? (
            <i className="fa-solid fa-circle-check text-green-600"></i>
          )
          : (
            <i className="fa-solid fa-circle-xmark text-red-600"></i>
          )
        }
          &nbsp;System Design
          </label>
        </div>
        <div className="flex gap-2 items-center">
          <input
            className="hidden"
            type="checkbox"
            checked={milestone.ui}
            name="ui"
            onChange={handleChange}
            id="ui"
          />
           <label htmlFor="ui">
          {milestone.ui ? (
            <i className="fa-solid fa-circle-check text-green-600"></i>
          )
          : (
            <i className="fa-solid fa-circle-xmark text-red-600"></i>
          )
        }
          &nbsp;UI/UX Design
          </label>
        </div>
        <div className="flex gap-2 items-center">
          <input
            className="hidden"
            type="checkbox"
            checked={milestone.frontend}
            name="frontend"
            onChange={handleChange}
            id="frontend"
          />
            <label htmlFor="frontend">
          {milestone.frontend ? (
            <i className="fa-solid fa-circle-check text-green-600"></i>
          )
          : (
            <i className="fa-solid fa-circle-xmark text-red-600"></i>
          )
        }
          &nbsp;Frontend Development
          </label>
        </div>
        <div className="flex gap-2 items-center">
          <input
            className="hidden"
            type="checkbox"
            checked={milestone.backend}
            name="backend"
            onChange={handleChange}
            id="backend"
          />
            <label htmlFor="backend">
          {milestone.backend ? (
            <i className="fa-solid fa-circle-check text-green-600"></i>
          )
          : (
            <i className="fa-solid fa-circle-xmark text-red-600"></i>
          )
        }
          &nbsp;Backend Development
          </label>
        </div>
        <div className="flex gap-2 items-center">
          <input
            className="hidden"
            type="checkbox"
            checked={milestone.testing}
            name="testing"
            onChange={handleChange}
            id="testing"
          />
          <label htmlFor="testing">
          {milestone.testing ? (
            <i className="fa-solid fa-circle-check text-green-600"></i>
          )
          : (
            <i className="fa-solid fa-circle-xmark text-red-600"></i>
          )
        }
          &nbsp;System Testing 
          </label>
        </div>
        <div className="flex gap-2 items-center">
          <input
            className="hidden"
            type="checkbox"
            checked={milestone.deployment}
            name="deployment"
            onChange={handleChange}
            id="deployment"
          />
            <label htmlFor="deployment">
          {milestone.deployment ? (
            <i className="fa-solid fa-circle-check text-green-600"></i>
          )
          : (
            <i className="fa-solid fa-circle-xmark text-red-600"></i>
          )
        }
          &nbsp;Deployment
          </label>
        </div>
        <button onClick={handleSubmit} className={showChangeBtn ? "my-2 bg-blue-600 w-36 h-8 text-sm text-white font-outfit rounded-full" : "hidden"}>Apply Changes</button>
      </div>
      {/* Group Members */}
      <h1 className="my-3 text-xl font-semibold">Group Members</h1>
      <div className="flex gap-6">
        {
            selectedProject.members.map((item) => {
                return(
                <div className="group-member flex flex-col gap-2 justify-center items-center">
                  <img className="w-12 h-12 object-cover rounded-full shadow-2xl hover:scale-110 transition cursor-pointer" src={`${item.profilePicture}`} alt="" />
                  <p className="text-sm">{item.fullname}</p>
                </div>
                )
            })
        }
      </div>
      {/* Group Member Section ends above */}
      <h1 className="my-3 text-xl font-semibold">Project Supervisor</h1>
      <div className="flex gap-6">
      <div className="flex flex-col gap-2 justify-center items-center">
        {
          user.role === 'Teacher' ?
          <div className="flex flex-col justify-center items-center gap-1">
              <img className="w-12 h-12 object-cover rounded-full  shadow-2xl hover:scale-110 transition cursor-pointer" src={`${user.profilePicture}`} alt="" />
              <p className="text-sm">{user.fullname}</p>
          </div>
        :
        <div className="flex flex-col items-center gap-1">
          <img className="w-12 h-12 object-cover rounded-full  shadow-2xl hover:scale-110 transition cursor-pointer" src={`${selectedProject.supervisor.profilePicture}`} alt="" />
          <p className="text-sm">{selectedProject.supervisor.fullname}</p>
        </div>
        }
      </div>
      </div>
      <div>
        <h1 className="my-3 text-xl font-semibold">Project Overview</h1>
        <p className="text-sm">{selectedProject.description}</p>
      </div>
      <div className="project-doc-code flex gap-4">
        <label htmlFor="upload-documentation">
          <h1 className="flex items-center justify-center my-5 w-48 h-10 bg-indigo-600 text-white font-semibold font-outfit text-sm rounded-lg">
            Upload Documentation
          </h1>
        </label>
        <input id="upload-documentation" name="upload-documentation" onChange={handleDocumentation} className="w-full h-full hidden" type="file"/>
        <label htmlFor="upload-code">
          <h1 className="flex items-center justify-center my-5 w-48 h-10 bg-emerald-700 text-white font-semibold font-outfit text-sm rounded-lg">
            Upload Code
          </h1>
        </label>
        <input  id="upload-code" onChange={handleCode}  name="upload-code" className="w-full h-full hidden" type="file"/>
      </div>
      <div className="project-download flex gap-4">
      <button onClick={downloadDoc} className="my-5 w-48 h-10 bg-indigo-600 text-white font-semibold font-outfit text-sm rounded-lg">
          Download Documentation
        </button>
        <button onClick={downloadCode} className="my-5 w-48 h-10  bg-emerald-700 text-white font-semibold font-outfit text-sm rounded-lg">
          Download Code
        </button>
      </div>
    </div>
    }
    </>
  );
};

const ProjectSection = ({setSelectedProject, setSelectedItem }) => {
  const [projects, setProjects] = useState([]);
  const { url, user } = useContext(UserContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const response = await axios.get(
      `${url}/api/project/supervisor/${user._id}`,
      { headers: { token } }
    );
    setProjects(response.data.projects);
  };

  const handleAccept = async (project) => {
      await axios.put(`${url}/api/project/${project._id}/updateStatus`)
      toast.success("Project Accepted", {
        position: 'bottom-left',
        autoClose: 2000
      })
      setSelectedProject(project)
      setSelectedItem('project-track')
  }

  const handleReject = async (project) => {
    await axios.delete(`${url}/api/project/${project._id}/delete`)
    toast.error("Project Declined", {
      position: 'bottom-left',
      autoClose: 2000
    })
  }

  const handleOpen = (project) => {
    setSelectedProject(project)
    setSelectedItem('project-track')
  }

  return (
    <div className="max-lg:w-screen max-lg:mt-10">
      {projects.map((item) => {
        return (
          <>
          {
            item.approvalStatus === "Pending"
            ?
            <div className="font-poppins">
               <h1 className="font-poppins text-xl font-bold">Pending Projects</h1>
            <div key={item._id}
            className="p-4 overflow-y-auto my-2 bg-red-500 w-11/12 rounded-lg"
          >
            <h1 className="text-white text-2xl font-bold mb-3">{item.title}</h1>
            <span className="text-white text-sm">Students: </span>
            <span className="text-white text-sm">{item.members.map((student) => student.fullname).join(', ')}</span>
            <div className="flex justify-between">
            <p className="text-white text-xs mt-1">Category: {item.category}</p>
            <div className="flex gap-2">
              <button onClick={() => handleAccept(item)} className="bg-green-600 text-white w-32 h-10 rounded-lg font-semibold text-sm font-poppins">Accept</button>
              <button onClick={() => handleReject(item)} className="bg-red-400 w-32 h-10 rounded-lg text-white font-semibold text-sm font-poppins">Reject</button>
            </div>
      
            </div>
          </div>
            </div>
            :
            <div className="mb-8 font-poppins">
              {/* accepted projects */}
              <h1 className="font-poppins text-xl font-bold">Accepted Projects</h1>
            <div key={item._id}
            onClick={() => handleOpen(item)}
            className="p-4 overflow-y-auto my-2 bg-blue-600 w-11/12 rounded-lg"
          >
            <h1 className="text-white text-2xl font-bold mb-3">{item.title}</h1>
            <span className="text-white text-sm">Students: </span>
            <span className="text-white text-sm">{item.members.map((student) => student.fullname).join(', ')}</span>
            <p className="text-white text-xs">Category: {item.category}</p>
            </div>
            </div>
          } 
          </>
        );
      })}

    </div>
  );
};

const ActiveProject = ({setSelectedProject, setSelectedItem }) => {
  const { user } = useContext(UserContext);
  
  return (
    <div className="p-6">
      {/* <ProjectDisplay/> */}
      {user.role === "Teacher" && (
        <ProjectSection
          setSelectedItem={setSelectedItem}
          setSelectedProject={setSelectedProject}
        />
      )}
    </div>
  );
};

export default ActiveProject;
