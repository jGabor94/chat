import Chat from "./ChatApp/Chat";
import './styles/root.module.css';
import { createContext, useState, useEffect } from 'react';
import  {Navigate, BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import LoginComponent from "./LoginComponent";
import SignUpComponent from "./SignUpComponent";
import SuccessPage from "./SuccessPage";
import EmailVerifiyPage from "./EmailVerifiyPage";
import Dashboard from "./Dashboard";
import Profile from "./ProfilePage/Profile";
import PasswordRequest from "./ForgotPassword/PasswordRequest";
import PasswordChange from "./ForgotPassword/PasswordChange";

export const AuthContext = createContext()

function App() {

  const [loginState, setLoginState] = useState(false)

  useEffect(() => {

    axios.get(`/auth/userverify`, {withCredentials: true})
    .then((res) => {
      setLoginState({...res.data, isLogged: true})
    }).catch(() => setLoginState({isLogged: false}))
    
  }, [])

  return (

    <AuthContext.Provider value={{loginState, setLoginState}}>
      {!loginState ? (<></>) : (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={loginState.isLogged ? <Dashboard /> : <LoginComponent />}></Route>
          <Route path="/signup" element={loginState.isLogged ? <Chat /> : <SignUpComponent />}></Route>
          <Route path="/chatApp" element={loginState.isLogged ? <Chat /> : <Navigate to="/" />}></Route>
          <Route path="/success" element={<SuccessPage />}></Route>
          <Route path="/verify/:token" element={loginState.isLogged ?  <Navigate to="/" /> : <EmailVerifiyPage/>}></Route>
          <Route path="/profile" element={loginState.isLogged ? <Profile /> : <Navigate to="/" />}></Route>
          <Route path="/password-reset/request" element={loginState.isLogged ? <Navigate to="/" /> : <PasswordRequest />}></Route>
          <Route path="/password-reset/change/:token" element={loginState.isLogged ? <Navigate to="/" /> : <PasswordChange />}></Route>
        </Routes>
   
      </BrowserRouter>
        
          )}
              
    </AuthContext.Provider>
  );
}

export default App;
