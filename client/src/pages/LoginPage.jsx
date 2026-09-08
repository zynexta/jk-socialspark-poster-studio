import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your MongoDB database credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#111111] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="max-w-md w-full relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group mb-4">
            <img 
              src="/logo.png" 
              alt="JK SocialSpark Logo" 
              className="h-14 w-auto object-contain drop-shadow-md transition-transform group-hover:scale-105" 
            />
          </Link>
          <h1 className="text-2xl font-black font-heading text-[#0A0A0A]">JK SocialSpark</h1>
          <p className="text-xs text-[#555555] font-medium mt-1">Super Admin Authentication Portal</p>
        </div>

        {/* Card Box */}
        <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-2 mb-6 text-xs font-black text-[#C1121F] uppercase tracking-wider bg-[#FFF1F2] p-2.5 rounded-xl border border-red-200">
            <ShieldCheck className="w-4 h-4 text-[#C1121F] shrink-0" />
            <span>MongoDB Atlas Secured Login</span>
          </div>

          {errorMsg && (
            <div className="p-3.5 mb-5 rounded-xl bg-red-50 border border-red-200 text-[#C1121F] text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#C1121F]" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#0A0A0A] block mb-1.5">Admin Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#777777] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your admin email"
                  className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#C1121F] pl-10 pr-4 py-3 rounded-2xl text-xs font-bold text-[#0A0A0A] placeholder-[#777777] outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0A0A0A] block mb-1.5">Admin Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#777777] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your admin password"
                  className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#C1121F] pl-10 pr-4 py-3 rounded-2xl text-xs font-bold text-[#0A0A0A] placeholder-[#777777] outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#C1121F] hover:bg-[#8B0E16] text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Verifying with MongoDB Atlas...</span>
              ) : (
                <>
                  <span>Sign In to Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-[#555555] hover:text-[#C1121F] font-bold transition-colors inline-flex items-center gap-1.5">
            &larr; Back to JK SocialSpark Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
