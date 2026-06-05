import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '../components/ui/sheet';
import { Home, List, MessageSquare, FileText, LogOut, User, Shield, Users, Menu, MapPin } from 'lucide-react';
import { getCurrentUser, logout, isAdmin, isPresident } from '../utils/auth';
import { useEffect, useState } from 'react';
import { api } from '../utils/api';

export function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) return JSON.parse(userInfo);
    return getCurrentUser();
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userIsAdmin = isAdmin();
  const [userIsPresident, setUserIsPresident] = useState(false);

  useEffect(() => {
    // Listen for auth changes
    const checkAuth = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Update user state when location changes (for login/logout)
  useEffect(() => {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    } else {
      setUser(getCurrentUser());
    }
  }, [location]);
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {

    if (!user) return;

    api.get('/users/me/is-president')
        .then((result: boolean) => {
          setUserIsPresident(result);
        })
        .catch(() => {
          setUserIsPresident(false);
        });

  }, [user]);
  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/icon-192.png" alt="KU Navigator" className="w-9 h-9 rounded-lg" />
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg">KU Navigator</h1>
                <p className="text-xs text-gray-500">캠퍼스 동아리 탐색</p>
              </div>
              <div className="sm:hidden">
                <h1 className="font-bold text-base">KU Navigator</h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <Link to="/">
                <Button variant={isActive('/') ? 'default' : 'ghost'} size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  홈
                </Button>
              </Link>
              <Link to="/clubs">
                <Button variant={isActive('/clubs') ? 'default' : 'ghost'} size="sm">
                  <List className="w-4 h-4 mr-2" />
                  동아리
                </Button>
              </Link>
              <Link to="/facilities">
                <Button variant={isActive('/facilities') ? 'default' : 'ghost'} size="sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  시설
                </Button>
              </Link>
              <Link to="/chatbot">
                <Button variant={isActive('/chatbot') ? 'default' : 'ghost'} size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  챗봇
                </Button>
              </Link>
              {user && (
                <Link to="/my-applications">
                  <Button variant={isActive('/my-applications') ? 'default' : 'ghost'} size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    내 신청
                  </Button>
                </Link>
              )}
            </nav>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <div className="text-sm text-right mr-2 hidden lg:block">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  {userIsAdmin && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm">
                        <Shield className="w-4 h-4 md:mr-2" />
                        <span className="hidden md:inline">관리자</span>
                      </Button>
                    </Link>
                  )}
                  {userIsPresident && (
                    <Link to="/president">
                      <Button variant="outline" size="sm">
                        <Users className="w-4 h-4 md:mr-2" />
                        <span className="hidden md:inline">회장</span>
                      </Button>
                    </Link>
                  )}
                  <Link to="/profile">
                    <Button variant="outline" size="sm">
                      <User className="w-4 h-4 md:mr-2" />
                      <span className="hidden md:inline">내 정보</span>
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">로그아웃</span>
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button size="sm">
                    <User className="w-4 h-4 mr-2" />
                    로그인
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[350px] p-6">
                  <SheetTitle className="text-lg font-bold mb-6">메뉴</SheetTitle>

                  {/* User Info */}
                  {user && (
                    <div className="border-b pb-4 mb-4">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <nav className="space-y-2">
                    <Link to="/">
                      <Button
                        variant={isActive('/') ? 'default' : 'ghost'}
                        className="w-full justify-start"
                      >
                        <Home className="w-5 h-5 mr-3" />
                        홈
                      </Button>
                    </Link>
                    <Link to="/clubs">
                      <Button
                        variant={isActive('/clubs') ? 'default' : 'ghost'}
                        className="w-full justify-start"
                      >
                        <List className="w-5 h-5 mr-3" />
                        동아리 탐색
                      </Button>
                    </Link>
                    <Link to="/facilities">
                      <Button
                        variant={isActive('/facilities') ? 'default' : 'ghost'}
                        className="w-full justify-start"
                      >
                        <MapPin className="w-5 h-5 mr-3" />
                        시설 찾기
                      </Button>
                    </Link>
                    <Link to="/chatbot">
                      <Button
                        variant={isActive('/chatbot') ? 'default' : 'ghost'}
                        className="w-full justify-start"
                      >
                        <MessageSquare className="w-5 h-5 mr-3" />
                        챗봇
                      </Button>
                    </Link>

                    {user && (
                      <Link to="/my-applications">
                        <Button
                          variant={isActive('/my-applications') ? 'default' : 'ghost'}
                          className="w-full justify-start"
                        >
                          <FileText className="w-5 h-5 mr-3" />
                          내 신청
                        </Button>
                      </Link>
                    )}
                    {user && (
                        <Link to="/profile">
                          <Button
                              variant={isActive('/profile') ? 'default' : 'ghost'}
                              className="w-full justify-start"
                          >
                            <User className="w-5 h-5 mr-3" />
                            내 정보
                          </Button>
                        </Link>
                    )}
                  </nav>

                  {/* Admin/President Links */}
                  {user && (userIsAdmin || userIsPresident) && (
                    <div className="border-t pt-4 mt-4 space-y-2">
                      {userIsAdmin && (
                        <Link to="/admin">
                          <Button variant="outline" className="w-full justify-start">
                            <Shield className="w-5 h-5 mr-3" />
                            관리자 페이지
                          </Button>
                        </Link>
                      )}
                      {userIsPresident && (
                        <Link to="/president">
                          <Button variant="outline" className="w-full justify-start">
                            <Users className="w-5 h-5 mr-3" />
                            회장 페이지
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Auth Button */}
                  <div className="border-t pt-4 mt-4">
                    {user ? (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        로그아웃
                      </Button>
                    ) : (
                      <Link to="/login">
                        <Button className="w-full justify-start">
                          <User className="w-5 h-5 mr-3" />
                          로그인
                        </Button>
                      </Link>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-4 py-6 max-w-7xl">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="mx-auto px-4 py-6">
          <div className="text-center text-xs text-gray-600">
            <p>&copy; 2026 KU Navigator</p>
            <p className="mt-1 text-gray-500">
              국립한국교통대학교 캠퍼스 동아리 탐색 플랫폼
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}