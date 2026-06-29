import { React, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const response = await fetch('${API_URL}/api/Tags', {
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


export default function CreatePost() {

  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedtags, setSelectedtags] = useState([]);

//const [title, setTitle] = useState('');
const [preparationMethod, setPreparationMethod] = useState('');
const [preparationTime, setPreparationTime] = useState(0);
const [imageFileName, setImageFileName] = useState('');
const [ingredients, setIngredients] = useState([
  { name: '', quantity: '', unit: '' }
]);



const submitPost = async (e) => {

  e.preventDefault();
  const token = JSON.parse(localStorage.getItem("token")).token;

  console.log(`${token}`) 

    const postData = {
      title,
      preparationMethod,
      preparationTime: Number(preparationTime),
      imageFileName: imageFileName || null,
      tags: selectedtags.map(tag => tag.name),
      ingredients
    };

    console.log({
  title,
  content,
  tags: selectedtags
});

try{
  const response = await fetch(`${API_URL}/api/Posts`, {
      method: 'POST',
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






  const addIngredient = () => {
  setIngredients([
    ...ingredients,
    { name: '', quantity: '', unit: '' }
  ]);
};

const removeIngredient = (index) => {
  setIngredients(ingredients.filter((_, i) => i !== index));
};

const updateIngredient = (index, field, value) => {
  const updated = [...ingredients];
  updated[index][field] = value;
  setIngredients(updated);
};





 

 
  useEffect(() => {
        getTags()
          .then(data3 => {
          setTags(data3.$values || data3)})
          .catch(err => console.error(err));
      }, []);
 
 
 const tagsSelect = tags.map(tag => ({
  value: tag,
  label: tag.name
}));
 
console.log('selectedTags: ',selectedtags);
 
 //Widok strony
  return (
    
       <div className={styles.dashboard}>
      <h1>Nowy przepis</h1>

      <form onSubmit = {submitPost}>
      <input
        type="text"
        placeholder="Tytuł posta"
        className={styles.postName}
        onChange={(e) => setTitle(e.target.value)}
        style={{
    width: `${Math.max(title.length, 20)}ch`
  }}
        required
      />

      <label>Czas przygotowania (min)</label>

<input
    type="number"
    min="1"
    value={preparationTime}
    onChange={(e) => setPreparationTime(e.target.value)}
/>
    <p/>
     <label>
      Wybierz Tagi:
      <Select
  isMulti
  options={tagsSelect}
  onChange={(selected) => {
  console.log('selected',selected);
    setSelectedtags(selected.map(item => item.value));}}
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
        onChange={(event, editor) => {
          const data = editor.getData();
          setPreparationMethod(data);
        }}
      />

      <h3>Składniki</h3>

{ingredients.map((ingredient, index) => (
    <div key={index} style={{ marginBottom: "15px" }}>

        <input
            type="text"
            placeholder="Nazwa"
            value={ingredient.name}
            onChange={(e) =>
                updateIngredient(index, "name", e.target.value)
            }
        />

        <input
            type="text"
            placeholder="Ilość"
            value={ingredient.quantity}
            onChange={(e) =>
                updateIngredient(index, "quantity", e.target.value)
            }
        />

        

        <button
            type="button"
            onClick={() => removeIngredient(index)}
        >
            Usuń
        </button>

    </div>
))}

<button type="button" onClick={addIngredient}>
    Dodaj składnik
</button>
      
      <button type="submit" 
      
      >
        Utwórz post
      </button>
      </form>

      {/* <button onClick={handleLogout} className={styles.logoutBtn}>
        Wyloguj się
      </button> */}
    </div>
  );
}