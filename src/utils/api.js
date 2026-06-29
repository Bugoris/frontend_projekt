let csrfToken = null;

export async function getCsrfToken() {
  if (!csrfToken) {
    const response = await fetch('http://localhost:8080/api/csrf-token', {
      credentials: 'include' // Include cookies
    });
    const data = await response.json();
    csrfToken = data.csrfToken;
  }
  return csrfToken;
}

export async function loginUser(credentials) {
  const token = await getCsrfToken();
  
  return fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': token
    },
    credentials: 'include', // Include cookies
    body: JSON.stringify(credentials)
  }).then(data => data.json());
}