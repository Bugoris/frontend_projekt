import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List } from 'react-window';
import styles from './AdminViev.module.css';

import { API_URL } from '../config.js';

//TODO
//FIltrowanie i wyszykiwanie postów
//Czy problemem w wymiarach listy jest CSS?

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
//Jak brak aktualizacji widoku użytkonika to pewnie błąd z http response
async function removePost(id) {

    const token = JSON.parse(localStorage.getItem("token")).token;


  const response = await fetch(`${API_URL}/api/Posts/${id}`, {
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

export default function PostsHistory() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getPosts()
      .then(data => {
      setPosts(data.$values || data)})
      .catch(err => console.error(err));
  }, []);

  const navigate = useNavigate();

  //Filtrowanie po wyszukiwaniu
const filteredPosts = posts.filter(post =>
  post.title?.toLowerCase().includes(search.toLowerCase()) ||
post.contentSnippet?.toLowerCase().includes(search.toLowerCase()));

  
// Source - https://stackoverflow.com/a/70407580
// Posted by MWO
// Retrieved 2026-06-01, License - CC BY-SA 4.0

  // useEffect(() => {
  //   //Filter options updated so apply all filters here
  //   const result = array
  //     .filter((item) =>
  //       filterCategory.length ? filterCategory.includes(item.category) : item
  //     )
  //     .filter((data) =>
  //       filterPublished.length ? filterPublished.includes(data.published) : data
  //     );

  //   setFilteredArray(result);
  // }, [filterPublished, filterCategory]);


  // render pojedynczego elementu
  const Row = ({ index, style, filteredPosts, navigate }) => {
    const post = filteredPosts[index];

    return(
      // <div style={style} className={ styles.postItem}>
        <div>
        <h3>{post.title} - {post.authorLogin} </h3>

 <div className={styles.tagsContainer}>
        {post.tags?.map(tag => (
          <span key={tag} className={styles.tag}>
            #{tag}
          </span>
        ))}
      </div>


        <div
      dangerouslySetInnerHTML={{
        __html: post.contentSnippet
      }}
    />
    <div className={styles.buttonContainer}>
      
         <button 
         className={styles.submitBtn}
          onClick={() => navigate(`/admin/posts/${post.id}`)}>
        Podgląd postu
      </button>

   
       <button 
         className={styles.removeBtn}
           onClick={async () =>  {
  
     const confirmed = window.confirm(
    "Czy na pewno chcesz usunąć ten post?"
  );

  if (!confirmed) return;

  try {
    await removePost(post.id);

    setPosts(prev =>
      prev.filter(c => c.id !== post.id)
    );

  } catch(err) {
    console.error(err);
  }
}}
          >
        Usuń Post
      </button>

      </div>
      </div>
    );

  };

  return (
    <div className={styles.dashboard}>
      <h2>Przegląd Postów </h2>
      <label>
      <p> Wyszukuj posty</p> 
      <input 
           type="text"
  value={search}
  placeholder="Wpisz tytuł..."
  onChange={e => setSearch(e.target.value)}
          />
      </label>
      {/* Problem jest w składni do tablicy */}
      {filteredPosts.length === 0 ? (
        <p>Brak wyników</p>
      ) : (
     <List
        rowComponent={Row}
  rowCount={filteredPosts.length}
  rowHeight={200}
  height={200}
  width={200}
  rowProps={{ filteredPosts, navigate }}
      />
      )}

     
      
      
      {/* {posts.map(post => (
  <div key={post.id} className={styles.postItem}>
    <h3>{post.title}</h3>
    <p>{post.contentSnippet}</p>
  </div>
))} */}

    </div>
  );
}