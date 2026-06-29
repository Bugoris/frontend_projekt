import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import styles from './AdminViev.module.css';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLayout() {
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
