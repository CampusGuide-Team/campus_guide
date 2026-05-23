import { User, AuthState } from '../types';

const AUTH_STORAGE_KEY = 'auth_state';

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user_info');
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const isAdmin = (): boolean => {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'ROLE_ADMIN';
  } catch {
    return false;
  }
};

export const isPresident = (): boolean => {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'ROLE_PRESIDENT';
  } catch {
    return false;
  }
};

export const getCurrentUser = (): any => {
  const token = getToken();
  if (!token) return null;
  try {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) return JSON.parse(userInfo);
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { id: payload.sub, role: payload.role };
  } catch {
    return null;
  }
};

export const getAuthState = (): AuthState => {
  const token = getToken();
  if (!token) return { user: null, token: null };
  const user = getCurrentUser();
  return { user, token };
};

export const setAuthState = (state: AuthState) => {
  if (state.token) {
    localStorage.setItem('token', state.token);
  }
};

export const clearAuthState = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user_info');
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const googleLogin = () => null;
export const registerGoogleUser = () => null;
export const findUserByEmail = () => null;