import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Profile() {
  let { id } = useParams();
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState, setAuthState } = useContext(AuthContext);

  useEffect(() => {

    if (!localStorage.getItem('accessToken')) {
      navigate('/login')
    } else {
    axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((response) => {
      setUsername(response.data.username);
    });

    axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((response) => {
      setListOfPosts(response.data);
    });

    }
  // eslint-disable-next-line
  }, [navigate, id]);

  const deleteAccount = () => {
		axios
			.delete(`http://localhost:3001/auth/deleteUser/${id}`, {
				headers: { accessToken: localStorage.getItem('accessToken') },
			})
			.then(() => {
        alert('account delete')

        // eslint-disable-next-line
        if(authState.id != 1) {
          localStorage.removeItem('accessToken')
				  setAuthState({ username: '', id: 0, status: false, isAdmin: false })
				  navigate('/login')
        } else {
          navigate('/')
        }	
			})
	}


  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        <h1> {username} </h1>
        {authState.username === username && (authState.isAdmin === false) && (
        <>
          <button className="changePassword"
            onClick={() => {
              navigate("/changepassword");
            }}
          >
            Change My Password
          </button>

          
          <button className="deleteButton"
            onClick={() => {
              deleteAccount(id);
            }}
          >
            Delete account
          </button>
        </>
        )}

        {(authState.isAdmin === true) && (
					<>
						{authState.username === username && (
							<button
								onClick={() => {
									// Redirge vers la page changepassword
									navigate('/changepassword')
								}}
							>
								Change My Password
							</button>
						)}

						<button
						onClick={() => {
							deleteAccount(id)
						}}
						>
							Delete account
						</button>
					</>
				)}
      </div>
      <div className="listOfPosts">
        {listOfPosts.map((value, key) => {
          return (
            <div key={key} className="post">
              <div className="title"> {value.title} </div>
              <div
                className="body"
                onClick={() => {
                  navigate(`/post/${value.id}`);
                }}
              >
                {value.postText}
                {value.imageUrl && <img src={`../${value.imageUrl}`} className="imagePost" alt="" />}
              </div>
              <div className="footer">
                <div className="username">{value.username}</div>
                <div className="buttons">
                  <label> {value.Likes.length}</label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;