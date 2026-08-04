import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Store, Lock, Mail, ArrowRight, Sparkles, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginAsAdmin, loginAsShopOwner } = useAuth();
  
  const [role, setRole] = useState('admin'); // 'admin' | 'shop_owner'
  const [email, setEmail] = useState('admin@jksecurity.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const user = await login(email, password, role);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/template/sslc-topper-2026');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAdmin = () => {
    setRole('admin');
    setEmail('admin@jksecurity.com');
    setPassword('admin123');
    setErrorMsg('');
  };

  const handleSelectShop = () => {
    setRole('shop_owner');
    setEmail('shop@apexprints.com');
    setPassword('shop123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center font-extrabold text-white text-xl shadow-xl shadow-blue-600/30">
              ZX
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold font-heading text-white">Zynexta Smart Poster Studio</h1>
          <p className="text-xs text-slate-400 mt-1">Sign in to access your Zynexta SaaS Portal</p>
        </div>

        {/* Card Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          {/* Role Toggle Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 mb-6">
            <button
              onClick={() => {
                setRole('admin');
                setEmail('admin@jksecurity.com');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                role === 'admin'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Super Admin
            </button>
            <button
              onClick={() => {
                setRole('shop_owner');
                setEmail('shop@apexprints.com');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                role === 'shop_owner'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-4 h-4" />
              Shop Owner
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-950 text-blue-600" />
                <span>Remember Me</span>
              </label>
              <span className="text-blue-400 hover:underline cursor-pointer">Forgot Password?</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all mt-2"
            >
              <span>{loading ? 'Authenticating...' : `Sign In as ${role === 'admin' ? 'Super Admin' : 'Shop Owner'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
              ⚡ Quick Fill Credentials
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleSelectAdmin}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Fill Admin Credentials
              </button>

              <button
                type="button"
                onClick={handleSelectShop}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Store className="w-3.5 h-3.5 text-cyan-400" />
                Fill Shop Credentials
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
