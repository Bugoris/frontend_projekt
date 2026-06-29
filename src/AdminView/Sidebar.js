import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';

export default function Sidebar({ onLogout }) {
  return (
    <div className={styles.sidebar}>
      <h3>Panel Administratora</h3>

      <Link to="/admin/posts">📄 Posty</Link>
      <Link to="/admin/create">➕ Dodaj post</Link>
      <Link to="/admin/comments">💬 Komentarze</Link>

      <button className={styles.logoutBtn} onClick={onLogout}>Wyloguj</button>
    </div>
  );
}