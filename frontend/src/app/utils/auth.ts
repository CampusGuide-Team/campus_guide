import { User, AuthState } from '../types';
import { getUsers } from '../data/mockData';

const AUTH_STORAGE_KEY = 'auth_state';

export const getAuthState = (): AuthState => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return { user: null, token: null };
};

export const setAuthState = (state: AuthState) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
};

export const clearAuthState = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

// Google OAuth 시뮬레이션 - 이메일로 사용자 찾기
export const findUserByEmail = (email: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  return user || null;
};

// Google 로그인 처리
export const googleLogin = (email: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  if (user) {
    // 기존 사용자 - 로그인 처리
    const token = `mock-token-${user.id}-${Date.now()}`;
    const { password: _, ...userWithoutPassword } = user;
    setAuthState({ user: userWithoutPassword as User, token });
    return userWithoutPassword as User;
  }
  
  return null; // 신규 사용자
};

// 구글 신규 회원 등록 (추가 정보 입력 후)
export const registerGoogleUser = (
  email: string,
  name: string,
  studentId: string,
  phone: string,
  department: string
): User | null => {
  const users = getUsers();
  
  // 이메일 중복 체크
  if (users.find(u => u.email === email)) {
    return null;
  }
  
  const newUser: User = {
    id: `user-${Date.now()}`,
    email,
    name,
    role: 'user',
    studentId,
    phone,
    department,
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  const token = `mock-token-${newUser.id}-${Date.now()}`;
  setAuthState({ user: newUser, token });
  
  return newUser;
};

export const logout = () => {
  clearAuthState();
};

export const isAuthenticated = (): boolean => {
  const { user, token } = getAuthState();
  return user !== null && token !== null;
};

export const isAdmin = (): boolean => {
  const { user } = getAuthState();
  return user?.role === 'admin';
};

export const isPresident = (): boolean => {
  const { user } = getAuthState();
  return user?.role === 'president';
};

export const getCurrentUser = (): User | null => {
  const { user } = getAuthState();
  return user;
};