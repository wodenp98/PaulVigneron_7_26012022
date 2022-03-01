import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'


function Home() {
  // listes posts et likes
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([])
  
  let navigate = useNavigate();

  useEffect(() => {

    // Si accessToken est false --> page login
    if (!localStorage.getItem("accessToken")) {
      navigate('/login')
    } else {
      // On récupère les posts
    axios.get("http://localhost:3001/posts", {
      headers: { accessToken: localStorage.getItem("accessToken")}
    }).then((response) => {
      // Modifie les states avec la base de données
      setListOfPosts(response.data.listOfPosts);
      // Map à travers l'objet pour retourner les likes
      setLikedPosts(response.data.likedPosts.map((like) => {
        return like.PostId
      }));
    });
  }

  }, [navigate]);

  // Like un post 
  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        // body avec le postId
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      // On récupère la réponse
      .then((response) => {
        setListOfPosts(
          // Map à travers tout les posts
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } 
              // on supprime le like du tableau
              else {
                // variables le tableau de likes
                const likesArray = post.Likes;
                // supprime le dernier élément avec pop
                likesArray.pop();
                // retourne l'ancien post avec le nouveau tableau de likes
                return { ...post, Likes: likesArray };
              }
            } else {
              // post sans modification
              return post;
            }
          })
        );

        if (likedPosts.includes(postId)) {
          // filtrer likedPost avec les id
          setLikedPosts(likedPosts.filter((id) => {
            // eslint-disable-next-line
            return id != postId;
          }))
        } 
        // rajoute le nouveau post id 
        else {
          setLikedPosts([...likedPosts, postId])
        }
      });
  };

  return (
    <div>
      {/* map pour afficher le post */}
      {listOfPosts.map((value, key) => {
        return (
          <div key={key} className="post">
            <div className="title"> {value.title} </div>
            {/* redirige vers la page du post */}
            <div
              className="body"
              onClick={() => {
                navigate(`/post/${value.id}`);
              }}
            > 
            <div className="text">
              {value.postText}
            </div>
              {value.imageUrl != null && <img src={value.imageUrl} className="imagePost" alt="" />}
            </div>
            <div className="footer">
              <div className="username"><Link to ={`/profile/${value.UserId}`}>{value.username}</Link>
              </div>
              <div className="buttons">
                <ThumbUpAltIcon
                  onClick={() => {
                    likeAPost(value.id);
                  }}
                  className={
                    likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                  }
                />
                {/* nombre de likes */}
                <label> {value.Likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;