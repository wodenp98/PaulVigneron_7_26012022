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
        "http://localhost:3001/auth/changepassword",
        {
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
          alert("mot de passe changé")
          navigate('/')
        }
      });
  };

  return (
    <div className="password">
      <h1>Change Your Password</h1>
    <div className="borderPassword">
      <input
        type="text"
        placeholder="Old Password..."
        onChange={(event) => {
          setOldPassword(event.target.value);
        }}
      />
      <input
        type="text"
        placeholder="New Password..."
        onChange={(event) => {
          setNewPassword(event.target.value);
        }}
      />
      <button onClick={changePassword} className="validateChanges"> Save Changes</button>
      </div>
    </div>
  );
}

export default ChangePassword;