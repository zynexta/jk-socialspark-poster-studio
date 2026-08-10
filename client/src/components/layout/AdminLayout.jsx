import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, Layers, Tag, Share2, History, BarChart3, Settings, 
  LogOut, Plus, Search, Bell, Sparkles, Menu, X, ChevronRight, CheckCircle2, AlertCircle
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard },
  { path: '/admin/templates', label: 'Templates Builder', icon: Layers },
  { path: '/admin/categories', label: 'Categories', icon: Tag },
  { path: '/admin/posters', label: 'Poster History', icon: History },
  { path: '/admin/analytics', label: 'Analytics Reports', icon: BarChart3 },
  { path: '/admin/settings', label: 'System Settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toasts, removeToast } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-screen bg-[#F8F8F6] text-[#111111] flex overflow-hidden font-sans">
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-center gap-3 backdrop-blur-md cursor-pointer transition-all hover:scale-102 transform duration-200 ${
              toast.type === 'danger'
                ? 'bg-[#FFFFFF] border-red-200 text-[#C1121F]'
                : toast.type === 'warning'
                ? 'bg-[#FFFFFF] border-amber-200 text-amber-800'
                : toast.type === 'info'
                ? 'bg-[#FFFFFF] border-slate-200 text-[#111111]'
                : 'bg-[#FFFFFF] border-emerald-200 text-emerald-800'
            }`}
          >
            <div className={`p-2 rounded-xl border shrink-0 ${
              toast.type === 'danger'
                ? 'bg-[#FFF1F2] border-red-200 text-[#C1121F]'
                : toast.type === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-600'
                : toast.type === 'info'
                ? 'bg-[#F5F5F3] border-slate-200 text-[#111111]'
                : 'bg-emerald-50 border-emerald-200 text-emerald-600'
            }`}>
              {toast.type === 'danger' ? (
                <AlertCircle className="w-4 h-4" />
              ) : toast.type === 'warning' ? (
                <AlertCircle className="w-4 h-4" />
              ) : toast.type === 'info' ? (
                <Sparkles className="w-4 h-4 text-[#C1121F]" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold block leading-tight text-[#111111]">{toast.message}</span>
              <span className="text-[10px] text-[#777777] font-semibold block mt-0.5">Click to dismiss</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden lg:flex w-64 bg-[#0A0A0A] text-[#BDBDBD] border-r border-[#181818] flex-col justify-between p-4 z-30 h-screen sticky top-0 shrink-0">
        <div className="flex flex-col h-full min-h-0">
          {/* Brand Logo Header */}
          <Link to="/admin" className="flex items-center gap-3 px-3 py-3 mb-4 shrink-0 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-[#C1121F] flex items-center justify-center font-black text-white text-base shadow-md">
              ZX
            </div>
            <div>
              <span className="text-[10px] font-black text-[#C1121F] tracking-wider uppercase block">Zynexta SaaS</span>
              <span className="font-heading font-extrabold text-base text-white block leading-tight">Poster Studio</span>
            </div>
          </Link>

          {/* Quick Create Action Button */}
          <Link
            to="/admin/templates/builder/new"
            className="w-full mb-5 py-3 px-4 bg-[#C1121F] hover:bg-[#8B0E16] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] shrink-0"
          >
            <Plus className="w-4 h-4" />
            Create New Template
          </Link>

          {/* Independent Scrollable Nav List */}
          <nav className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#C1121F] text-white shadow-md font-extrabold'
                      : 'text-[#BDBDBD] hover:text-white hover:bg-[#181818]'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-[#777777]'}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Card Footer */}
          <div className="pt-4 mt-2 border-t border-[#181818] shrink-0">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111111] border border-[#292929] mb-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={user?.name}
                  className="w-9 h-9 rounded-lg object-cover border border-[#292929] shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate">{user?.name}</span>
                  <span className="text-[10px] text-[#C1121F] font-bold block capitalize">{user?.role}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-3 bg-[#111111] hover:bg-[#C1121F] text-[#BDBDBD] hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-[#292929] transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)} 
          className="fixed inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Mobile Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-[#0A0A0A] border-r border-[#181818] p-4 z-50 flex flex-col justify-between transform transition-transform duration-300 lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          <div className="flex items-center justify-between mb-6">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C1121F] flex items-center justify-center font-bold text-white shadow-md">
                ZX
              </div>
              <span className="font-heading font-bold text-sm text-white">Zynexta Poster SaaS</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <Link
            to="/admin/templates/builder/new"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full mb-6 py-3 px-4 bg-[#C1121F] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Create New Template
          </Link>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive ? 'bg-[#C1121F] text-white font-bold' : 'text-[#BDBDBD] hover:text-white hover:bg-[#181818]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-2.5 px-3 bg-[#111111] hover:bg-[#C1121F] text-[#BDBDBD] hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-[#292929]"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Sticky Header */}
        <header className="h-16 bg-[#FFFFFF] border-b border-[#E5E5E5] px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#F5F5F3] text-[#111111] border border-[#E5E5E5]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h2 className="text-sm sm:text-base font-heading font-extrabold text-[#0A0A0A]">
              Super Admin Control Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/template/sslc-topper-2026"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F8F8F6] hover:bg-[#FFF1F2] text-xs font-bold text-[#111111] border border-[#E5E5E5] hover:border-[#C1121F] transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C1121F]" />
              Preview Shop Share View
            </Link>
          </div>
        </header>

        {/* Main View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8F8F6]">
          {children}
        </main>
      </div>
    </div>
  );
}
