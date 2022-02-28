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

  useEffect(() => {
    
    if (!localStorage.getItem('accessToken')) {
      navigate('/login')
    } else {

    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });

   }
   // eslint-disable-next-line
}, [navigate, id]);

  const addComment = () => {
    // eslint-disable-next-line
    if (newComment != "") { 
      axios
      .post(
        "http://localhost:3001/comments",
        {
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
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
            id: response.data.id,
          };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
      

    }
    
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            // eslint-disable-next-line
            return val.id != id;
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/");
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter New Title:");
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
  
        setPostObject({ ...postObject, title: newTitle });
      }
    } else {
      let newPostText = prompt("Enter New Text:")
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
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            autoComplete="off"
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}> Add Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                <div>
                  <label>{comment.username} : </label>
                  {comment.commentBody}
                </div>
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