const BASE_URL = 'http://localhost:8080';

export const getToken = () => localStorage.getItem('token');

export const api = {
  get: async (url: string) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    if (!res.ok) throw new Error('API 오류');
    return res.json();
  },

  post: async (url: string, body?: object) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('API 오류');
    return res.json();
  },

  patch: async (url: string, body?: object) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('API 오류');
    return res.json();
  },
  delete: async (url: string) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!res.ok) throw new Error('API 오류');
  },
};