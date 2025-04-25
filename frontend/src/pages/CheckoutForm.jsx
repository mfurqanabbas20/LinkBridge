import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'
import { PaymentElement, LinkAuthenticationElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
const CheckoutForm = ({amount, problemId, appliedUser}) => {
    const {url, user} = useContext(UserContext)
    const navigate = useNavigate()
    const stripe = useStripe()
    const elements = useElements()
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
    useEffect(() => {
      
        if(!stripe) return;
        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        )

        if(!clientSecret) return;

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch(paymentIntent.status){
                case 'succeeded':
                    setMessage("Payment Succeeded")
                    break
                case 'processing':
                    setMessage("Your payment is processing")
                    break
                case 'requires_payment_method':
                    setMessage("Your payment was not successful, please try again later")
                    break
                default:
                    setMessage('Something went wrong')
            }
        })

    }, [stripe])


    const handleSubmit = async (e) => {  
      console.log(appliedUser);
      
      e.preventDefault()
      console.log('Hello');
      if(!stripe || !elements) return
      setIsLoading(true)
      const {paymentIntent, error} = await stripe.confirmPayment({
        elements,
        confirmParams: {
            return_url: `https://linkbridgeweb.vercel.app//payment/successful/${problemId}/${appliedUser._id}`
        }
      })      
      
      if(error.type === 'card_error' || error.type === 'validation_error'){
        setMessage(error.message)
      } else {
        setMessage('Unexpected Error Occur')
      }

      setIsLoading(false)

    }

    const paymentElementOptions = {
        layout: 'tabs'
    }

    return(
      <div>
        <form id='payment-form' onSubmit={handleSubmit}>
          <LinkAuthenticationElement
          id='link-authentication-element'
          onChange={(e) => setEmail(e.target.value)}
          />
          <PaymentElement id='payment-elements' options={paymentElementOptions}  />
          <button className='mt-3 bg-blue-600 w-full text-white p-2 text-lg font-outfit font-semibold' disabled={isLoading || !stripe || !elements}>
            <span>
                {isLoading ? <div className="animate-spin"></div> : 'Pay now' }
            </span>
          </button>
        </form>
      </div>
    )
  }
  

export default CheckoutForm