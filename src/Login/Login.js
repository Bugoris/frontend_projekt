import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import './Login.css';
import { useAuth } from '../contexts/AuthContext';

//To zwykła funkcja JAVASCRIPT, nie można uzywac komponentów react tutaj
async function loginUser(credentials) {

  const response = await fetch('https://localhost:7026/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
}

export default function Login() {

  let navigate = useNavigate();
  //próba
    const { login } = useAuth();


  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login({
        login: username,
        password
      });
      //setToken(token);
      navigate("/admin/create");

       const decoded = jwtDecode(data.token);

    const role =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (role === "Admin") {
      navigate("/admin/create");
    } else {
      navigate("/");
    }

    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return(
    <div className="login-wrapper">
  <div className="login-card">

    <h1>Proszę się zalogować</h1>

    {error && <div className="error-message">{error}</div>}

    <form onSubmit={handleSubmit}>
      <label>
        <p>Login</p>
        <input
          type="text"
          onChange={e => setUserName(e.target.value)}
          disabled={loading}
        />
      </label>

      <label>
        <p>Hasło</p>
        <input
          type="password"
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
        />
      </label>

      <button type="submit" disabled={loading} className="login-btn">
        {loading ? 'Logowanie...' : 'Zaloguj się'}
      </button>
    </form>

    <div className="auth-footer">
      <span>Nie masz konta?</span>

      <button
        type="button"
        className="register-btn"
        onClick={() => navigate("/Register")}
      >
        Zarejestruj się
      </button>
    </div>

  </div>
</div>
    
  );
}

// Login.propTypes = {
//   setToken: PropTypes.func.isRequired
// };