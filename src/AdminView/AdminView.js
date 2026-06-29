import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminViev.module.css';

import { API_URL } from '../config.js';


export default function AdminViev({ removeToken }) {

  const navigate = useNavigate();


  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
       <div className={styles.dashboard}>
      <h2>Panel Administratora Blogu (WIP)</h2>

      <input
        type="text"
        placeholder="Tytuł posta"
        className={styles.postName}
      />

      <textarea
        placeholder="Treść posta..."
        className={styles.postTextArea}
      />

      <button className={styles.submitBtn}>
        Dodaj post
      </button>

      <button onClick={handleLogout} className={styles.logoutBtn}>
        Wyloguj się
      </button>
    </div>
  );
}