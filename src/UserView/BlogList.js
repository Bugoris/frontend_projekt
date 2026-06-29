import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { List } from 'react-window';
import styles from './UserView.module.css';
import styles_star  from './Star.module.css';

import Select from 'react-select';

import { API_URL } from '../config.js';


//TODO
//FIltrowanie i wyszykiwanie postów
//Czy problemem w wymiarach listy jest CSS?

//To zwykła funkcja JAVASCRIPT, nie można uzywac komponentów react tutaj
async function getTags() {
  const response = await fetch(`${API_URL}/api/Tags`, {
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

export default function BlogList() {


   const [rating, setRating] = useState(0)
    let data = [1, 2, 3, 4, 5]

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');

  const [tags, setTags] = useState([]);
    const [selectedtags, setSelectedtags] = useState([]);

  useEffect(() => {
    getPosts()
      .then(data => {
      setPosts(data.$values || data)})
      .catch(err => console.error(err));
  }, []);

   useEffect(() => {
          getTags()
            .then(data3 => {
            setTags(data3.$values || data3)})
            .catch(err => console.error(err));
        }, []);
   

  const tagsSelect = tags.map(tag => ({
  value: tag.name,
  label: tag.name
}));

  const navigate = useNavigate();



  //Filtrowanie po wyszukiwaniu
const filteredPosts = posts.filter(post => {
  const matchesSearch =
    post.title?.toLowerCase().includes(search.toLowerCase()) ||
    post.contentSnippet?.toLowerCase().includes(search.toLowerCase());

  const postTags = post.tags?.map(tag =>
    typeof tag === "string" ? tag : tag.name
  ) || [];

  const matchesTags =
    selectedtags.length === 0 ||
    selectedtags.every(tag => postTags.includes(tag));

  return matchesSearch && matchesTags;
});




//Wyświetlanie gwiazdek
const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i}>
      {i < Math.round(rating) ? "★" : "☆"}
    </span>
  ));
};



  // render pojedynczego elementu
  const Row = ({ index, style, filteredPosts, navigate }) => {
    const post = filteredPosts[index];

    return(
      // <div style={style} className={ styles.postItem}>
        <div>
          <Link to={`/post/${post.id}`}
  className={styles.postItem}>
 <h3>
          {post.title} - {post.authorLogin}{" "}
          <span style={{ color: "goldenrod", marginLeft: 8 }}>
            {renderStars(post.averageRating || 0)}
          </span>
        </h3>
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
      
         {/* <button 
         className={styles.submitBtn}
          onClick={() => navigate(`/admin/posts/${post.id}`)}>
        Podgląd postu
      </button>

      <button 
         className={styles.editBtn}
          onClick={() => navigate(`/admin/posts/edit/${post.id}`)}>
        Edycja postu
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
      </button> */}

      </div>
      </Link>

      </div>
      
    );

  };

  return (
    <div className={styles.dashboard}>
      <h2>BLOG KULINARNY</h2>
     <div className={styles.filtersBar}>

  <div className={styles.filterGroup}>
    <label> Szukaj po nazwie</label>
    <input
      type="text"
      value={search}
      placeholder="Wpisz tytuł..."
      onChange={e => setSearch(e.target.value)}
    />
  </div>

  <div className={styles.filterGroup}>
    <label>Tagi</label>
    <Select
      isMulti
      options={tagsSelect}
      className={styles.reactSelect}
      classNamePrefix="react-select"
      onChange={(selected) => {
        setSelectedtags(selected.map(item => item.value));
      }}
    />
  </div>

</div>
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