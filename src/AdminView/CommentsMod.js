import React, { useEffect, useState } from 'react';
import { useNavigate,Outlet } from 'react-router-dom';
import styles from './AdminViev.module.css';
import Sidebar from './Sidebar';
import { List } from 'react-window';

import { API_URL } from '../config.js';



//To zwykła funkcja JAVASCRIPT, nie można uzywac komponentów react tutaj
async function getPosts() {
  const response = await fetch(`${API_URL}/api/Posts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });


  if(!response.ok){
        console.log("${response.statusText}");

    throw new Error(`Fetch fail: ${response.statusText}`);
  }

  return await response.json();
}

//To zwykła funkcja JAVASCRIPT, nie można uzywac komponentów react tutaj
async function removeComment( postid, id ) {

      const token = JSON.parse(localStorage.getItem("token")).token;

  const response = await fetch(`${API_URL}/api/Posts/${postid}/comments/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${token}`
    }
  });


  if(!response.ok){
        console.log("${response.statusText}");

    throw new Error(`Fetch fail: ${response.statusText}`);
  }

  return true;
}


export default function CommentsMod() {
const navigate = useNavigate();

const [allComments, setAllComments] = useState([]);
const [posts, setPosts] = useState([]);

 


   useEffect(() => {
      getPosts()
        .then(data => {
        setPosts(data.$values || data)})
        .catch(err => console.error(err));
    }, []);


    useEffect(() => {
  async function load() {
    const comments = await getAllComments(posts);
    setAllComments(comments);
  }

  if (posts.length > 0) {
    load();
  }
}, [posts]);

  async function getAllComments(posts) {
  const results = await Promise.all(
    posts.map(async (post) => {
      const res = await fetch(
        `${API_URL}/api/Posts/${post.id}/comments`
      );

      if (!res.ok) return [];

      const data = await res.json();
return (data.$values || data).map(comment => ({
  ...comment,
  postId: post.id,
  postTitle: post.title
}));    })
  );

  // spłaszczamy tablicę
  return results.flat();
}



  // render pojedynczego elementu
//   const Row = ({ index, style, filteredPosts, navigate }) => {
//     const post = filteredPosts[index];

//     return(
//       // <div style={style} className={ styles.postItem}>
//         <div>
//         <h3>{post.title} - {post.authorLogin} </h3>

//  <div className={styles.tagsContainer}>
//         {post.tags?.map(tag => (
//           <span key={tag} className={styles.tag}>
//             #{tag}
//           </span>
//         ))}
//       </div>


//         <div
//       dangerouslySetInnerHTML={{
//         __html: post.contentSnippet
//       }}
//     />
//     <div className={styles.buttonContainer}>
    

//        <button 
//          className={styles.removeBtn}
//            onClick={async () =>  {
  
//      const confirmed = window.confirm(
//     "Czy na pewno chcesz usunąć ten komentarz?"
//   );

//   if (!confirmed) return;

//   try {
//     await removePost(post.id);

//     setPosts(prev =>
//       prev.filter(c => c.id !== post.id)
//     );

//   } catch(err) {
//     console.error(err);
//   }
// }}
//           >
//         Usuń Post
//       </button>

//       </div>
//       </div>
//     );

//   };


const Row = ({ index, style, allComments }) => {
  const comment = allComments[index];

  return (
    <div style={style} className={styles.postItem}>
      <h3>{comment.authorLogin} - {comment.createdAt}</h3>
      <h4>{comment.content}</h4>
      <button 
         className={styles.removeBtn}
           onClick={async () =>  {
  
     const confirmed = window.confirm(
    "Czy na pewno chcesz usunąć ten Komentarz?"
  );

  if (!confirmed) return;

  try {
    await removeComment(comment.postId, comment.id);

    setAllComments(prev =>
      prev.filter(c => c.id !== comment.id)
    );

  } catch(err) {
    console.error(err);
  }
}}
          >
        Usuń Komentarz
      </button>
    </div>
  );
};

  return (
    <div className={styles.dashboard}>
    <div className={styles.container}>
     {allComments.length === 0 ? (
             <p>Nikt jeszcze nie wysłał komentarza na stronie</p>
           ) : (
          <List
             rowComponent={Row}
       rowCount={allComments.length}
       rowHeight={150}
       height={200}
       width={200}
       rowProps={{ allComments, navigate }}
           />
           )}

      </div>

      </div>
  
  );
}