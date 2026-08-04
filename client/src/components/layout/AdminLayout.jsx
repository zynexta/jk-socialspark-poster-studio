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
    <div className="h-screen bg-[#080C14] text-slate-100 flex overflow-hidden font-sans">
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl cursor-pointer transition-all hover:scale-105 transform duration-200 ${
              toast.type === 'danger'
                ? 'bg-slate-900/95 border-rose-500/40 text-rose-200'
                : toast.type === 'warning'
                ? 'bg-slate-900/95 border-amber-500/40 text-amber-200'
                : toast.type === 'info'
                ? 'bg-slate-900/95 border-cyan-500/40 text-cyan-200'
                : 'bg-slate-900/95 border-emerald-500/40 text-emerald-200'
            }`}
          >
            <div className={`p-2 rounded-xl border shrink-0 ${
              toast.type === 'danger'
                ? 'bg-rose-500/20 border-rose-500/30 text-rose-400'
                : toast.type === 'warning'
                ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                : toast.type === 'info'
                ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
            }`}>
              {toast.type === 'danger' ? (
                <AlertCircle className="w-4 h-4" />
              ) : toast.type === 'warning' ? (
                <AlertCircle className="w-4 h-4" />
              ) : toast.type === 'info' ? (
                <Sparkles className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold block leading-tight">{toast.message}</span>
              <span className="text-[10px] opacity-70 font-semibold block mt-0.5">Click to dismiss</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden lg:flex w-64 bg-slate-900/90 border-r border-slate-800/80 flex-col justify-between p-4 z-30 h-screen sticky top-0 shrink-0 backdrop-blur-md">
        <div className="flex flex-col h-full min-h-0">
          {/* Brand Logo Header */}
          <Link to="/admin" className="flex items-center gap-3 px-3 py-3 mb-4 shrink-0 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center font-extrabold text-white text-base shadow-lg shadow-blue-600/30">
              ZX
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-cyan-400 tracking-wider uppercase block">Zynexta SaaS</span>
              <span className="font-heading font-extrabold text-base text-white block leading-tight">Poster Studio</span>
            </div>
          </Link>

          {/* Quick Create Action Button */}
          <Link
            to="/admin/templates/builder/new"
            className="w-full mb-5 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] shrink-0"
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
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/25 to-indigo-600/20 text-white border-l-4 border-blue-500 shadow-md font-bold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Card Footer */}
          <div className="pt-4 mt-2 border-t border-slate-800/80 shrink-0">
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 mb-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={user?.name}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-100 block truncate">{user?.name}</span>
                  <span className="text-[10px] text-blue-400 font-semibold block capitalize">{user?.role}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-3 hover:bg-rose-500/10 text-rose-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-transparent hover:border-rose-500/20 transition-all"
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
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Mobile Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 p-4 z-50 flex flex-col justify-between transform transition-transform duration-300 lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          <div className="flex items-center justify-between mb-6">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg">
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
            className="w-full mb-6 py-3 px-4 bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
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
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
          className="w-full py-2.5 px-3 bg-rose-500/10 text-rose-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-rose-500/20"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Sticky Header */}
        <header className="h-16 bg-slate-900/80 border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h2 className="text-sm sm:text-base font-heading font-bold text-white">
              Super Admin Control Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/template/sslc-topper-2026"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400 border border-slate-700 transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Preview Shop Share View
            </Link>
          </div>
        </header>

        {/* Main View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
