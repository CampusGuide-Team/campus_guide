const BASE_URL = 'http://localhost:8080';

export const getToken = () => localStorage.getItem('token');

// 헤더를 안전하게 생성하는 헬퍼 함수
const getHeaders = (contentType?: string) => {
  const headers: Record<string, string> = {};

  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  const token = getToken();
  // 💡 토큰이 존재하고, 문자열 "null"이나 "undefined"가 아닐 때만 헤더에 추가
  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const api = {
  get: async (url: string) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      headers: getHeaders(), // 안전하게 처리된 헤der 적용
    });
    if (!res.ok) throw new Error('API 오류');
    return res.json();
  },

  post: async (url: string, body?: object) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: getHeaders('application/json'),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('API 오류');
    return res.json();
  },

  patch: async (url: string, body?: object) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'PATCH',
      headers: getHeaders('application/json'),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('API 오류');
    return res.json();
  },

  delete: async (url: string) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('API 오류');
    return res.status === 204 ? null : res.json();
  },
};