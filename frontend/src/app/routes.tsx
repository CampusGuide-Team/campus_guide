import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { HomePage } from './pages/HomePage';
import { ClubsPage } from './pages/ClubsPage';
import { ClubDetailPage } from './pages/ClubDetailPage';
import { MyApplicationsPage } from './pages/MyApplicationsPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { LoginPage } from './pages/LoginPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminClubsPage } from './pages/admin/AdminClubsPage';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage';
import { AdminBuildingsPage } from './pages/admin/AdminBuildingsPage';
import { PresidentDashboardPage } from './pages/president/PresidentDashboardPage';
import { ClubMembersPage } from './pages/president/ClubMembersPage';
import { isAuthenticated, isAdmin, isPresident } from './utils/auth';
import { LoginSuccessPage } from './pages/LoginSuccess';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Admin Route Component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// President Route Component
const PresidentRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (!isPresident()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'clubs', element: <ClubsPage /> },
      { path: 'clubs/:id', element: <ClubDetailPage /> },
      { path: 'facilities', element: <FacilitiesPage /> },
      {
        path: 'my-applications',
        element: (
            <ProtectedRoute>
              <MyApplicationsPage />
            </ProtectedRoute>
        ),
      },
      { path: 'chatbot', element: <ChatbotPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'login/success', element: <LoginSuccessPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'profile', element: (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
        )},
    ],
  },
  {
    path: '/admin',
    element: (
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'clubs', element: <AdminClubsPage /> },
      { path: 'applications', element: <AdminApplicationsPage /> },
      { path: 'buildings', element: <AdminBuildingsPage /> },
    ],
  },
  {
    path: '/president',
    element: (
        <PresidentRoute>
          <RootLayout />
        </PresidentRoute>
    ),
    children: [
      { index: true, element: <PresidentDashboardPage /> },
      { path: 'clubs/:clubId', element: <ClubMembersPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);