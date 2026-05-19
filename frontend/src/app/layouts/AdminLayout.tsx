import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '../components/ui/sheet';
import { LayoutDashboard, Users, FileText, Building, ArrowLeft, LogOut, Menu } from 'lucide-react';
import { getCurrentUser, logout } from '../utils/auth';
import { useState, useEffect } from 'react';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(getCurrentUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
  }, [location]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavLinks = () => (
    <>
      <Link to="/admin">
        <Button
          variant={isActive('/admin') ? 'default' : 'ghost'}
          className="w-full justify-start"
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          대시보드
        </Button>
      </Link>
      <Link to="/admin/clubs">
        <Button
          variant={isActive('/admin/clubs') ? 'default' : 'ghost'}
          className="w-full justify-start"
        >
          <Users className="w-5 h-5 mr-3" />
          동아리 관리
        </Button>
      </Link>
      <Link to="/admin/applications">
        <Button
          variant={isActive('/admin/applications') ? 'default' : 'ghost'}
          className="w-full justify-start"
        >
          <FileText className="w-5 h-5 mr-3" />
          신청 관리
        </Button>
      </Link>
      <Link to="/admin/buildings">
        <Button
          variant={isActive('/admin/buildings') ? 'default' : 'ghost'}
          className="w-full justify-start"
        >
          <Building className="w-5 h-5 mr-3" />
          건물 관리
        </Button>
      </Link>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white border-b border-gray-800 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[280px] bg-white p-6">
                    <SheetTitle className="text-lg font-bold mb-6">관리 메뉴</SheetTitle>
                    <nav className="space-y-2">
                      <NavLinks />
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>

              <Link to="/admin" className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-bold text-lg">관리자 대시보드</h1>
                  <p className="text-xs text-gray-400">KU Navigator Admin</p>
                </div>
                <div className="sm:hidden">
                  <h1 className="font-bold text-base">관리자</h1>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-sm text-right mr-2 hidden lg:block">
                <div className="font-medium">{user?.name}</div>
                <div className="text-xs text-gray-400">관리자</div>
              </div>
              <Link to="/">
                <Button variant="outline" size="sm" className="text-white border-gray-700 hover:bg-gray-800">
                  <ArrowLeft className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">사용자 화면</span>
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-white border-gray-700 hover:bg-gray-800 hidden sm:flex">
                <LogOut className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">로그아웃</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r min-h-[calc(100vh-73px)] p-4">
          <nav className="space-y-2">
            <NavLinks />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
