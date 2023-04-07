import Chat from "./Chat";
import './styles/root.module.css';
import { createContext, useState, useEffect } from 'react';
import  {Navigate, BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import LoginComponent from "./LoginComponent";
import SignUpComponent from "./SignUpComponent";
import SuccessPage from "./SuccessPage";
import EmailVerifiyPage from "./EmailVerifiyPage";

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
        
          <Route path="/" element={loginState.isLogged ? <Navigate to="/chat" /> : <LoginComponent />}></Route>
          <Route path="/signup" element={loginState.isLogged ? <Chat /> : <SignUpComponent />}></Route>
          <Route path="/chat" element={loginState.isLogged ? <Chat /> : <Navigate to="/" />}></Route>
          <Route path="/success" element={<SuccessPage />}></Route>
          <Route path="/verify/:token" element={loginState.isLogged ?  <Navigate to="/" /> : <EmailVerifiyPage/>}></Route>
        </Routes>
   
      </BrowserRouter>
        
          )}
              
    </AuthContext.Provider>
  );
}

export default App;
