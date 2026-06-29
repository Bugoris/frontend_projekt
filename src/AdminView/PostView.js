import {React, useState, useEffect} from 'react';
import { useNavigate,Outlet, useParams } from 'react-router-dom';
import styles from './AdminViev.module.css';
import Sidebar from './Sidebar';

import styles_star  from '../UserView/Star.module.css';


import { List } from 'react-window';
import { API_URL } from '../config.js';

//NOTATKA: Jeżeli nie dizałą usuawanie komentarzy to sprawdź czy jestem zalogowany jako admin

//To zwykła funkcja JAVASCRIPT, nie można uzywac komponentów react tutaj
async function getPost( id ) {
           // const id = useParams();

  const response = await fetch(`${API_URL}/api/Posts/${id}`, {
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
           // const id = useParams();
  const token = JSON.parse(localStorage.getItem("token")).token;

  const response = await fetch(`${API_URL}/api/Posts/${postid}/comments/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${token}`

    }
  });


  if(!response.ok){
        console.log(`${response.statusText}`);

    throw new Error(`DELETE fail: ${response.statusText}`);
  }

  return true;
}


//To zwykła funkcja JAVASCRIPT, nie można uzywac komponentów react tutaj
async function getComments( id ) {
           // const id = useParams();

  const response = await fetch(`${API_URL}/api/Posts/${id}/comments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });


  if(!response.ok){
        console.log("${response.statusText}");

    throw new Error(`Fetch fail: ${response.statusText}`);
  }

if (response.status === 204) {
  return true;
}

return await response.json();}



export default function PostView() {
    const { id } = useParams();

    const [post, setPost] = useState(null);
    
    const [comments, setComments] = useState([]);
    
    const [tags, setTags] = useState([]);


    const selectElements = tags.map(tag => <li>{}</li>);


      const navigate = useNavigate();
    
        
    useEffect(() => {
        getPost(id)
          .then(data => {
          setPost(data.$values || data)})
          .catch(err => console.error(err));
      }, []);


      useEffect(() => {
          getComments(id)
            .then(data2 => {
            setComments(data2.$values || data2)})
            .catch(err => console.error(err));
        }, [id]);

       

   if (!post) return <p>Ładowanie...</p>;

   const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i}>
      {i < Math.round(rating) ? "★" : "☆"}
    </span>
  ));
};


   // render pojedynczego elementu
  const Row = ({ index, style, comments, navigate }) => {
    const comment = comments[index];

    return(
      <div style={style} className={ styles.postItem}>
        <h3> {comment.authorLogin} - {comment.createdAt}</h3>
        <p>{comment.content}</p>
         <button 
         className={styles.removeBtn}
           onClick={async () =>  {
  
     const confirmed = window.confirm(
    "Czy na pewno chcesz usunąć ten komentarz?"
  );

  if (!confirmed) return;

  try {
    await removeComment(id ,comment.id);

    setComments(prev =>
      prev.filter(c => c.id !== comment.id)
    );

  } catch(err) {
    console.error(err);
  }
}}
          >
        Usuń komentarz
      </button>
      </div>
    );

  };

  return (
    <div className={styles.dashboard}>
      <button 
         className={styles.editBtn}
          onClick={() => navigate(`/admin/posts/`)}>
        Powrót do przeglądu
      </button>
     <div className={styles.hero}>
  <h1 className={styles.title}>Tytuł artykułu: {post.title}</h1>

  
</div>

<p>
  <strong>Autor:</strong> {post.authorLogin}
</p>

<p>
  <strong>Czas przygotowania:</strong> {post.preparationTime} min
</p>

<h2>Składniki</h2>

<ul>
    {post.ingredients?.map((ingredient, index) => (
        <li key={index}>
            {ingredient.quantity} {ingredient.unit} {ingredient.name}
        </li>
    ))}
</ul>

<h2>Sposób przygotowania</h2>

   <div
  dangerouslySetInnerHTML={{
    __html: post.preparationMethod
  }}
/>

<div>
      <h2>Lista - Kometarze </h2>
            {/* Problem jest w składni do tablicy */}
            {comments.length === 0 ? (
              <p>Nikt jeszcze nie skomentował</p>
            ) : (
           <List
              rowComponent={Row}
        rowCount={comments.length}
        rowHeight={120}
        height={500}
        width={800}
        rowProps={{ comments, navigate }}
            />
            )}


    </div>
    </div>
  );
}