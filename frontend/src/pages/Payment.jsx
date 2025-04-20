import React, { useState, useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import UserContext from "../context/UserContext";
import logo from '../assets/lognew.png'
import {useStripe, useElements, CardElement, Elements} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe("pk_test_51QvGSaJ8iq0MncB6qOkdnUn0ojnn0cH0CgsZQ6cLRZGpOmp5wgwxkBPx8CWHvdtw9DLaT5kQ5dZ6q61hC2RplcwK00rsCvHMHb")


const Payment = () => {
  const {url} = useContext(UserContext)
  const params = useParams()
  const location = useLocation()
  const token = localStorage.getItem("token")

  const [clientSecret, setClientSecret] = useState('')
  const [problem, setProblem] = useState(null)
  // state refers to problem
  const appliedUser = location.state
  const problemId = params.id
    
  const fetchProblem = async () => {
    try {
      const response = await axios.get(`${url}/api/industry/single-idea/${problemId}`)
      console.log(response);
      setProblem(response.data.problem)     
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {    
    fetchProblem()
  }, [])

  useEffect(() => {
    makeIntentRequest()
  }, [problem])
  

  const makeIntentRequest = async () => {    
    const response = await axios.post(`${url}/api/industry/payment/create-payment-intent/${problem.budget}`,{}, {headers: {token}})
    setClientSecret(response.data.clientSecret)
  }

  const appearence = {
    theme: 'stripe', 
  }
  
  const options = {
    clientSecret,
    appearence
  }

  return (
    <div className="w-screen">
      <Navbar />
      <div className="flex flex-col items-center mt-12">
        <h1 className="font-poppins font-bold text-xl text-gray-800 mb-2">Please complete the payment process</h1>
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm problemId={problemId} appliedUser={appliedUser.userId}/>
          </Elements>
        )}
      </div>
    </div>
  );
};

export default Payment;
