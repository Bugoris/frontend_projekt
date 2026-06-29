import { React, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { API_URL } from '../config.js';


import styles from './AdminViev.module.css';
// import select_styles from './ReactSelect.module.css';

import { useState } from 'react';


import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import '@ckeditor/ckeditor5-build-classic/build/translations/pl';

//To zwykła funkcja JAVASCRIPT, nie można uzywac komponentów react tutaj
async function getTags() {
  const response = await fetch(`${API_URL}/api/tags`, {
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


//NOTATKA: Jeżeli nie dizałą usuawanie komentarzy to sprawdź czy jestem zalogowany jako admin

//To zwykła funkcja JAVASCRIPT, nie można uzywac komponentów react tutaj
async function editPost( id ) {
           // const id = useParams();

 const token = JSON.parse(localStorage.getItem("token")).token;


  const response = await fetch(`${API_URL}/api/Posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${token}`
    }
  });


  if(!response.ok){
        console.log("${response.statusText}");

    throw new Error(`Fetch fail: ${response.statusText}`);
  }

  return await response.json();
}


export default function PostEditView() {

  const navigate = useNavigate();

 const [post, setPost] = useState(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedtags, setSelectedtags] = useState([]);

const { id } = useParams();

const submitPost = async (e) => {

  e.preventDefault();
  const token = JSON.parse(localStorage.getItem("token")).token;

  console.log(`${token}`) 

    const postData = {
      title,
      content,
      tags: selectedtags
    };

    console.log({
  title,
  content,
  selectedtags
});

try{
  const response = await fetch(`${API_URL}/api/Posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      throw new Error('Login failed');
            console.error("error");

    }

    const data = await response.json();
      console.log(data);

      navigate('/admin/posts');
       } catch (error) {
      console.error(error);
    }
  };


 

 
  useEffect(() => {
        getTags()
          .then(data3 => {
          setTags(data3.$values || data3)})
          .catch(err => console.error(err));
      }, []);


           
        useEffect(() => {
  getPost(id)
    .then(data => {
      const postData = data.$values || data;

      setPost(postData);
      setTitle(postData.title);
      setContent(postData.content);

      // jeśli post ma tagi
      setSelectedtags(postData.tags || []);
    })
    .catch(err => console.error(err));
}, [id]);
 

 const tagsSelect = tags.map(tag => ({
  value: tag,
  label: tag
}));
 
console.log('selectedTags: ',selectedtags);
 
 //Widok strony
  return (
    
       <div className={styles.dashboard}>
      <h1>Panel Administratora Blogu - Edycja postu</h1>

      <button 
               className={styles.editBtn}
                onClick={() => navigate(`/admin/posts/`)}>
              Powrót do przeglądu
            </button>

      <form onSubmit = {submitPost}>
      <input
        type="text"
        placeholder="Tytuł posta"
        className={styles.postName}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
    width: `${Math.max(title.length, 20)}ch`
  }}
        required
      />
    <p/>
     <label>
      Wybierz Tagi:
      <Select
  isMulti
  options={tagsSelect}
    value={tagsSelect.filter(option =>
    selectedtags.includes(option.value)
  )}
  onChange={(selected) => {
  console.log('selected',selected);
  setSelectedtags(selected.map(item => item.value));
}}
/>
    </label>
  
     
      {/* <textarea
        placeholder="Treść posta..."
        className={styles.postTextArea}
      /> */}
      

       {/* <EditorContent editor={editor} /> */}
      {/* <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu> */}



        <CKEditor
        editor={ClassicEditor}
        config={{
          language: 'pl',
          placeholder: 'Wpisz treść posta...'
        }}
        data={content}
        onChange={(event, editor) => {
          const data = editor.getData();
          setContent(data);
        }}
      />
      
      <button type="submit" 
        className={styles.submitBtn}
      >
        Zapisz zmiany
      </button>
      </form>

      {/* <button onClick={handleLogout} className={styles.logoutBtn}>
        Wyloguj się
      </button> */}
    </div>
  );
}