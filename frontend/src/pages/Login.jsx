import { useState, useEffect, useContext } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../context/UserContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import linkbridge_icon from '../assets/linkbridge-blue-logo.png'
const Login = () => {
  const {setUser, url } = useContext(UserContext);
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState("password");
  const [passwordText, setPasswordText] = useState("Show");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const toggleVisibility = () => {
    visibility === "password"
      ? setVisibility("text")
      : setVisibility("password");
    passwordText === "Show" ? setPasswordText("Hide") : setPasswordText("Show");
  };

  const handleChange = (event) => {
    setLoginData((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${url}/api/auth/login`,
        loginData,
      );
    setUser(response.data.user);

    localStorage.setItem("token", response.data.token)

    const { role, username } = response.data.user;
    navigate(`/${role.charAt(0).toLowerCase()}/${username}`)
    } catch (error) {
      toast.error('Error Occured', {
        position: 'bottom-left',
        autoClose: 2000, 
      })
    }
  };
  useEffect(() => {
    document.title = "LinkBridge - Login";
  }, []);

  return (
  <> 
  <div className="logo w-48 min-[640px]:hidden mt-6">
    <img src={linkbridge_icon} alt="" />
  </div>
    <div className="w-screen min-h-screen flex flex-col sm:flex-row font-poppins max-md:my-14">
  {/* Lottie Animation (Hidden on Small Screens) */}
  <div
    style={{ width: "44%" }}
    className="bg-cover bg-no-repeat min-h-screen hidden md:block"
  >
    <DotLottieReact
      src="https://lottie.host/373851f2-07dd-43d6-b994-0e6644efc368/XxcA0LG9Hi.lottie"
      loop
      autoplay
    />
  </div>

  {/* Login Section */}
  <div className="flex flex-col justify-center mx-auto gap-6 px-4 sm:px-0">
    <h2 className="text-2xl font-bold text-blue-600 text-center md:text-left">
      Login to Your Account
    </h2>
    <GoogleLogin
      width="400"
      logo_alignment="center"
      onSuccess={async (credentialRepsonse) => {
        const decode = jwtDecode(credentialRepsonse?.credential);
        loginData.email = decode.email;
        loginData.password = "1234";
        try {
          const response = await axios.post(
            `${url}/api/auth/googlelogin`,
            loginData
          );
          if (response.data.success) {
            const { role, username } = response.data.user;
            setUser(response.data.user);
            localStorage.setItem("token", response.data.token);
            navigate(`/${role.charAt(0).toLowerCase()}/${username}`);
          }
        } catch (error) {
          if (error.status === 409) {
            navigate("/signup");
          }
        }
      }}
      onError={() => {
        console.log("Login Failed");
      }}
    />

    <p className="or-line text-center sm:text-left">OR</p>

    <div className="input-fields flex flex-col gap-2">
      <label className="text-sm" htmlFor="email">Email address</label>
      <input
        className="w-full sm:w-96 border border-s-4 rounded-md h-10 p-3 outline-blue-600 text-sm"
        placeholder="example123@gmail.com"
        type="email"
        required
        onChange={handleChange}
        name="email"
        value={loginData.email}
      />
      <div className="mt-2 flex justify-between items-center pr-5">
        <label className="text-sm" htmlFor="password">Your password</label>
        <span className="flex gap-1 items-center text-sm">
          <i
            onClick={toggleVisibility}
            className={passwordText === "Hide" ? "text-xs fa-regular fa-eye-slash" : "text-xs fa-regular fa-eye"}
          ></i>
          <p onClick={toggleVisibility}>{passwordText}</p>
        </span>
      </div>
      <input
        className="w-full sm:w-96 border-s-4 border rounded-md h-10 p-3 text-sm outline-blue-600"
        placeholder="Password here"
        type={visibility}
        required
        onChange={handleChange}
        name="password"
        value={loginData.password}
      />
    </div>

    <div>
      <Link to="/forgot">
        <p className="text-end underline text-sm">Forgot your password?</p>
      </Link>
    </div>

    <button
      onClick={handleSubmit}
      className="bg-blue-600 w-44 rounded-full p-2 text-white"
    >
      Sign in
    </button>

    <Link to="/signup">
      <p className="text-sm">Don't have an account? Signup</p>
    </Link>
  </div>
</div>
</> 
  );
};

export default Login;
