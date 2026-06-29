import {React, useState, useEffect} from 'react';
import { useNavigate,Outlet, useParams } from 'react-router-dom';
import styles from './UserView.module.css';
import styles_star  from './Star.module.css';
import NavBar from './NavBar';

import { API_URL } from '../config.js';

import { useAuth } from '../contexts/AuthContext';


import { List } from 'react-window';

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
async function postComment( id ) {
           // const id = useParams();
  const token = JSON.parse(localStorage.getItem("token")).token;

  const response = await fetch(`${API_URL}/api/Posts/${id}/comments`, {
    method: 'POST',
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


  const [rating, setRating] = useState(0)
  let data = [1, 2, 3, 4, 5]


    const { id } = useParams();

    const [post, setPost] = useState(null);
    
    const [comments, setComments] = useState([]);
    
    const [tags, setTags] = useState([]);

    const [commentText, setCommentText] = useState('');

        const {user, isAuthenticated} = useAuth();
    
  console.log(user);

    const selectElements = tags.map(tag => <li>{}</li>);

    //Wyświetlanie gwiazdek
const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i}>
      {i < Math.round(rating) ? "★" : "☆"}
    </span>
  ));
};


      const navigate = useNavigate();
    
//Dodawanie komentarza

const submitComment = async () => {

  
  const token = JSON.parse(localStorage.getItem("token")).token;

  console.log(`${token}`) 

    const commentData = {
    content: commentText
  };

    console.log({
  commentText
});

try{
  const response = await fetch(`${API_URL}/api/Posts/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify(commentData)
    });

    if (!response.ok) {
      throw new Error('Login failed');
            console.error("error");

    }

     // Pobierz komentarze ponownie
    const commentsData = await getComments(id);
    setComments(commentsData.$values || commentsData);

    // Wyczyść textarea
    setCommentText('');

    const data = await response.json();
      console.log(data);



       } catch (error) {
      console.error(error);
    }
  };



  //Dodawanie oceny
  const submitRating = async () => {

  
  const token = JSON.parse(localStorage.getItem("token")).token;

  console.log(`${token}`) 

    const ratingValue = {
      value: rating
  };

    console.log({
  commentText
});

try{
  const response = await fetch(`${API_URL}/api/Posts/${id}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify(ratingValue)
    });

    if (!response.ok) {
      throw new Error('submit rating failed');
            console.error("error");

    }

   
    // Odświeżenie postu
    const updatedPost = await getPost(id);
    setPost(updatedPost.$values || updatedPost);


       } catch (error) {
      console.error(error);
    }
  };


        
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


   // render pojedynczego elementu
  const Row = ({ index, style, comments, navigate }) => {
    const comment = comments[index];

    return(
      <div style={style} className={ styles.postItem}>
        <h3> {comment.authorLogin} - {new Date(comment.createdAt).toLocaleDateString('pl-PL', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}</h3>
        <p>{comment.content}</p>
       {user?.username === comment.authorLogin && (
        <div>
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
       )}
      </div>
    );

  };

  return (
    <div className={styles.dashboard}>
      <button 
         className={styles.editBtn}
          onClick={() => navigate(`/`)}>
        Powrót do przeglądu
      </button>
    <div className={styles.hero}>
  <h1 className={styles.title}>{post.title}</h1>

  <div className={styles.rating}>
    <span className={styles.stars}>
      {renderStars(post.averageRating || 0)}
    </span>
    <span className={styles.ratingValue}>
      {post.averageRating?.toFixed(1)}
    </span>
  </div>
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

<h2>Tagi</h2>

<div className={styles.tags}>
    {post.tags?.map((tag, index) => (
        <span key={index} className={styles.tag}>
            {typeof tag === "string" ? tag : tag.name}
        </span>
    ))}
</div>
<div>
    {!(user?.username === post.authorLogin) && isAuthenticated && (
  <div>
    <h2>Podaj ocenę</h2>

    <div className={styles_star.stars}>
      {data.map((_, index) => {
        const starIndex = index + 1;

        return (
          <button className={styles_star.starbutton} key={starIndex} onClick={() => setRating(starIndex)}>
            {starIndex <= rating ? "★" : "☆"}
          </button>
        );
      })}
    </div>

    <button
      className={styles.submitBtn}
      onClick={() => submitRating()}
    >
      Wyślij ocenę
    </button>
  </div>
)}


{isAuthenticated && (
  <>
            <h3>Dodaj komentarz</h3>
 


<div className={styles.commentBox}>
  <label htmlFor="comment" className={styles.commentLabel}>
    Dodaj komentarz
  </label>

  <textarea
    id="comment"
    className={styles.textArea}
    value={commentText}
    onChange={(e) => setCommentText(e.target.value)}
    placeholder="Podziel się swoją opinią o przepisie..."
    rows={5}
    maxLength={500}
  />

  <div className={styles.commentFooter}>
    <span>{commentText.length}/500</span>

    <button
      className={styles.submitBtn}
      disabled={!commentText.trim()}
      onClick={submitComment}
    >
      Dodaj komentarz
    </button>
  </div>
</div>
</>
)
}
      <h2>Kometarze użytkowników</h2>
            {/* Problem jest w składni do tablicy */}
            {comments.length === 0 ? (
              <p>Nikt jeszcze nie skometował</p>
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