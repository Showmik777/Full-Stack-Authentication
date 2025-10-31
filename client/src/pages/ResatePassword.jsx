import React, { useContext, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResatePassword = () => {

  const inputRef = useRef([]);
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);
  const [email,setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent , setIsEmailSent] = useState(false);
  const [otp,setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const {getUserData, isLoading, UserData, backendURL} = useContext(AppContext);

  axios.defaults.withCredentials=true;

  const heldelChange = (e,index)=>{
    const value = e.target.value.replace(/\D/,"");
    e.target.value = value;
    if(value && index<4){
      inputRef.current[index+1].focus();
    }
  }

  const handelKeyDown=(e,index)=>{
    if(e.key === "backspace" && !e.taget.value && index>0){
      inputRef.current[index-1].focus();
    }
  }

  const handlePaste = (e)=>{
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0,5).split("");
    paste.forEach((digit,i)=> {
      if(inputRef.current[i]){
        inputRef.current[i].value = digit;
      }
    });
    const next = paste.length<5? paste.length : 4;
    inputRef.current[next].focus();
  }

  const onSubmitEmail = async(e)=>{
   
    e.preventDefault();
    setLoading(true);
    try{
       
      const response = await axios.post(backendURL+"/send-reset-otp?email="+email);
      if(response.status === 200){
        toast.success("Password reset OTP send successfully.")
        setIsEmailSent(true);
      }else{
        toast.error("Somthing went wrong, plese try again.");
      }
    }catch(error){
      
      toast.error(error.message);
    }finally{
      setLoading(false)
    }
  }

  const handelVerify = ()=>{
   const otp = inputRef.current.map((input)=>input.value).join("");
   if(otp.length !== 5){
    toast.error("Please enter the all 5 digits of the OTP");
    return;
   }
   setOtp(otp);
   setIsOtpSubmitted(true);
  }

  const onSubmitNewPassword = async (e)=>{
    e.preventDefault();
    setLoading(true);
    try{
      const response = await axios.post(backendURL+"/reset-password", {email,otp,newPassword});
      if(response.status === 200){
        toast.success("password reset Successfully.");
        navigate("/login");
      }else{
        toast.error("Somthing West worng. Please try again")
      }
    }catch(error){
        toast.error(error.message);
      }finally{
        setLoading(false);
      }
  }

  return (
    <div className='email-verify-container d-flex align-items-center justify-content-center vh-100 position-relative'
    style={{background:"linear-gradient(90deg, #6a5af9, #8268f9)", border:"none"}}>

      <Link to="/" className='position-absolute top-0 p-4 start-0 d-flex align-items-center gap-2 text-decoration-none'>
      <img src={assets.logo_home} alt="logo" height={32} width={32} />
      <span className='fs-4 fw-semibold text-light'>Authify</span>
      </Link>

      {/* rest password card*/}
      {!isEmailSent && (
        <div className='rounded-4 p-5 bg-white text-center' style={{width:"100%", maxWidth:"400px"}}>
          <h4 className='mb-2'>Reset Password</h4>
          <p className='mb-4'>Enter your resgistered email address</p>
          <form onSubmit={onSubmitEmail} >
            <div className='input-group mb-4 bg-secondary  bg-opacity-10 rounded-pill'>
              <span className='input-grou-text bg-transparent border-0 ps-4'>
              
              </span>
              <input type="email" className='from-control bg-transparent border-0  ps- pe-4 rounded-end'
                placeholder='Enter email address'
                style={{height:'50px'}}
                onChange={(e)=>setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <button className='btn btn-primary w-100 py-2' type='submit' disabled={loading}>
              {loading? "Loading..." : "Submit"}
            </button>
          </form>
        </div>
        
        

        
      )} 
      {/*card for otp*/}

      
      {!isOtpSubmitted && isEmailSent && (<div className='p-5 rounded-4 shadow bg-white' style={{width:"400px"}}>
        <h4 className='text-center fw-bold mb-2'>Email Verify OTP</h4>
        <p className='text-center mb-4'>
          Enter the 5-digit code sent to your email
        </p>
        <div className='d-flex justify-content-between gap-2 mb-4 text-center text-white-50 mb-2'>
          {[...Array(5)].map((_,i)=>(
            <input key={i} type="text" maxLength={1} className='form-control text-center fs-4 otp-input'
            ref={(el)=>(inputRef.current[i] = el)}
            onChange={(e)=>heldelChange(e,i)}
            onKeyDown={(e)=>handelKeyDown(e,i)}
            onPaste={handlePaste}
            />
          ))}

        </div>
        <button className='btn btn-primary w-100 fw-semibold' disabled={loading} onClick={handelVerify}>
          {loading? "verifying..." : "Verify email"}
        </button>
      </div>
      )}
      {/* new password from */}
          
          {isOtpSubmitted && isEmailSent && (
            <div className="rounded-4 p-4 text-center bg-white" style={{width:"100%", maxWidth:"400px"}}>
              <h4>New Password</h4>
              <p className='mb-4'>Enter the new password below</p>
              <form onSubmit={onSubmitNewPassword}>
                <div className="input-group mb-4 bg-secondary bg-opacity-10 rounded-pill">
                  <span className='input-group-text bg-transparent border-0 ps-4'>
                    <i className='bi bi-person-fill-lock'></i>
                  </span>
                  <input type="password" className='form-control bg-transparent border-0 ps-1 pe-4 rounded-end'
                  style={{height:'50px'}}
                  onChange={(e)=> setNewPassword(e.target.value)}
                  value={newPassword}
                  required
                  />
                </div>
                <button type='submit' className='btn btn-primary w-100'disabled={isLoading}>
                  {loading? "Loading..." : "Submit"}
                </button>
              </form>
            </div>
          )}
      
    </div>
  )
}

export default ResatePassword
