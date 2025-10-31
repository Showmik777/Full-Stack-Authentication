import {Route,Routes} from "react-router-dom";
import './App.css';
import {ToastContainer} from "react-toastify";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import EmailVerify from "./pages/EmailVerify";
import ResatePassword from "./pages/ResatePassword";

function App() {
 
  return(
    <div>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<LogIn/>}/>
        <Route path="/email-verify" element={<EmailVerify/>}/>
        <Route path="/resate-password" element={<ResatePassword/>}/>
      </Routes>
    </div>
  )
}

export default App
