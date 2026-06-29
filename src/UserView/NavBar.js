import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';
import { useAuth } from '../contexts/AuthContext';

import { jwtDecode } from "jwt-decode";

import { useEffect } from 'react';

import { API_URL } from '../config.js';

export default function Navbar({ onLogout }) {


    const {user, isAuthenticated} = useAuth();




      const token = localStorage.getItem('token');
  return (
    <div>
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link to="/" className={styles.logo}>
          🍜 BLOG KULINARNY
        </Link>
      </div>

      {isAuthenticated ? (
        <>
          <div className={styles.center}>
            <Link to="/my-recipies">Moje przepisy</Link>
            <Link to="/create-recipie">Dodaj przepis</Link>
          </div>

          <div className={styles.right}>
            <span className={styles.welcome}>
              Zalogowano: {user?.username || "user"}
            </span>

            <button onClick={onLogout} className={styles.logoutBtn}>
              Wyloguj
            </button>
          </div>
        </>
      ) : (
        <div className={styles.right}>
          <Link to="/login" className={styles.loginBtn}>
            Zaloguj się
          </Link>
        </div>
      )}
    </nav>


    </div>
  );
}