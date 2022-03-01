import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  let navigate = useNavigate()
  
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate('/login')
    } 
  }, [navigate])

  const changePassword = () => {
    axios
      .put(
        // axios permet la modification
        "http://localhost:3001/auth/changepassword",
        {
          // body ancien et nouveau mot de passe
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          // Si tout est validé on est redirigé vers la page d'accueil
          alert("mot de passe changé")
          navigate('/')
        }
      });
  };

  return (
    <div className="password">
      <h1>Changez votre mot de passe</h1>
    <div className="borderPassword">
      <input
        type="text"
        placeholder="Ancien mot de passe"
        onChange={(event) => {
          // Met à jour le state de l'ancien mot de passe
          setOldPassword(event.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Nouveau mot de passe"
        onChange={(event) => {
          // Met à jour le state du nouveau mot de passe
          setNewPassword(event.target.value);
        }}
      />
      <button onClick={changePassword} className="validateChanges">Enregistrer</button>
      </div>
    </div>
  );
}

export default ChangePassword;