import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

export function LoginSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, []);

  return <div>로그인 처리 중...</div>;
}