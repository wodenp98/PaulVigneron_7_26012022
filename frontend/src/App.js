import './sass/main.css'
import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile"
import ChangePassword from "./pages/ChangePassword"
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import Groupomania from "./groupomania.png";


function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });



  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
 // eslint-disable-next-line
 }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
    window.location.reload()
  };

  
  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <div className="links">
              {!authState.status ? (
                <>
                  <Link to="/login"> 
                    <img  src={ Groupomania } alt="Logo de Groupomania" className='Logo'/>
                  </Link>
                  <Link to="/registration"> Registration</Link>
                </>
              ) : (
                <>
                  <Link to="/"> 
                    <img  src={ Groupomania } alt="Logo de Groupomania" className='Logo'/>
                  </Link>
                  <Link to="/createpost"> Create A Post</Link>               
                </>
              )}
            </div>
            <div className="loggedInContainer">
              
                <h1>{authState.username}</h1>
    

              {authState.status && 
               <LogoutIcon className='LogoutIcon'
               onClick={logout}    
               />}
            </div>
          </div>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/createpost" element={<CreatePost/>} />
            <Route path="/post/:id"element={<Post/>} />
            <Route path="/registration" element={<Registration/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/profile/:id" element={<Profile/>} />
            <Route path="/changepassword" element={<ChangePassword/>} />
            <Route path="*" element={<PageNotFound/>} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
