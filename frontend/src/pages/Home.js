import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import CommentIcon from '@mui/icons-material/Comment';


function Home() {
  let { id } = useParams()
  // listes posts et likes
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([])
  const [comments, setComments] = useState([])
  
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
    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
    setComments(response.data)
}) 
  }
  }, [navigate, id]);

  

  console.log(comments.length)

  const dateParser = (num) => {
    let options = {hour:"2-digit", minute: "2-digit", second: "2-digit", weekday: "long", year:"numeric", month: "short", day:"numeric"}

    let timestamp = Date.parse(num)

    let date = new Date(timestamp).toLocaleDateString('fr-FR', options)

    return date.toString()
  }
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
        console.log(listOfPosts)
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
              <label>{dateParser(value.createdAt)}</label>
              
              <div className="buttons">
                <CommentIcon className="commentIcon"/>
                {value.Comments.length}
                <ThumbUpAltIcon className="thumbIcon"
                  onClick={() => {
                    likeAPost(value.id);
                  }}
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