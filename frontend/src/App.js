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
import PostAddIcon from '@mui/icons-material/PostAdd';


function App() {
  // Un utilisateur est il connecté?
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
    isAdmin: false,
  });



  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/verify", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      // si le token n'est pas validé ou l'utilisateur n'est pas vérifié = erreur
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          // Sinon il est correctement authentifié
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
            isAdmin: response.data.isAdmin,
          });
        }
      });
 // eslint-disable-next-line
 }, []);

//  Se déconnecter
  const logout = () => {
    // On supprime l'access token du loccal storage on met à jour le status et on recharge la page
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false, isAdmin: false });
    window.location.reload()
  };

  
  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <div className="links">
              {!authState.status ? (
                // Lien vers les pages si auth est false
                <>
                  <Link to="/login"> 
                    <img  src={ Groupomania } alt="Logo de Groupomania" className='Logo'/>
                  </Link>
                  <Link to="/registration">S'inscrire</Link>
                </>
              ) : (
                // Si auth state est true
                <>
                  <Link to="/"> 
                    <img  src={ Groupomania } alt="Logo de Groupomania" className='Logo'/>
                  </Link>
                  <Link to="/createpost"><PostAddIcon/></Link>               
                </>
              )}
            </div>
            <div className="loggedInContainer">
              <Link to={`/profile/${authState.id}`}>
                <h1>{authState.username}</h1>
              </Link>
              {authState.status && 
               <LogoutIcon className='LogoutIcon'
               onClick={logout}    
               />}
            </div>
          </div>
          {/* Affiche les pages par routes */}
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
