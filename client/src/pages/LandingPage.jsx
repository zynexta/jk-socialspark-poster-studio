import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ArrowRight, ShieldCheck, Layers, Share2, Download, Zap, 
  Check, ChevronDown, QrCode, User, GraduationCap, Award, Camera,
  BarChart3, Palette, Link2, Printer, TrendingUp, ArrowUpRight, Wand2,
  Store
} from 'lucide-react';

export default function LandingPage() {
  const { user, loginAsAdmin, loginAsShopOwner } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeMockupTab, setActiveMockupTab] = useState('sslc');

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const mockupTemplates = {
    sslc: {
      title: 'SSLC State Topper 2026',
      category: 'Academic Distinction',
      studentName: 'ADITHYA V. NAIR',
      rank: 'FULL A+ (10/10 GPA)',
      school: 'St. Joseph Higher Secondary School, Calicut',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      bgColor: '#0F172A',
      badgeBg: 'from-amber-400/20 to-yellow-500/20',
      badgeBorder: 'border-amber-400/40',
      badgeText: 'text-amber-300',
    },
    security: {
      title: 'CCTV Camera Mega Offer',
      category: 'Security Solutions',
      studentName: 'ZYNEXTA SECURITY HQ',
      rank: 'SPECIAL FESTIVAL DISCOUNT 40% OFF',
      school: 'Ph: +91 98765 43210 | www.zynexta.com',
      photo: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
      bgColor: '#0284C7',
      badgeBg: 'from-cyan-400/20 to-blue-500/20',
      badgeBorder: 'border-cyan-400/40',
      badgeText: 'text-cyan-300',
    },
    sports: {
      title: 'State Level Sports Champion',
      category: 'Athletics & Sports',
      studentName: 'RAHUL KRISHNA',
      rank: 'GOLD MEDALIST - ATHLETICS 2026',
      school: 'Government Sports Academy, Ernakulam',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      bgColor: '#059669',
      badgeBg: 'from-emerald-400/20 to-teal-500/20',
      badgeBorder: 'border-emerald-400/40',
      badgeText: 'text-emerald-300',
    }
  };

  const currentMockup = mockupTemplates[activeMockupTab];

  // Framer Motion Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 selection:bg-cyan-500 selection:text-white font-sans overflow-x-hidden">
      {/* Dynamic Ambient Background Mesh Lights & Tech Grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 hero-bg-grid">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-tr from-blue-600/30 via-cyan-500/25 to-purple-600/30 blur-[120px] rounded-full opacity-70" />
        <div className="absolute top-[35%] -left-40 w-[650px] h-[650px] bg-cyan-500/20 blur-[140px] rounded-full opacity-60" />
        <div className="absolute top-[65%] -right-40 w-[650px] h-[650px] bg-indigo-600/20 blur-[140px] rounded-full opacity-60" />
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#060911]/85 backdrop-blur-2xl border-b border-slate-800/90 shadow-lg shadow-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-shadow">
              <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center font-extrabold text-white text-base group-hover:scale-105 transition-transform">
                ZX
              </div>
            </div>
            <div>
              <span className="text-[10px] font-extrabold tracking-wider text-cyan-400 uppercase block">Zynexta Software Solutions</span>
              <span className="font-heading font-extrabold text-base text-white tracking-tight">Smart Poster Studio</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
            <a href="#demo" className="hover:text-cyan-400 transition-colors">Live Demo</a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin' : '/template/sslc-topper-2026'}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center gap-1.5 hover:scale-105"
              >
                <span>Go to {user.role === 'admin' ? 'Admin Dashboard' : 'Shop Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-slate-300 hover:text-white font-semibold text-xs transition-colors"
                >
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/30 block border border-cyan-400/30"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-36 pb-20 z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            {/* Pulsing Animated Badge */}
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/50 text-cyan-300 text-xs font-bold mb-8 shadow-[0_0_30px_rgba(56,189,248,0.25)] backdrop-blur-xl">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
                </span>
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Next-Gen Cloud Poster Generation SaaS by Zynexta</span>
              </div>
            </motion.div>

            {/* Main Punchy Gradient Headline */}
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-white tracking-tight leading-[1.1] max-w-5xl mx-auto"
            >
              Create Master Poster Templates.{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_10px_25px_rgba(56,189,248,0.3)]">
                Share Unlimited Links.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              variants={fadeInUp}
              className="mt-6 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Admins design dynamic poster templates with drag & drop placeholders. Partner shop owners fill simple forms to generate print-ready posters in seconds!
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/template/sslc-topper-2026"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold rounded-2xl text-sm transition-all shadow-[0_0_40px_rgba(37,99,235,0.45)] border border-cyan-400/30 flex items-center gap-2.5"
                >
                  <span>Try Live Poster Generator Demo</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-slate-900/90 hover:bg-slate-800/90 text-slate-200 font-bold rounded-2xl text-sm border border-slate-700/80 transition-all flex items-center gap-2.5 backdrop-blur-xl shadow-2xl"
                >
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <span>Admin Login Portal</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Instant Demo Logins */}
            <motion.div 
              variants={fadeInUp}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400"
            >
              <span className="font-semibold text-slate-400">Portal Access:</span>
              <Link 
                to="/login" 
                className="px-3.5 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 rounded-xl transition-all font-bold hover:scale-105 shadow-md shadow-blue-500/10 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Super Admin Login</span>
              </Link>
              <span className="text-slate-600">•</span>
              <Link 
                to="/template/sslc-topper-2026" 
                className="px-3.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl transition-all font-bold hover:scale-105 shadow-md shadow-cyan-500/10 flex items-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Shop Owner Demo View</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* REAL INTERACTIVE CANVAS STUDIO SHOWCASE (Framer Motion Animated) */}
          <motion.div 
            id="demo" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-16 max-w-6xl mx-auto rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-[0_0_60px_rgba(56,189,248,0.12)] overflow-hidden text-left backdrop-blur-2xl"
          >
            {/* macOS Browser Bar */}
            <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
                <span className="text-xs text-slate-400 font-mono ml-2">app.zynexta.com/admin/builder</span>
              </div>

              {/* Template Switcher Tabs with Framer Motion layoutId */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {[
                  { id: 'sslc', label: 'SSLC Topper 2026' },
                  { id: 'security', label: 'Security Offer' },
                  { id: 'sports', label: 'Sports Champion' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveMockupTab(tab.id)}
                    className={`relative px-3.5 py-1.5 rounded-lg text-[11px] font-extrabold transition-colors ${
                      activeMockupTab === tab.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {activeMockupTab === tab.id && (
                      <motion.div
                        layoutId="activeMockupTab"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg shadow-md"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span className="text-[11px] font-bold text-emerald-400">Live Studio Engine Active</span>
              </div>
            </div>

            {/* Live Interactive Studio UI */}
            <div className="grid grid-cols-1 lg:grid-cols-12 h-[530px] overflow-hidden bg-slate-950">
              {/* Left Placeholder Palette */}
              <div className="hidden lg:block lg:col-span-3 bg-slate-900/90 border-r border-slate-800/80 p-4 space-y-2.5 overflow-y-auto">
                <span className="text-[10px] font-extrabold uppercase text-cyan-400 tracking-wider block mb-1">
                  Drag & Drop Placeholders
                </span>
                
                {[
                  { label: 'Photo Placeholder', icon: Camera, color: 'text-cyan-400 border-cyan-500/30' },
                  { label: 'Student / Customer Name', icon: User, color: 'text-blue-400 border-blue-500/30' },
                  { label: 'Class / Stream', icon: GraduationCap, color: 'text-indigo-400 border-indigo-500/30' },
                  { label: 'Rank / Award Badge', icon: Award, color: 'text-amber-400 border-amber-500/30' },
                  { label: 'QR Code Link', icon: QrCode, color: 'text-emerald-400 border-emerald-500/30' },
                ].map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    whileHover={{ scale: 1.03, x: 3 }}
                    className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3 cursor-pointer"
                  >
                    <item.icon className={`w-4 h-4 ${item.color.split(' ')[0]}`} />
                    <span className="text-xs font-semibold text-slate-200">{item.label}</span>
                  </motion.div>
                ))}

                <div className="pt-4 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-medium block">Template Dimensions</span>
                  <span className="text-xs font-bold text-slate-300 block">800 x 1000 px (Aspect 4:5)</span>
                </div>
              </div>

              {/* Center Live Canvas Preview with AnimatePresence Cross-Fade */}
              <div className="lg:col-span-6 bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMockupTab}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="w-full max-w-[340px] h-[460px] rounded-2xl border-2 border-cyan-500/60 shadow-2xl p-5 flex flex-col justify-between relative overflow-hidden group"
                    style={{ backgroundColor: currentMockup.bgColor }}
                  >
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-slate-900/80 to-slate-950/90" />

                    {/* Header Badge */}
                    <div className="relative z-10 text-center">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 block">
                        {currentMockup.category}
                      </span>
                      <h3 className="font-heading font-extrabold text-base text-white tracking-tight leading-tight mt-0.5">
                        {currentMockup.title}
                      </h3>
                    </div>

                    {/* Student Photo Placeholder */}
                    <div className="relative z-10 my-2 mx-auto w-36 h-44 rounded-2xl border-2 border-dashed border-cyan-400/60 overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-300">
                      <img src={currentMockup.photo} alt="Student" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-blue-600 text-[9px] font-bold rounded text-white shadow-md">
                        Photo Zone
                      </div>
                    </div>

                    {/* Rank Badge & Name */}
                    <div className="relative z-10 text-center space-y-1">
                      <div className={`inline-block px-3 py-1 bg-gradient-to-r ${currentMockup.badgeBg} border ${currentMockup.badgeBorder} rounded-full`}>
                        <span className={`text-[11px] font-extrabold ${currentMockup.badgeText} block`}>{currentMockup.rank}</span>
                      </div>

                      <h4 className="font-heading font-extrabold text-lg text-white tracking-wider block">
                        {currentMockup.studentName}
                      </h4>
                      <p className="text-[10px] text-slate-300 truncate max-w-[280px] mx-auto">
                        {currentMockup.school}
                      </p>
                    </div>

                    {/* Footer QR */}
                    <div className="relative z-10 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400">
                      <span>Powered by Zynexta SaaS Platform</span>
                      <QrCode className="w-5 h-5 text-cyan-400" />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Property Inspector Preview */}
              <div className="hidden lg:block lg:col-span-3 bg-slate-900/90 border-l border-slate-800/80 p-4 space-y-4">
                <span className="text-[10px] font-extrabold uppercase text-cyan-400 tracking-wider block">
                  Property Inspector
                </span>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Active Element</label>
                    <div className="px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold text-white">
                      Rank / Award Badge
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Font Family</label>
                    <div className="px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200">
                      Outfit (Modern Heavy)
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Font Size</label>
                      <div className="px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold text-cyan-400">
                        22 px
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Alignment</label>
                      <div className="px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold text-blue-400">
                        Center
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <Link
                    to="/admin/templates/builder/new"
                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <Layers className="w-4 h-4" />
                    Open Full Builder
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* METRICS SHOWCASE BANNER */}
      <section className="py-14 bg-slate-900/60 border-y border-slate-800/80 relative z-10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '48+', label: 'Partner Printing Shops', color: 'text-white' },
            { value: '1,200+', label: 'Posters Generated', color: 'text-cyan-400' },
            { value: '100%', label: 'High-DPI Print Quality', color: 'text-blue-400' },
            { value: '0.4s', label: 'Instant Live Canvas Render', color: 'text-emerald-400' },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <h3 className={`text-3xl sm:text-4xl font-extrabold font-heading ${stat.color}`}>{stat.value}</h3>
              <p className="text-xs text-slate-400 mt-1.5 font-semibold">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURE CARDS SECTION */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest block mb-2">
              Engineered for Printing & Media SaaS
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
              Everything You Need to Power Poster Distribution
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
              Built specifically for printing presses, security companies, and media agencies to streamline template distribution.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Palette,
                tag: 'Canvas Studio',
                title: 'Canva-Style Builder',
                desc: 'Admins upload background artwork and place dynamic placeholders for photos, names, ranks, dates, and QR codes with precision drag & drop.',
                podGradient: 'from-blue-600 via-indigo-600 to-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.4)]',
                topAccent: 'from-blue-500 to-cyan-400',
                badgeStyle: 'bg-blue-500/15 text-cyan-300 border-blue-500/30',
              },
              {
                icon: Link2,
                tag: '1-Click Share',
                title: 'Unique Share Links',
                desc: 'Generate clean, shareable web links and instant QR codes. Share them with hundreds of shop owners with custom expiration dates.',
                podGradient: 'from-cyan-500 via-teal-500 to-emerald-400 shadow-[0_0_25px_rgba(45,212,191,0.4)]',
                topAccent: 'from-cyan-400 to-teal-400',
                badgeStyle: 'bg-cyan-500/15 text-teal-300 border-cyan-500/30',
              },
              {
                icon: Sparkles,
                tag: 'Zero Complexity',
                title: 'Auto-Generated Shop Forms',
                desc: 'Shop owners see NO canvas handles or complexity. They get a clean, distilled form with live side-by-side poster preview.',
                podGradient: 'from-purple-600 via-indigo-600 to-cyan-400 shadow-[0_0_25px_rgba(168,85,247,0.4)]',
                topAccent: 'from-purple-500 to-cyan-400',
                badgeStyle: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
              },
              {
                icon: Printer,
                tag: '100% Crisp DPI',
                title: 'High Resolution Export',
                desc: 'Export crisp PNG and JPG files engineered for high-DPI offset printing or digital social media broadcasting.',
                podGradient: 'from-emerald-500 via-teal-500 to-cyan-400 shadow-[0_0_25px_rgba(52,211,153,0.4)]',
                topAccent: 'from-emerald-400 to-cyan-400',
                badgeStyle: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
              },
              {
                icon: TrendingUp,
                tag: 'Live Metrics',
                title: 'Real-Time Analytics',
                desc: 'Track how many posters each shop owner generates, monitor top performing templates, and audit download statistics.',
                podGradient: 'from-amber-500 via-orange-500 to-yellow-400 shadow-[0_0_25px_rgba(251,191,36,0.4)]',
                topAccent: 'from-amber-400 to-orange-400',
                badgeStyle: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
              },
              {
                icon: ShieldCheck,
                tag: 'SaaS Security',
                title: 'Role-Based Access',
                desc: 'Super Admin governance for template creation, user management, and security settings while shop owners get dedicated portals.',
                podGradient: 'from-rose-500 via-pink-500 to-purple-400 shadow-[0_0_25px_rgba(244,63,94,0.4)]',
                topAccent: 'from-rose-400 to-purple-400',
                badgeStyle: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
              }
            ].map((feat, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative bg-slate-900/60 p-8 rounded-3xl border border-slate-800/90 hover:border-cyan-500/60 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(56,189,248,0.3)] backdrop-blur-2xl group flex flex-col justify-between overflow-hidden"
              >
                {/* Top Accent Line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feat.topAccent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    {/* Glowing Gradient Icon Pod */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${feat.podGradient} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                      <feat.icon className="w-7 h-7 stroke-[2.2]" />
                    </div>

                    {/* Tag Badge */}
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${feat.badgeStyle} uppercase tracking-wider`}>
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-heading text-white mb-2.5 group-hover:text-cyan-300 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-cyan-400 transition-colors">
                  <span>Explore Feature</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 relative z-10 bg-slate-950/70 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest block mb-2">Workflow Simplicity</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">How It Works in 3 Simple Steps</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                step: '1',
                title: 'Admin Creates Template',
                desc: 'Upload background poster artwork, add photo & text placeholders, set typography and colors in the template builder.',
                badgeColor: 'from-blue-600 to-indigo-600 shadow-blue-600/40'
              },
              {
                step: '2',
                title: 'Share Unique Link',
                desc: 'Copy unique template link or QR code and send to partner shop owners via WhatsApp or email.',
                badgeColor: 'from-cyan-500 to-blue-600 shadow-cyan-500/40'
              },
              {
                step: '3',
                title: 'Shop Owner Generates',
                desc: 'Shop owner opens link, uploads student photo, types details, and downloads high-res poster instantly.',
                badgeColor: 'from-indigo-600 to-purple-600 shadow-indigo-600/40'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -6 }}
                className="bg-slate-900/90 border border-slate-800/90 hover:border-cyan-500/40 p-8 rounded-3xl text-center relative shadow-xl backdrop-blur-xl transition-all group"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${item.badgeColor} text-white font-extrabold flex items-center justify-center mx-auto mb-5 text-base shadow-lg group-hover:scale-110 transition-transform`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-bold font-heading text-white mb-2.5 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 bg-slate-950/90 border-t border-slate-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest block mb-2">Flexible SaaS Plans</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">Commercial SaaS Pricing</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan 1 */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-all backdrop-blur-xl"
            >
              <div>
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Starter Shop</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white font-heading">₹1,999</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 mb-6">Ideal for local printing shops & studios</p>
                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Up to 25 Active Templates</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 500 Poster Downloads/mo</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> PNG & JPG Export</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Standard Support</li>
                </ul>
              </div>
              <Link to="/login" className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl text-center block transition-colors border border-slate-700">
                Choose Starter
              </Link>
            </motion.div>

            {/* Plan 2 - Featured (Cyan Border Glow) */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-slate-900/90 p-8 rounded-3xl border-2 border-cyan-400 relative flex flex-col justify-between shadow-[0_0_40px_rgba(56,189,248,0.25)] backdrop-blur-2xl"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400 text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider shadow-lg">
                Most Popular
              </div>
              <div>
                <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">Agency Pro</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white font-heading">₹4,999</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 mb-6">Designed for growing printing presses</p>
                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Unlimited Templates</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Unlimited Poster Downloads</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> High-DPI Print Ready PNG</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Custom QR & Branding</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Priority Support</li>
                </ul>
              </div>
              <Link to="/login" className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold rounded-xl text-center block transition-all shadow-lg shadow-cyan-500/25">
                Get Agency Pro
              </Link>
            </motion.div>

            {/* Plan 3 */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-all backdrop-blur-xl"
            >
              <div>
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Enterprise Custom</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white font-heading">Custom</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 mb-6">For large security & education networks</p>
                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Dedicated Server & Cloud Backup</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Excel Bulk Generation Architecture</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Custom Domain & API Access</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 24/7 Account Manager</li>
                </ul>
              </div>
              <Link to="/login" className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl text-center block transition-colors border border-slate-700">
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest block mb-2">Got Questions?</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "Do shop owners need an account to generate posters?",
                a: "No! Shop owners simply open the unique template share link or QR code, fill out the student/customer information form, and download high-res posters directly."
              },
              {
                q: "What file formats can be exported?",
                a: "Posters can be downloaded in high-DPI PNG and JPG formats suitable for both high quality offset printing and digital sharing on WhatsApp."
              },
              {
                q: "Can the admin lock certain placeholder elements?",
                a: "Yes! Admins can lock logos, background frames, security badges, and static text so shop owners can only edit the designated dynamic fields."
              },
              {
                q: "Is mobile phone generation supported?",
                a: "Yes, the shop owner poster generator form is 100% responsive and works smoothly on smartphones, tablets, laptops, and desktop computers."
              }
            ].map((faq, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden transition-colors backdrop-blur-xl"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-white hover:text-cyan-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-cyan-400' : 'text-slate-500'}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-extrabold text-white text-xs shadow-md">
              ZX
            </div>
            <span className="text-xs text-slate-400">
              © 2026 <strong>Zynexta Software Solutions</strong>. All Rights Reserved. Zynexta Smart Poster Studio SaaS Platform.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-slate-400">
            <Link to="/login" className="hover:text-white transition-colors">Admin Login</Link>
            <Link to="/template/sslc-topper-2026" className="hover:text-white transition-colors">Demo Link</Link>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
