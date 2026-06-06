import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { api } from '../utils/api';

export function LoginSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    console.log('token:', token);
    if (token) {
      localStorage.setItem('token', token);
      console.log('token 저장됨');

      api.get('/users/me/profile').then((user: any) => {
        console.log('user:', user);
        localStorage.setItem('user_info', JSON.stringify(user));
        window.dispatchEvent(new Event('storage'));
        if (!user.studentId || !user.phone || !user.department) {
          navigate('/register');
        } else {
          navigate('/');
        }
      }).catch((e) => {
        console.error('profile 에러:', e);
        navigate('/');
      });
    } else {
      navigate('/login');
    }
  }, []);
  return <div>로그인 처리 중...</div>;
}