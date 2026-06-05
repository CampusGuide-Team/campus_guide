import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { LogIn } from 'lucide-react';
import { api } from '../utils/api';
import { useNavigate } from 'react-router';

export function LoginPage() {
  const navigate = useNavigate();
  const [openDevLogin, setOpenDevLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleGoogleLoginClick = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;
  };

  const handleDevLogin = async () => {
    try {
      const result = await api.post('/users/dev-login', {
        email,
        name,
      });

      navigate(`/login/success?token=${result.token}`);
    } catch (e) {
      console.error(e);
      alert('개발자 로그인 실패');
    }
  };

  return (
      <>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                <LogIn className="w-5 h-5 md:w-6 md:h-6" />
                로그인
              </CardTitle>

              <CardDescription>
                KU Navigator에 로그인하세요
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button
                  onClick={handleGoogleLoginClick}
                  className="w-full h-12 text-base"
                  variant="outline"
              >
                <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                >
                  <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google로 로그인
              </Button>

              <div className="border rounded-lg p-4 bg-blue-50 text-sm">
                <p className="font-medium mb-2">
                  📧 로그인 안내
                </p>

                <div className="space-y-1 text-xs">
                  <p>
                    • 국립한국교통대학교 구글 계정(@a.ut.ac.kr)으로만{' '}
                    <span onClick={() => setOpenDevLogin(true)}>
                      로그인
                    </span>{' '}
                    가능합니다
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog
            open={openDevLogin}
            onOpenChange={setOpenDevLogin}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                개발자 로그인
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                  placeholder="이름"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
              />

              <Input
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />

              <Button
                  className="w-full"
                  onClick={handleDevLogin}
              >
                로그인
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
  );
}