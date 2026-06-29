import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './NavBar';
import styles from './NavBar.module.css';
import { useAuth } from '../contexts/AuthContext';

export default function UserLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <Sidebar onLogout={handleLogout} />

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
