import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import {jwtDecode} from 'jwt-decode'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import linkbridge_icon from '../assets/linkbridge-blue-logo.png'

const Signup = () => {

  const navigate = useNavigate()
  
  const [visibility, setVisibility] = useState("password");
  const [passwordText, setPasswordText] = useState("Show");

  const toggleVisibility = () => {
    visibility === "password"
      ? setVisibility("text")
      : setVisibility("password");
    passwordText === "Show" ? setPasswordText("Hide") : setPasswordText("Show");
  };

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
      navigate('/signup/details', {state: {signupData}})
    
  };

  const handleChange = (event) => {
    setSignupData((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });
  };

  useEffect(() => {
    document.title = "LinkBridge - Signup";
  }, []);
  
  return (
  <>  
    <div className="logo w-48 min-[640px]:hidden mt-6">
      <img src={linkbridge_icon} alt="" />
    </div>
    <div className="w-screen min-h-screen flex flex-col sm:flex-row font-poppins max-md:my-14">
      <div
        style={{width: "44%" }}
        className="bg-contain max-md:hidden"
      >
         <DotLottieReact
      src="https://lottie.host/852bad51-1253-48fb-9344-a22815ea2fad/OVB26G5kmS.lottie"
      loop
      autoplay
    />
      </div>
      <div className="flex flex-col justify-center mx-auto gap-6 px-4 md:my-4">
      <h2 className="text-2xl font-bold text-blue-600 max-md:text-center">Register Now</h2>
        <GoogleLogin text="signup_with" width="400" logo_alignment="center" onSuccess={(credentialRepsonse) => {
          const decode = jwtDecode(credentialRepsonse?.credential)
          signupData.username = decode.email.replace('@gmail.com', ''),
          signupData.email = decode.email
          signupData.password = decode.email.replace('@gmail.com', '')
          // it will your name not including father name so we add js function
          // it will remove @gmail.com from user email     
          navigate('/signup/details',{state: {signupData}})
        }}
        onError={() => {
          console.log('Login Failed');
        }}
         />
        <p className="or-line">OR</p>

        <div className="input-fields flex flex-col gap-2">
          <label className="text-sm" htmlFor="email">User name</label>
          <input
            className="w-96 border border-s-4 rounded-md h-10 p-3 outline-blue-600 text-sm"
            type="text"
            required
            onChange={handleChange}
            name="username"
            value={signupData.username}
            placeholder="example_123"
          />
          <label className="text-sm" htmlFor="email">Email address</label>
          <input
            className="w-96 border border-s-4 rounded-md h-10 p-3 outline-blue-600 text-sm"
            type="email"
            required
            onChange={handleChange}
            name="email"
            value={signupData.email}
            placeholder="example123@gmail.com"
          />
          <div className="mt-2 flex justify-between items-center">
            <label className="text-sm" htmlFor="password">Your password</label>
            <span className="flex gap-1 items-center pr-5 text-sm">
              <i
                onClick={toggleVisibility}
                className={
                  passwordText === "Hide"
                    ? "text-sm fa-regular fa-eye-slash"
                    : "text-sm fa-regular fa-eye"
                }
              ></i>
              <p onClick={toggleVisibility}>{passwordText}</p>
            </span>
          </div>
          <input
            className="w-96 border border-s-4 rounded-md h-10 p-3 outline-blue-600 text-sm"
            type={visibility}
            required
            onChange={handleChange}
            name="password"
            value={signupData.password}
            placeholder="secret_password"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 w-44 rounded-full p-2 text-white"
        >
          Sign up
        </button>
        <Link to="/login">
          <p className="text-sm">Already have an account? Login</p>
        </Link>

        {/* signup right ends here */}
      </div>
    </div>
  </>
  );
};

export default Signup;
