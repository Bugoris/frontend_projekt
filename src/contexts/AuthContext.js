import React, { createContext, useContext, useState, useEffect } from  'react';
import useToken from '../useToken';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '../config.js';


const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const { token, setToken, removeToken } = useToken();
  const [user, setUser] = useState(null);

    useEffect(() => {
  if (!token) return;

  try {
    const decode = jwtDecode(token.token ?? token);

    const username =
      decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

    const role =
      decode["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    setUser({
      username,
      role
    });

  } catch (err) {
    console.error("Invalid token", err);
    logout();
  }
}, [token]);


  const login = async (credentials) => {
    // Login logic here
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    console.log(data);
    setToken(data);

    const decode = jwtDecode(data.token);

    console.log(decode);
  
  
  




    // Optionally decode token to set user info
    return data;
  };

  

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}