import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List } from 'react-window';
import styles from './AdminViev.module.css';
import { API_URL } from '../config.js';


//TODO
//FIltrowanie i wyszykiwanie postów
//Czy problemem w wymiarach listy jest CSS?

//To zwykła funkcja JAVASCRIPT, nie można uzywac komponentów react tutaj
async function getUsers() {


    const token = JSON.parse(localStorage.getItem("token")).token;


  const response = await fetch(`${API_URL}/api/Users`, {
    method: 'GET',
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


//To zwykła funkcja JAVASCRIPT, nie można uzywac komponentów react tutaj
//Jak brak aktualizacji widoku użytkonika to pewnie błąd z http response
async function removeUser(id) {
  const token = JSON.parse(localStorage.getItem("token")).token;

  const response = await fetch(`${API_URL}/api/Users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Delete fail: ${response.statusText}`);
  }

  return true;
}


export default function UsersMod() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getUsers()
      .then(data => setUsers(data.$values || data))
      .catch(err => console.error(err));
  }, []);

  // 🔎 filtrowanie po loginie
  const filteredUsers = users.filter(user =>
    user.login?.toLowerCase().includes(search.toLowerCase())
  );

  const Row = ({ index, style }) => {
    const user = filteredUsers[index];

    return (
      <div style={style} className={styles.postItem}>
        <h3>{user.login}</h3>

        <div className={styles.buttonContainer}>
          <button
            className={styles.removeBtn}
            onClick={async () => {
              const confirmed = window.confirm(
                "Czy na pewno chcesz usunąć tego użytkownika?"
              );

              if (!confirmed) return;

              try {
                await removeUser(user.id);

                setUsers(prev =>
                  prev.filter(u => u.id !== user.id)
                );
              } catch (err) {
                console.error(err);
              }
            }}
          >
            Usuń użytkownika
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dashboard}>
      <h2>Moderacja użytkowników</h2>

      <label>
        <p>Wyszukaj użytkownika</p>
        <input
          type="text"
          value={search}
          placeholder="Wpisz login..."
          onChange={e => setSearch(e.target.value)}
        />
      </label>

      {filteredUsers.length === 0 ? (
        <p>Nikt jeszcze nie skomentował</p>
      ) : (
        <List
          height={500}
          width={600}
          itemCount={filteredUsers.length}
          itemSize={80}
        >
          {Row}
        </List>
      )}
    </div>
  );
}