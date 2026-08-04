import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import TemplateManagementPage from './pages/TemplateManagementPage';
import TemplateBuilderPage from './pages/TemplateBuilderPage';
import CategoriesPage from './pages/CategoriesPage';
import PosterHistoryPage from './pages/PosterHistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import ShopTemplateView from './pages/ShopTemplateView';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Routes>
          {/* Public Landing & Login */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Public / Shop Owner Share View */}
          <Route path="/template/:shareToken" element={<ShopTemplateView />} />

          {/* Super Admin Protected Portal */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/templates" element={<AdminRoute><TemplateManagementPage /></AdminRoute>} />
          <Route path="/admin/templates/builder" element={<AdminRoute><TemplateBuilderPage /></AdminRoute>} />
          <Route path="/admin/templates/builder/:id" element={<AdminRoute><TemplateBuilderPage /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><CategoriesPage /></AdminRoute>} />
          <Route path="/admin/posters" element={<AdminRoute><PosterHistoryPage /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><AnalyticsPage /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </AuthProvider>
  );
}
