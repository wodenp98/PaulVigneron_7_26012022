import React, {useState , useContext} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext} from '../helpers/AuthContext';


function Login() {

  // crée 2 states 
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setAuthState} = useContext(AuthContext) 

    let navigate = useNavigate()
    const login = () => {
      // contient les données du formulaires
        const data = { username: username, password: password };
        axios.post("http://localhost:3001/auth/login", data).then((response) => {
          // erreur
          if (response.data.error) {
            alert(response.data.error);
          } else {
            // récupère les infos depuis les routes
            localStorage.setItem("accessToken", response.data.token);
            // authState met à jour l'username, id , et le status
            setAuthState({
              username: response.data.username,
              id: response.data.id,
              status: true,
              isAdmin: response.data.isAdmin,
            });
            // page post
            navigate("/");
          }
        });
      };

  return (
      <div className='loginContainer'>
          <label>Pseudo: </label>
          <input type="text" 
          onChange={(event) => {
            // modifie le state avec la valeur du form
              setUsername(event.target.value);
              }}
             />
          <label>Mot de passe: </label>   
          <input type="password" 
          onChange={(event) => {
              setPassword(event.target.value);
          }}
          
          />
          
          <button onClick={login}>Se connecter</button>
      </div>
  )
}

export default Login;
