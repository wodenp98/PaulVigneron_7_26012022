import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Profile() {
  // récupère l'id de l'url
  let { id } = useParams();
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState, setAuthState } = useContext(AuthContext);

  useEffect(() => {

    if (!localStorage.getItem('accessToken')) {
      navigate('/login')
    } else {
      // récupère username et le rajoute au state
    axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((response) => {
      setUsername(response.data.username);
    });
    // récupère les posts qui appartiennent au profil et rajoute au state
    axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((response) => {
      setListOfPosts(response.data);
    });

    }
  // eslint-disable-next-line
  }, [navigate, id]);

  // supprime un compte avec son id
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
        {/* affiche l'option de changer de  mot de passe si l'utilisateur du profil est celui qui est sur la page*/}
        {authState.username === username && (authState.isAdmin === false) && (
        <>
          <button className="changePassword"
            onClick={() => {
              // redirige vers la page pour modifier son mot de passe
              navigate("/changepassword");
            }}
          >
            Changez votre mot de passe
          </button>

          
          <button className="deleteButton"
            onClick={() => {
              deleteAccount(id);
            }}
          >
            Supprimer votre compte
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
								Changez votre mot de passe
							</button>
						)}

						<button className="deleteButton"
						onClick={() => {
							deleteAccount(id)
						}}
						>
							Supprimez votre compte
						</button>
					</>
				)}
      </div>
      <div className="listOfPosts">
        {/* affiche tout les posts de l'user */}
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
                <div className="text">
                    {value.postText}
                </div>
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