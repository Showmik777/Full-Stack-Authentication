import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets.js'
import axios from 'axios';
import { AppContext } from '../context/AppContext.jsx';
import { toast } from 'react-toastify';

const LogIn = () => {
  const [isCreateAccount,setIsCreateAccount] = useState(false);
  const [name,setName] = useState("");
  const [password,setPassword] = useState("");
  const [email,setEmail] = useState("");
  const [loading,setLoading] = useState(false);
  const {backendURL,setIsLoggedIn,getUserData} = useContext(AppContext);
  console.log('Backend URL :',backendURL);
  const navigation = useNavigate();

  const onSubmithandler = async(e)=>{
    e.preventDefault();
    axios.defaults.withCredentials = true;
    setLoading(true);
    try{
      if(isCreateAccount){
        //register Api
       const response = await axios.post(`${backendURL}/register`,{name,email,password});
       if(response.status === 202){
          navigation("/");
          toast.success("Account created successfully");
       }else{
        toast.error("Email already exists");
       }
      }else{
        //login Api
        const response = await axios.post(`${backendURL}/login`,{email,password});
        if(response.status === 200){
          setIsLoggedIn(true);
          getUserData();
          navigation("/")
          toast.success("Successfully")
        }else{
          toast.error("Email or password incorrect");
        }

      }
    }catch(error){
      toast.error(error.response?.data?.message || "Somthink went wrong");

    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="position-relative min-vh-100 d-flex justify-content-center align-items-center" 
    style={{background:"linear-gradient(90deg, #6a5af9, #8268f9)", border:"none"}}>

      <div style={{position:"absolute",top:"20px",left:"30px", display:"flex", alignItems:"center"}}>

          <Link to="/" style={{display:"flex",gap:5,alignItems:"center",fontWeight:"bold",fontSize:"24px",textDecoration:"none"}}>

                <img src={assets.logo_home} alt="logo" height={32} width={32} /> 

                <span className="fw-bold fs-4 text-light">Authify</span>          
          </Link>
      </div>

        <div className='card p-4' style={{maxWidth:"350px", width:"100%"}}>
            <h2 className='text-center mb-4'> {isCreateAccount? "Create Account":"Login"}</h2>
            
            <form onSubmit={onSubmithandler}>

              {
                isCreateAccount && (
                  <div className='mb-3'>
                  <label htmlFor="fullName" className='from-label'>Full Name</label> <br />
                  <input type="text" required placeholder='Enter name' className='from-control' id="fullName" 
                    onChange={(e)=> setName(e.target.value)}
                    value={name}
                  />
                  </div>
                )
              }

              <div className='mb-3'>
                <label htmlFor="email" className='from-label'>Email Id</label> <br />
                <input type="text" required placeholder='Enter Email' className='from-control' id="email"
                  onChange={(e)=> setEmail(e.target.value)}
                  value={email}
                />
              </div>

              <div className='mb-3'>
                <label htmlFor="password" className='from-label'>Password</label><br />
                <input type="password" required placeholder='password' className='from-control' id="password" 
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                />
              </div>

              <div className='d-flex justify-content-between mb-3'>
                <Link to="/resate-password" className='text-decoration-none'>
                {isCreateAccount? "" :"Forgot password?"}
                </Link>
              </div>
                <button typr="submit" className='btn btn-primary w-100' disabled={loading}>
                  {loading? "Loading...":isCreateAccount? "Sign Up" :"Login"}
                </button>
            </form>
            <div className='text-center mt-3'>
              <p className='mb-0'>{
                
                isCreateAccount ? 
                (<>
                  Already have an account?{" "}
                  <span onClick={()=> setIsCreateAccount(false)} className='text-decoration-underline' style={{cursor:"pointer"}}>
                    Login here
                  </span>
                </>): (
                  <>
                    Don't have an account?{" "}
                    <span onClick={()=> setIsCreateAccount(true)} className='text-decoration-ubderline' style={{cursor:"pointer"}}>
                      Sign Up
                    </span>
                  </>
                )

                }</p>
            </div>
        </div>

    </div>
  )
}

export default LogIn
