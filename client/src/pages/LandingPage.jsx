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
      bgColor: '#0A0A0A',
      badgeBg: 'bg-[#C1121F]',
      badgeBorder: 'border-red-700',
      badgeText: 'text-white',
    },
    security: {
      title: 'CCTV Camera Mega Offer',
      category: 'Security Solutions',
      studentName: 'JK SOCIALSPARK HQ',
      rank: 'SPECIAL FESTIVAL DISCOUNT 40% OFF',
      school: 'Ph: +91 98765 43210 | www.jksocialspark.in',
      photo: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
      bgColor: '#111111',
      badgeBg: 'bg-[#C1121F]',
      badgeBorder: 'border-red-700',
      badgeText: 'text-white',
    },
    sports: {
      title: 'State Level Sports Champion',
      category: 'Athletics & Sports',
      studentName: 'RAHUL KRISHNA',
      rank: 'GOLD MEDALIST - ATHLETICS 2026',
      school: 'Government Sports Academy, Ernakulam',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      bgColor: '#0A0A0A',
      badgeBg: 'bg-[#C1121F]',
      badgeBorder: 'border-red-700',
      badgeText: 'text-white',
    }
  };

  const currentMockup = mockupTemplates[activeMockupTab];

  // Framer Motion Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#111111] selection:bg-[#C1121F] selection:text-white font-sans overflow-x-hidden">
      {/* Subtle Light Gray Grid Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 hero-bg-light-grid opacity-80" />

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E5E5E5] shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/logo.png" 
              alt="JK SocialSpark Logo" 
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
            />
            <div>
              <span className="text-[10px] font-black tracking-wider text-[#C1121F] uppercase block">Official SaaS Platform</span>
              <span className="font-heading font-extrabold text-base text-[#0A0A0A] tracking-tight">JK SocialSpark</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold text-[#222222]">
            <a href="#features" className="hover:text-[#C1121F] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#C1121F] transition-colors">How It Works</a>
            <a href="#demo" className="hover:text-[#C1121F] transition-colors">Live Demo</a>
            <a href="#pricing" className="hover:text-[#C1121F] transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-[#C1121F] transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin' : '/template/sslc-topper-2026'}
                className="px-5 py-2.5 bg-[#C1121F] hover:bg-[#8B0E16] text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 hover:scale-102"
              >
                <span>Go to {user.role === 'admin' ? 'Admin Dashboard' : 'Shop Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-[#222222] hover:text-[#C1121F] font-bold text-xs transition-colors"
                >
                  Admin Login
                </Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/template/sslc-topper-2026"
                    className="px-5 py-2.5 bg-[#C1121F] hover:bg-[#8B0E16] text-white font-bold rounded-xl text-xs transition-all shadow-md block"
                  >
                    Try Live Demo
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
            {/* Hero Badge */}
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#111111] text-[#0A0A0A] text-xs font-bold mb-8 shadow-xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C1121F] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C1121F]"></span>
                </span>
                <Sparkles className="w-4 h-4 text-[#C1121F]" />
                <span>Next-Gen Cloud Poster Generation SaaS by JK SocialSpark</span>
              </div>
            </motion.div>

            {/* Hero Heading */}
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-6xl lg:text-7xl font-black font-heading text-[#0A0A0A] tracking-tight leading-[1.1] max-w-5xl mx-auto"
            >
              Create Master Poster Templates.{' '}
              <span className="text-[#C1121F] inline-block">
                Share Unlimited
              </span>{' '}
              Links.
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              variants={fadeInUp}
              className="mt-6 text-[#555555] text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Admins design dynamic poster templates with drag & drop placeholders. Partner shop owners fill simple forms to generate print-ready posters in seconds!
            </motion.p>

            {/* Primary & Secondary CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/template/sslc-topper-2026"
                  className="px-8 py-4 bg-[#C1121F] hover:bg-[#8B0E16] text-white font-extrabold rounded-2xl text-sm transition-all shadow-md flex items-center gap-2.5"
                >
                  <span>Try Live Poster Generator Demo</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-[#FFFFFF] hover:bg-[#111111] text-[#111111] hover:text-white font-bold rounded-2xl text-sm border border-[#111111] transition-all flex items-center gap-2.5 shadow-xs"
                >
                  <ShieldCheck className="w-5 h-5 text-[#C1121F]" />
                  <span>Admin Login Portal</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Portal Access Links */}
            <motion.div 
              variants={fadeInUp}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-[#555555]"
            >
              <span className="font-bold text-[#111111]">Portal Access:</span>
              <Link 
                to="/login" 
                className="px-3.5 py-1.5 bg-[#FFFFFF] hover:bg-[#FFF1F2] text-[#0A0A0A] border border-[#E5E5E5] hover:border-[#C1121F] rounded-xl transition-all font-bold shadow-xs flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C1121F]" />
                <span>Super Admin Login</span>
              </Link>
              <span className="text-[#E5E5E5]">•</span>
              <Link 
                to="/template/sslc-topper-2026" 
                className="px-3.5 py-1.5 bg-[#FFFFFF] hover:bg-[#FFF1F2] text-[#0A0A0A] border border-[#E5E5E5] hover:border-[#C1121F] rounded-xl transition-all font-bold shadow-xs flex items-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5 text-[#C1121F]" />
                <span>Shop Owner Demo View</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* REAL INTERACTIVE CANVAS STUDIO SHOWCASE */}
          <motion.div 
            id="demo" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-16 max-w-6xl mx-auto rounded-3xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-xl overflow-hidden text-left"
          >
            {/* macOS Browser Bar */}
            <div className="px-5 py-3.5 bg-[#0A0A0A] border-b border-[#111111] flex flex-wrap items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#C1121F] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#555555] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#FFFFFF] inline-block" />
                <span className="text-xs text-slate-300 font-mono ml-2">www.jksocialspark.in/template/demo</span>
              </div>

              {/* Template Switcher Tabs */}
              <div className="flex items-center gap-1 bg-[#111111] p-1 rounded-xl border border-slate-800">
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
                        className="absolute inset-0 bg-[#C1121F] rounded-lg shadow-sm"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C1121F] animate-ping inline-block" />
                <span className="text-[11px] font-bold text-white">Live Studio Engine Active</span>
              </div>
            </div>

            {/* Live Interactive Studio UI */}
            <div className="grid grid-cols-1 lg:grid-cols-12 h-[530px] overflow-hidden bg-[#F8F8F6]">
              {/* Left Placeholder Palette */}
              <div className="hidden lg:block lg:col-span-3 bg-[#FFFFFF] border-r border-[#E5E5E5] p-4 space-y-2.5 overflow-y-auto">
                <span className="text-[10px] font-black uppercase text-[#C1121F] tracking-wider block mb-1">
                  Drag & Drop Placeholders
                </span>
                
                {[
                  { label: 'Photo Placeholder', icon: Camera },
                  { label: 'Student / Customer Name', icon: User },
                  { label: 'Class / Stream', icon: GraduationCap },
                  { label: 'Rank / Award Badge', icon: Award },
                  { label: 'QR Code Link', icon: QrCode },
                ].map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    whileHover={{ scale: 1.02, x: 2 }}
                    className="p-2.5 rounded-xl bg-[#F8F8F6] border border-[#E5E5E5] hover:border-[#C1121F] flex items-center gap-3 cursor-pointer transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-[#C1121F]" />
                    <span className="text-xs font-bold text-[#111111]">{item.label}</span>
                  </motion.div>
                ))}

                <div className="pt-4 border-t border-[#E5E5E5]">
                  <span className="text-[10px] text-[#555555] font-medium block">Template Dimensions</span>
                  <span className="text-xs font-bold text-[#111111] block">800 x 1000 px (Aspect 4:5)</span>
                </div>
              </div>

              {/* Center Live Canvas Preview */}
              <div className="lg:col-span-6 bg-[#0A0A0A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMockupTab}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="w-full max-w-[340px] h-[460px] rounded-2xl border-2 border-[#C1121F] shadow-2xl p-5 flex flex-col justify-between relative overflow-hidden group"
                    style={{ backgroundColor: currentMockup.bgColor }}
                  >
                    {/* Header Badge */}
                    <div className="relative z-10 text-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#C1121F] block">
                        {currentMockup.category}
                      </span>
                      <h3 className="font-heading font-extrabold text-base text-white tracking-tight leading-tight mt-0.5">
                        {currentMockup.title}
                      </h3>
                    </div>

                    {/* Student Photo Placeholder */}
                    <div className="relative z-10 my-2 mx-auto w-36 h-44 rounded-2xl border-2 border-dashed border-[#C1121F] overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-300">
                      <img src={currentMockup.photo} alt="Student" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-[#C1121F] text-[9px] font-bold rounded text-white shadow-md">
                        Photo Zone
                      </div>
                    </div>

                    {/* Rank Badge & Name */}
                    <div className="relative z-10 text-center space-y-1">
                      <div className={`inline-block px-3 py-1 ${currentMockup.badgeBg} border ${currentMockup.badgeBorder} rounded-full`}>
                        <span className={`text-[11px] font-black ${currentMockup.badgeText} block`}>{currentMockup.rank}</span>
                      </div>

                      <h4 className="font-heading font-extrabold text-lg text-white tracking-wider block">
                        {currentMockup.studentName}
                      </h4>
                      <p className="text-[10px] text-slate-300 truncate max-w-[280px] mx-auto">
                        {currentMockup.school}
                      </p>
                    </div>

                    {/* Footer QR */}
                    <div className="relative z-10 pt-2 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-400">
                      <span>Powered by JK SocialSpark</span>
                      <QrCode className="w-5 h-5 text-[#C1121F]" />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Property Inspector Preview */}
              <div className="hidden lg:block lg:col-span-3 bg-[#FFFFFF] border-l border-[#E5E5E5] p-4 space-y-4">
                <span className="text-[10px] font-black uppercase text-[#C1121F] tracking-wider block">
                  Property Inspector
                </span>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-[#555555] block mb-1 font-bold">Active Element</label>
                    <div className="px-3 py-1.5 bg-[#F8F8F6] rounded-xl border border-[#E5E5E5] text-xs font-bold text-[#0A0A0A]">
                      Rank / Award Badge
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#555555] block mb-1 font-bold">Font Family</label>
                    <div className="px-3 py-1.5 bg-[#F8F8F6] rounded-xl border border-[#E5E5E5] text-xs font-bold text-[#0A0A0A]">
                      Outfit (Modern Heavy)
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-[#555555] block mb-1 font-bold">Font Size</label>
                      <div className="px-3 py-1.5 bg-[#F8F8F6] rounded-xl border border-[#E5E5E5] text-xs font-bold text-[#C1121F]">
                        22 px
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-[#555555] block mb-1 font-bold">Alignment</label>
                      <div className="px-3 py-1.5 bg-[#F8F8F6] rounded-xl border border-[#E5E5E5] text-xs font-bold text-[#0A0A0A]">
                        Center
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E5E5]">
                  <Link
                    to="/login"
                    className="w-full py-2.5 bg-[#0A0A0A] hover:bg-[#C1121F] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Login to Customize
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* METRICS SHOWCASE BANNER */}
      <section className="py-14 bg-[#FFFFFF] border-y border-[#E5E5E5] relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '48+', label: 'Partner Printing Shops', color: 'text-[#0A0A0A]' },
            { value: '1,200+', label: 'Posters Generated', color: 'text-[#C1121F]' },
            { value: '100%', label: 'High-DPI Print Quality', color: 'text-[#0A0A0A]' },
            { value: '0.4s', label: 'Instant Live Canvas Render', color: 'text-[#C1121F]' },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <h3 className={`text-3xl sm:text-4xl font-black font-heading ${stat.color}`}>{stat.value}</h3>
              <p className="text-xs text-[#555555] mt-1.5 font-bold">{stat.label}</p>
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
            <span className="text-xs font-black text-[#C1121F] uppercase tracking-widest block mb-2">
              Engineered for Printing & Media SaaS
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-heading text-[#0A0A0A] tracking-tight">
              Everything You Need to Power Poster Distribution
            </h2>
            <p className="text-[#555555] text-sm sm:text-base mt-3 leading-relaxed font-medium">
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
              },
              {
                icon: Link2,
                tag: '1-Click Share',
                title: 'Unique Share Links',
                desc: 'Generate clean, shareable web links and instant QR codes. Share them with hundreds of shop owners with custom expiration dates.',
              },
              {
                icon: Sparkles,
                tag: 'Zero Complexity',
                title: 'Auto-Generated Shop Forms',
                desc: 'Shop owners see NO canvas handles or complexity. They get a clean, distilled form with live side-by-side poster preview.',
              },
              {
                icon: Printer,
                tag: '100% Crisp DPI',
                title: 'High Resolution Export',
                desc: 'Export crisp PNG and JPG files engineered for high-DPI offset printing or digital social media broadcasting.',
              },
              {
                icon: TrendingUp,
                tag: 'Live Metrics',
                title: 'Real-Time Analytics',
                desc: 'Track how many posters each shop owner generates, monitor top performing templates, and audit download statistics.',
              },
              {
                icon: ShieldCheck,
                tag: 'SaaS Security',
                title: 'Role-Based Access',
                desc: 'Super Admin governance for template creation, user management, and security settings while shop owners get dedicated portals.',
              }
            ].map((feat, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="relative bg-[#FFFFFF] p-8 rounded-3xl border border-[#E5E5E5] hover:border-[#111111] transition-all duration-300 shadow-xs hover:shadow-xl group flex flex-col justify-between overflow-hidden"
              >
                {/* Top Red Accent Line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#C1121F] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    {/* Icon Pod */}
                    <div className="w-14 h-14 rounded-2xl bg-[#0A0A0A] text-white flex items-center justify-center group-hover:bg-[#C1121F] transition-colors duration-300">
                      <feat.icon className="w-7 h-7 stroke-[2.2]" />
                    </div>

                    {/* Tag Badge */}
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#FFF1F2] text-[#C1121F] border border-red-200 uppercase tracking-wider">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-heading text-[#0A0A0A] mb-2.5 group-hover:text-[#C1121F] transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-[#555555] text-xs sm:text-sm leading-relaxed font-medium">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5E5E5] flex items-center justify-between text-xs font-bold text-[#555555] group-hover:text-[#C1121F] transition-colors">
                  <span>Explore Feature</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 relative z-10 bg-[#F8F8F6] border-t border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-xs font-black text-[#C1121F] uppercase tracking-widest block mb-2">Workflow Simplicity</span>
            <h2 className="text-3xl sm:text-5xl font-black font-heading text-[#0A0A0A] tracking-tight">How It Works in 3 Simple Steps</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                step: '1',
                title: 'Admin Creates Template',
                desc: 'Upload background poster artwork, add photo & text placeholders, set typography and colors in the template builder.',
              },
              {
                step: '2',
                title: 'Share Unique Link',
                desc: 'Copy unique template link or QR code and send to partner shop owners via WhatsApp or email.',
              },
              {
                step: '3',
                title: 'Shop Owner Generates',
                desc: 'Shop owner opens link, uploads student photo, types details, and downloads high-res poster instantly.',
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-[#FFFFFF] border border-[#E5E5E5] hover:border-[#C1121F] p-8 rounded-3xl text-center relative shadow-xs hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-[#0A0A0A] group-hover:bg-[#C1121F] text-white font-black flex items-center justify-center mx-auto mb-5 text-base shadow-sm transition-colors">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold font-heading text-[#0A0A0A] mb-2.5 group-hover:text-[#C1121F] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed font-medium">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 bg-[#FFFFFF] border-t border-[#E5E5E5] relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-xs font-black text-[#C1121F] uppercase tracking-widest block mb-2">Flexible SaaS Plans</span>
            <h2 className="text-3xl sm:text-5xl font-black font-heading text-[#0A0A0A] tracking-tight">Commercial SaaS Pricing</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan 1 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#F8F8F6] p-8 rounded-3xl border border-[#E5E5E5] hover:border-[#111111] flex flex-col justify-between transition-all"
            >
              <div>
                <span className="text-xs font-black text-[#555555] uppercase tracking-wider">Starter Shop</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#0A0A0A] font-heading">₹1,999</span>
                  <span className="text-xs text-[#555555]">/ month</span>
                </div>
                <p className="text-xs text-[#555555] mt-2 mb-6 font-medium">Ideal for local printing shops & studios</p>
                <ul className="space-y-3 text-xs text-[#111111] font-medium mb-8">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#C1121F] shrink-0" /> Up to 25 Active Templates</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#C1121F] shrink-0" /> 500 Poster Downloads/mo</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#C1121F] shrink-0" /> PNG & JPG Export</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#C1121F] shrink-0" /> Standard Support</li>
                </ul>
              </div>
              <Link to="/login" className="w-full py-3.5 bg-[#FFFFFF] hover:bg-[#111111] text-[#111111] hover:text-white text-xs font-bold rounded-xl text-center block transition-colors border border-[#111111]">
                Choose Starter
              </Link>
            </motion.div>

            {/* Plan 2 - Featured (Red Border Accent) */}
            <motion.div 
              whileHover={{ y: -7 }}
              className="bg-[#FFFFFF] p-8 rounded-3xl border-2 border-[#C1121F] relative flex flex-col justify-between shadow-xl"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#C1121F] text-white text-[10px] font-black rounded-full uppercase tracking-wider shadow-md">
                Most Popular
              </div>
              <div>
                <span className="text-xs font-black text-[#C1121F] uppercase tracking-wider">Agency Pro</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#0A0A0A] font-heading">₹4,999</span>
                  <span className="text-xs text-[#555555]">/ month</span>
                </div>
                <p className="text-xs text-[#555555] mt-2 mb-6 font-medium">Designed for growing printing presses</p>
                <ul className="space-y-3 text-xs text-[#111111] font-medium mb-8">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#C1121F] shrink-0" /> Unlimited Templates</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#C1121F] shrink-0" /> Unlimited Poster Downloads</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#C1121F] shrink-0" /> High-DPI Print Ready PNG</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#C1121F] shrink-0" /> Custom QR & Branding</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#C1121F] shrink-0" /> Priority Support</li>
                </ul>
              </div>
              <Link to="/login" className="w-full py-3.5 bg-[#C1121F] hover:bg-[#8B0E16] text-white text-xs font-bold rounded-xl text-center block transition-colors shadow-md">
                Get Agency Pro
              </Link>
            </motion.div>

            {/* Plan 3 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#F8F8F6] p-8 rounded-3xl border border-[#E5E5E5] hover:border-[#111111] flex flex-col justify-between transition-all"
            >
              <div>
                <span className="text-xs font-black text-[#555555] uppercase tracking-wider">Enterprise Custom</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#0A0A0A] font-heading">Custom</span>
                </div>
                <p className="text-xs text-[#555555] mt-2 mb-6 font-medium">For large security & education networks</p>
                <ul className="space-y-3 text-xs text-[#111111] font-medium mb-8">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#C1121F] shrink-0" /> Dedicated Server & Cloud Backup</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#C1121F] shrink-0" /> Excel Bulk Generation Architecture</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#C1121F] shrink-0" /> Custom Domain & API Access</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#C1121F] shrink-0" /> 24/7 Account Manager</li>
                </ul>
              </div>
              <Link to="/login" className="w-full py-3.5 bg-[#FFFFFF] hover:bg-[#111111] text-[#111111] hover:text-white text-xs font-bold rounded-xl text-center block transition-colors border border-[#111111]">
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 relative z-10 bg-[#F8F8F6]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-black text-[#C1121F] uppercase tracking-widest block mb-2">Got Questions?</span>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-[#0A0A0A] tracking-tight">Frequently Asked Questions</h2>
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
                className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-xs transition-colors group"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-[#0A0A0A] group-hover:text-[#C1121F] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-[#C1121F]' : 'text-[#555555]'}`} />
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
                      <div className="px-5 pb-5 text-xs text-[#555555] font-medium leading-relaxed border-t border-[#E5E5E5] pt-3">
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
      <footer className="bg-[#0A0A0A] border-t border-[#111111] py-12 relative z-10 text-[#A3A3A3]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="JK SocialSpark Logo" 
              className="h-8 w-auto object-contain" 
            />
            <span className="text-xs text-[#A3A3A3]">
              © 2026 <strong className="text-white font-bold">JK SocialSpark</strong>. All Rights Reserved. Powerful Smart Poster Studio SaaS Platform.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-bold text-[#A3A3A3]">
            <Link to="/login" className="hover:text-white transition-colors">Admin Login</Link>
            <Link to="/template/sslc-topper-2026" className="hover:text-white transition-colors">Demo Link</Link>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
