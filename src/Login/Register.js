import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Login.css';

import { API_URL } from '../config.js';


//To zwykła funkcja JAVASCRIPT, nie można uzywac komponentów react tutaj
async function RegisterUser(credentials) {

  const response = await fetch(`${API_URL}/api/login/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });

    if (!response.ok) {
    throw new Error(`Register failed: ${response.statusText}`);
  }

  return true; //dziwnie mozna zmienic potem jakos
}


export default function Register() {

  let navigate = useNavigate();


  const [username, setUserName] = useState("");
const [password, setPassword] = useState("");
const [repeatpassword, setRepeatpassword] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!username || !password) {
  setError("Fill all fields");
  return;
}

     if (password !== repeatpassword) {
    setError("Passwords do not match");
    return;
  }

    setError(null);
    setLoading(true);

    try {
      const token = await RegisterUser({
        login: username,
        password
      });
      //setToken(token);
      navigate("/login", { state: { message: "Account created!" } });
    } catch (err) {
      setError(err.message || 'Takie konto już istnieje');
    } finally {
      setLoading(false);
    }
  };

  return(
    <div className="login-wrapper">
      <div className="login-card">
      <h1>Tworzenie nowego konta</h1>
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
        <label>
          <p>Powtórz hasło</p>
          <input 
            type="password" 
            onChange={e => setRepeatpassword(e.target.value)}
            disabled={loading}
          />
        </label>
        <div>
           
        <button 
            type="submit" 
            className="register-btn"
             disabled={
    loading ||
    !username ||
    !password ||
    !repeatpassword ||
    password !== repeatpassword
  }
            >
            {loading ? 'Rejestrowanie...' : 'Zarejestruj się'}
        </button>
          
          

        </div>
      </form>
       <button  className="login-btn" onClick={()=> navigate("/login")}>
                Masz już konto? Zaloguj się...
          </button>
          </div>
    </div>
  );
}

// Login.propTypes = {
//   setToken: PropTypes.func.isRequired
// };