import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import sample from "../assets/avatar.jpg";
import UserContext from "../context/UserContext";
import { ColorRing } from "react-loader-spinner";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Connections = () => {
  const { user, url, connections } = useContext(UserContext);
  const [pendingConnections, setPendingConnections] = useState([]);
  const [acceptedConnections, setAcceptedConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('')
  const [selectedTab, setselectedTab] = useState("connected");
  const token = localStorage.getItem("token");
  let decode = jwtDecode(localStorage.getItem("token"));

  const getPendingConnections = async () => {
    const response = await axios.get(`${url}/api/user/connects/pending`, {
      headers: { token },
    });
    setPendingConnections(response.data.connections);
  };

  const getAcceptedConnections = async () => {
    const response = await axios.get(`${url}/api/user/connects/accepted/${user._id}`, {
      headers: { token },
    });
    setAcceptedConnections(response.data.connections);
  };

  useEffect(() => {
    getPendingConnections();
    getAcceptedConnections();
  }, []);

  const handleAccept = async (id) => {  
    try {
      const response = await axios.put(`${url}/api/user/${id}/approve`, {}, {headers: {token}})
      toast.success('Connection Accepted', {
        autoClose: '2000',
        position: 'bottom-left'
      })
    } catch (error) {
      toast.error('Error Occured', {
        autoClose: '2000',
        position: 'bottom-left'
      })
    }  
    // handle if someone accepts invitation
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }


  return (
    <div className="bg-gray-50 h-screen">
      <Navbar />
      {loading ? (
        <ColorRing />
      ) : (
        <div className="connection-page w-3/4 mx-16 px-8 py-4 my-8 bg-white rounded-lg shadow-sm max-sm:mt-12 max-md:mx-4 max-md:w-full">
          <h1 className="text-lg max-sm:text-sm">{connections.length} Connections</h1>
          <div className="sort-bar flex items-center justify-between">
            <p className="text-sm max-sm:hidden max-md:text-xs">
              Sort by:{" "}
              <span className="font-bold opacity-80 max-sm:text-xs">Recently Added</span>
            </p>
            <input
              className="border border-gray-300 rounded-sm text-sm w-48 h-8 px-2 outline-blue-500"
              type="text"
              placeholder="Search by name"
              name="search"
              onChange={handleSearch}
            />
          </div>
          <div className="tab flex gap-8 my-2">
            <h1
              className={`${
                selectedTab === "connected"
                  ? "text-md border-b-2 border-blue-600 text-blue-500 font-semibold max-sm:text-sm"
                  : "text-md cursor-pointer max-sm:text-sm"
              }`}
              onClick={() => setselectedTab("connected")}
            >
              Connected
            </h1>
            <h1
              className={`${
                selectedTab === "pending"
                  ? "text-md border-b-2 border-blue-600 text-blue-500 font-semibold max-sm:text-sm"
                  : "text-md cursor-pointer max-sm:text-sm"
              }`}
              onClick={() => setselectedTab("pending")}
            >
              Pending
            </h1>
          </div>
          {
          selectedTab === "pending" ? 
          pendingConnections
          .filter((item) => {
            return search.toLowerCase() === '' ? item : 
            item.user.fullname.toLowerCase().includes(search)
          }
          )
          .map((item) => {
            return (
              <>
                <div className="relative user-card flex gap-3 items-center w-4/4 mt-8">
                  <img
                    className="size-20 rounded-full max-sm:size-12"
                    src={`${item.user?.profilePicture}`}
                    alt=""
                  />
                  <div className="content flex w-full justify-between">
                    <div>
                    <h1 className="font-bold max-sm:text-sm">{item.user?.fullname}</h1>
                    <p className="text-md opacity-90 max-sm:text-xs">
                      {item.user?.description}
                    </p>
                    <p className="text-sm max-sm:text-xs opacity-60 font-semibold">{format(item.user?.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                  <button onClick={() => handleAccept(item.user?._id)} className=" bg-blue-600 rounded-full w-28 text-white h-8 font-semibold text-md font-outfit">
                    Accept
                  </button>
                  <button className="bg-red-600 rounded-full w-28 text-white h-8 font-semibold text-md font-outfit">
                    Reject
                  </button>

                  </div>

                </div>
                <hr className="mt-4" />
              </>
            );
          })
          :
          acceptedConnections
          .filter((item) => {
            return search.toLowerCase() === '' ? item : 
            item.user.fullname.toLowerCase().includes(search)
          }
          )
          .map((item) => {            
            return (
              <>
                <div className="relative user-card flex gap-3 items-center w-4/4 mt-8">
                  <img
                    className="size-12 rounded-full cursor-pointer max-sm:size-12"
                    src={`${item.user.profilePicture}`}
                    alt=""
                  />
                  <div className="content flex justify-between w-full">
                    <div>
                    <Link to={`/user/${item.user._id}`}>
                     <h1 className="font-bold cursor-pointer hover:underline hover:scale-105">{item.user.fullname}</h1>
                    </Link>
                    <p className="text-md opacity-90 max-sm:text-sm">
                      {item.user.description}
                    </p>
                    <p className="text-sm max-sm:text-xs">{format(item.user.createdAt)}</p>
                    </div>
                  </div>
                  <button className="absolute right-0 bg-red-600 rounded-xl w-28 text-white h-10 font-bold text-md font-outfit max-sm:hidden">
                    Remove
                  </button>
                  <i className="fa-solid fa-trash min-[640px]:hidden"></i>
                </div>
                <hr className="mt-4" />
              </>
            );
          })} 
        </div>
      )}
    </div>
  );
};

export default Connections;
