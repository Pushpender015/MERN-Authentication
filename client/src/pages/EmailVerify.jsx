import { React , useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function EmailVerify() {

  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const {backendURL , isLoggedin , userData , getUserData} = useContext(AppContext);

  const inputRefs = useRef([]);
  // it's just for moving automatically one to another input feild 
  const handleInput = (e , index) => {
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  // if buy mistake we go forward without using then come backward
  const handleKeyDown = (e ,index) => {
    if(e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  // handle paste feature of OTP
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char , index) => {
      if(inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate('/')
  } , [isLoggedin , userData, navigate])

  const OnSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)
      const OTP = otpArray.join('')

      const {data} = await axios.post(backendURL + '/api/auth/verify-account' , {OTP})

      if(data.success) {
        toast.success(data.message)
        getUserData()
        navigate('/')
      }
      else {
        toast.error(data.message)
      }
    }
    catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
            <img 
                onClick={() => navigate('/')}
                src={assets.logo}
                alt=''
                className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' 
            />

            <form onSubmit={OnSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
              <h1 className='text-white tex2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
              <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>
              <div onPaste={handlePaste} className="flex justify-between mb-8">
                {Array(6).fill().map((_, index) => (
                  <input 
                    text="text"
                    maxLength='1'
                    key={index} 
                    required
                    ref={e => inputRefs.current[index] = e}
                    onInput={(e) => handleInput(e , index)}
                    onKeyDown={(e) => handleKeyDown(e , index)}
                    className="w-12 h-12 bg-[#222A5C] text-white text-center text-xl rounded-md"
                  />
                ))}
              </div>

              <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-shadow-white rounded-full'>Verify Email</button>
            </form>
    </div>
  )
}

export default EmailVerify