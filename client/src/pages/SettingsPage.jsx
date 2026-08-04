import React, { useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  Settings, Shield, FileSpreadsheet, FileArchive, Sparkles, CreditCard, 
  Building, Database, Bell, Lock, CheckCircle2, Cpu, KeyRound, User, Mail,
  Eye, EyeOff, Save, ShieldAlert, Check
} from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUser, updatePassword } = useAuth();
  const { addToast } = useApp();

  const [name, setName] = useState(user?.name || 'Zynexta Admin Team');
  const [email, setEmail] = useState(user?.email || 'admin@zynexta.com');
  const [companyName, setCompanyName] = useState('Zynexta Software Solutions');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      addToast('Name and Email cannot be empty', 'error');
      return;
    }
    updateUser({ name, email, shopName: companyName });
    addToast('Admin profile & email updated successfully!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      addToast('Please enter your current password', 'error');
      return;
    }
    if (newPassword.length < 6) {
      addToast('New password must be at least 6 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match!', 'error');
      return;
    }

    updatePassword(newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    addToast('Admin password changed successfully!');
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-5xl">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">System Settings & Security</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your Admin account email, security credentials, and SaaS platform preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Admin Profile & Email Card */}
          <form onSubmit={handleSaveProfile} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-white">Admin Profile & Email</h3>
                <p className="text-[11px] text-slate-400">Update admin account details and platform email.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Admin Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold text-white focus:border-cyan-400 outline-none"
                    placeholder="Admin Full Name"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Admin Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold text-cyan-300 focus:border-cyan-400 outline-none"
                    placeholder="admin@zynexta.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Organization</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>

          {/* Change Admin Password Card */}
          <form onSubmit={handleChangePassword} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-white">Change Admin Password</h3>
                <p className="text-[11px] text-slate-400">Secure your admin dashboard access credentials.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Current Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full glass-input pl-10 pr-10 py-2.5 rounded-xl text-xs font-semibold text-white focus:border-amber-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters..."
                    className="w-full glass-input pl-10 pr-10 py-2.5 rounded-xl text-xs font-semibold text-white focus:border-amber-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password..."
                    className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <KeyRound className="w-4 h-4" />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>

        {/* FUTURE READY FEATURES ARCHITECTURE CARDS */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold font-heading text-white">Future Ready SaaS Features (Architecture Configured)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Excel Bulk Poster Generation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload `.xlsx` or `.csv` student mark lists to auto-generate hundreds of personalized posters in one batch.
              </p>
              <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                Schema Ready
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <FileArchive className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">ZIP Photo Batch Matcher</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload a `.zip` file of student photos named by admission number for automated template matching.
              </p>
              <span className="inline-block px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                Schema Ready
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Dynamic Watermarking</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated security watermark overlay for draft previews before final high-res download approval.
              </p>
              <span className="inline-block px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
                Schema Ready
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Subscription & Tier Billing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stripe & Razorpay payment gateway integration for automated monthly shop owner subscriptions.
              </p>
              <span className="inline-block px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold border border-purple-500/20">
                Schema Ready
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Building className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Multi-Tenant Organizations</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Support multiple regional branches, franchises, and separate security solution divisions.
              </p>
              <span className="inline-block px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20">
                Schema Ready
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Security Audit Logging</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Immutable security logs tracking template edits, share link generations, and IP access records.
              </p>
              <span className="inline-block px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-bold border border-rose-500/20">
                Schema Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
