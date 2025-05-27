import { useContext, useEffect, useState } from "react";
import upload_area from "../assets/upload_area.png";
import axios from "axios";
import UserContext from "../context/UserContext";
import randomGradient from "random-gradient";
import { ProgressBar } from "react-loader-spinner";
import {toast} from 'react-toastify'

const UploadResource = ({setselectedTab}) => {
  const [showPopup, setshowPopup] = useState(false);
  const { url } = useContext(UserContext);
  const [document, setDocument] = useState(null);

  // This for showing popup to user when user uploads a document
  const FileUpload = () => {
    const [resource, setResource] = useState({
      title: "",
      description: "",
    });

    const handleChange = (e) => {
      setResource((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
    };

    const handleSubmit = async () => {
      const toastId = toast.loading('Uploading Resource', {
          position: 'bottom-left'
      })
      try {
      const formData = new FormData();
      formData.append("resource", document);
      formData.append("title", resource.title);
      formData.append("description", resource.description);
      await axios.post(`${url}/api/resource/add`, formData);
      toast.update(toastId, {
        render: 'Resource Added',
        isLoading: false,
        type: 'success',
        position: 'bottom-left',
        autoClose: 2000, 
      })
      } catch (error) {
        toast.update(toastId, {
        render: 'Error Occured Added',
        isLoading: false,
        type: 'error',
        position: 'bottom-left',
        autoClose: 2000, 
      })
      }
      
    };

    const deleteDocument = () => {
      resource.document = "";
      setshowPopup(false);
    };

    return (
      <div className="flex flex-col gap-2">
        <h1>Uploaded</h1>
        <div className="flex justify-between items-center filearea border border-gray-500 w-96 h-10 rounded-md p-2">
          <p>{document.name}</p>
          <i
            onClick={deleteDocument}
            className="text-sm text-gray-700 cursor-pointer fa-solid fa-trash"
          ></i>
        </div>
        <div className="content flex flex-col gap-2">
          <label htmlFor="title">Title*</label>
          <input
            className="w-96 h-10 border outline-blue-500 p-2 rounded-md"
            type="text"
            name="title"
            value={resource.title}
            onChange={handleChange}
          />
        </div>
        <div className="content flex flex-col gap-2">
          <label htmlFor="description">Description*</label>
          <textarea
            className="w-96 h-20 border outline-blue-500 p-2 rounded-md"
            name="description"
            value={resource.description}
            onChange={handleChange}
          />
        </div>
        <button
          className="bg-blue-600 text-white w-28 h-8 rounded-xl my-2"
          onClick={handleSubmit}
        >
          Upload
        </button>
      </div>
    );
  };

  const handleFile = (e) => {
    setDocument(e.target.files[0]);
    setshowPopup(true);
  };

  return (
    <div className="p-2 flex flex-col gap-4 items-center justify-center h-full w-full mt-8">
      <div className={showPopup ? "hidden" : ""}>
        <label htmlFor="document">
          <img src={upload_area} className="w-full h-full" alt="" />
        </label>
        <input
          className="w-full h-full hidden"
          onChange={handleFile}
          id="document"
          type="file"
          accept="application/pdf"
          name="document"
        />
      </div>
      {showPopup ? <FileUpload /> : ""}
    </div>
  );
};

const ResourceCard = ({resource}) => {

  const gradient = randomGradient(resource.title)
    
  return (
    <div className="flex flex-col gap-2 w-72 min-[450px]:w-52 min-[600px]:w-72 h-auto border shadow-md rounded-lg hover:translate-y-1 transition-transform cursor-pointer pb-4">
      <div style={{background: gradient}} className="w-full min-h-40 max-sm:min-h-32 rounded-t-lg flex items-center justify-center">
        <h1 className="text-center text-white font-bold font-outfit text-3xl drop-shadow-2xl">{resource.title.split(' ')[0]}</h1>
      </div>
      <div className="content px-6 py-3">
        <h1 className="font-outfit font-bold text-xl max-sm:text-lg">{resource.title}</h1>
        <p className="text-sm text-clip max-sm:text-xs">{resource.description}</p>
      </div>
      <button onClick={() => console.log(`${resource.document}`)} className="mx-6 text-sm font-outfit font-bold p-2 w-28 h-10 shadow-md rounded-lg mt-auto">
        Download{" "}
      </button>
    </div>
  );
};

const KnowledgeHub = () => {
  const [selectedTab, setselectedTab] = useState("show");
  const [resources, setResources] = useState([])
  const [search, setSearch] = useState('')
  const {url} = useContext(UserContext)
  const [loading, setLoading] = useState(true)
  
  const fetchResources = async () => {
    try {
      const response = await axios.get(`${url}/api/resource/all`)
      setResources(response.data.resources)
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setSearch(e.target.value)
  }

  useEffect(() => {
    fetchResources()
  }, [])

  return (
  <div className="max-sm:mt-12">
      <div className="px-2">  
      <h1 className="text-2xl font-bold font-outfit my-2">
        <span className="text-orange-700">Top</span>{" "}
        <span className="text-blue-500">Resources</span> for you! 😜
      </h1>
      <div className="tab flex gap-10 cursor-pointer">
        <h1
          className={`${
            selectedTab === "show"
              ? "text-md border-b-2 border-blue-600 text-blue-500 font-semibold"
              : "text-md"
          }`}
          onClick={() => setselectedTab("show")}
        >
          Show Resources
        </h1>
        <h1
          className={`${
            selectedTab === "upload"
              ? "text-md border-b-2 border-blue-600 text-blue-500 font-semibold"
              : "text-md"
          }`}
          onClick={() => setselectedTab("upload")}
        >
          Add Resources
        </h1>
        <hr />
      </div>
      {selectedTab === "upload" ? (
        <UploadResource setselectedTab={setselectedTab} />
      ) : (
        <div>
          <div className="flex flex-col items-center max-sm:mt-2">
            <input
              type="text"
              className="border w-96 h-10 max-sm:w-64 px-3 font-outfit rounded-lg text-sm font-semibold outline-blue-500"
              placeholder="Search Resources"
              name="resource"
              value={search}
              onChange={handleChange}
            />
            {
              loading 
              ?
              <div className='flex items-center justify-center min-h-96'>
                <ProgressBar borderColor='#1E88E5' barColor='#1E88E5'/>
              </div>
              :
              <div className="flex flex-wrap justify-start px-8 gap-4 my-4 max-sm:px-0 max-sm:justify-center">
              {resources
              .filter((item) => {
                return search.toLowerCase() === '' ? item : 
                item.title.toLowerCase().includes(search)
              })
              .map((item) => {
                return <ResourceCard resource={item}/>
              })}
            </div>
            }
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default KnowledgeHub;
