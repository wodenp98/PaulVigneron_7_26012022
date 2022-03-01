import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import BackspaceIcon from '@mui/icons-material/Backspace';

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  let navigate = useNavigate();

  // se lance quand on render la page
  useEffect(() => {
    
    if (!localStorage.getItem('accessToken')) {
      navigate('/login')
    } else {
      // récupère le post grâce a l'id
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    // récupère commentaire lié à un post
    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });

   }
   // eslint-disable-next-line
}, [navigate, id]);


  // ajout d'un commentaire
  const addComment = () => {
    // eslint-disable-next-line
    if (newComment != "") { 
      axios
      .post(
        "http://localhost:3001/comments",
        {
          // rajoute le nouveau commentaire et l'id du post au body
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          // Objet contenant le nouveau commentaire
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
            id: response.data.id,
          };
          setComments([...comments, commentToAdd]);
          // réinitialise l'input
          setNewComment("");
        }
      });
      

    }
    
  };

  // supprime un commmentaire
  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        // rajoute id dans la requete axios
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        // filtre les commentaires
        setComments(
          comments.filter((val) => {
            // eslint-disable-next-line
            return val.id != id;
          })
        );
      });
  };

  // supprime un post lorsque l'id correspond
  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/");
      });
  };

  // Modifier un post
  const editPost = (option) => {
    // modifie le titre
    if (option === "title") {
      let newTitle = prompt("Nouveau titre:");

      // le titre ne peut pas etre null
      // eslint-disable-next-line
      if (newTitle != undefined && newTitle != "") {
        axios.put(
          "http://localhost:3001/posts/title",
          {
            newTitle: newTitle,
            id: id,
          },
          {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }
        );
          // garde le corps mais on modifie le titre
        setPostObject({ ...postObject, title: newTitle });
      }
    }
    // modifie le corps du post
    else {
      let newPostText = prompt("Nouveau post:")
      // eslint-disable-next-line
      if (newPostText != undefined && newPostText != "") {
        axios.put(
          "http://localhost:3001/posts/postText",
          {
            newText: newPostText,
            id: id,
          },
          {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }
        );
  
        setPostObject({ ...postObject, postText: newPostText });
      }

      }
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div
            className="title"
            onClick={() => {
              // seulement si la personne en est l'auteur
              if ((authState.username === postObject.username)  || (authState.isAdmin === true)) {
                editPost("title");
              }
            }}
          >
            {postObject.title}
          </div>
          <div
            className="body"
            onClick={() => {
              if ((authState.username === postObject.username)  || (authState.isAdmin === true)) {
                editPost("body");
              }
            }}
          >
            <div className="text">
              {postObject.postText}
            </div>
            {postObject.imageUrl && <img src={`../${postObject.imageUrl}`} className="imagePost" alt="" /> }
          </div>
          <div className="footer">
            {postObject.username}
            {((authState.username === postObject.username)  || (authState.isAdmin === true)) && (
              <BackspaceIcon className="deleteIcon"
              onClick={() => {
                deletePost(postObject.id);
              }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        {/* ajout d'un commentaire */}
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Nouveau Commentaire"
            autoComplete="off"
            value={newComment}
            // récupère le commentaire et le modifie dans le state
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}>Ajouter un commentaire</button>
        </div>
        <div className="listOfComments">
          {/* afficher tout les commentaires grace a map */}
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                <div>
                  <label>{comment.username} : </label>
                  {comment.commentBody}
                </div>
                {/* icon delete si l'utilisateur en est le créateur */}
                {((authState.username === comment.username) || (authState.isAdmin === true)) && (
                  <BackspaceIcon className="deleteIcon"
                  onClick={() => {
                    deleteComment(comment.id);
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;