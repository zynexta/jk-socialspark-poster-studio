import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AdminLayout from '../components/layout/AdminLayout';
import { 
  Layers, CheckCircle2, ShoppingBag, TrendingUp, Sparkles, 
  ArrowUpRight, Clock, ShieldCheck, ChevronRight, Share2, 
  Copy, Check, X, Globe, MessageSquare, ExternalLink
} from 'lucide-react';

export default function AdminDashboard() {
  const { templates, generatedPosters, saveTemplate, addToast } = useApp();

  const [shareModalTemplate, setShareModalTemplate] = useState(null);
  const [copiedToken, setCopiedToken] = useState(false);

  const handleCopyShareUrl = (token) => {
    const fullUrl = `${window.location.origin}/template/${token}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(true);
    addToast('Unique template share link copied!');
    setTimeout(() => setCopiedToken(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 p-6 sm:p-8 border border-blue-500/20 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-xs font-bold mb-3 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Super Admin Control Dashboard
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
                Zynexta Poster Studio Control Center
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                Manage dynamic poster templates, issue shop owner credentials, and monitor regional poster generation stats in real-time.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/admin/templates/builder/new"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Layers className="w-4 h-4" />
                Build Poster Template
              </Link>
              <Link
                to="/admin/templates"
                className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-bold text-xs rounded-2xl border border-slate-700 transition-colors"
              >
                Manage All Templates
              </Link>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Templates</span>
                <h3 className="text-3xl font-extrabold text-white font-heading">{templates.length}</h3>
                <span className="text-[11px] text-emerald-400 font-semibold mt-2 inline-flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12% this month
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Layers className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Posters Generated</span>
                <h3 className="text-3xl font-extrabold text-white font-heading">{generatedPosters.length}</h3>
                <span className="text-[11px] text-cyan-400 font-semibold mt-2 inline-flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +34% active shop usage
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Active Shop Owners</span>
                <h3 className="text-3xl font-extrabold text-white font-heading">48</h3>
                <span className="text-[11px] text-indigo-400 font-semibold mt-2 inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Across 8 districts
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Templates & Recent Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Templates List */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold font-heading text-white">Active Templates</h2>
                <p className="text-xs text-slate-400">Master templates available for shop owner links</p>
              </div>
              <Link to="/admin/templates" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                View All ({templates.length}) <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {templates.slice(0, 4).map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={tmpl.bgImage}
                      alt={tmpl.title}
                      className="w-16 h-20 object-cover rounded-xl border border-slate-800 shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-0.5">
                        {tmpl.category}
                      </span>
                      <h4 className="font-bold text-sm text-white truncate max-w-[220px]">{tmpl.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                        <span>Placeholders: <strong className="text-slate-200">{tmpl.placeholders?.length || 0}</strong></span>
                        <span>•</span>
                        <span>Generated: <strong className="text-slate-200">{tmpl.generatedCount || 0} times</strong></span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/templates/builder/${tmpl.id}`}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setShareModalTemplate(tmpl)}
                      className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-semibold text-xs rounded-xl border border-blue-500/30 transition-colors flex items-center gap-1"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Link</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Generation Logs */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold font-heading text-white">Recent Poster Activity</h2>
                  <p className="text-xs text-slate-400">Live feed from regional shop owners</p>
                </div>
                <Clock className="w-4 h-4 text-slate-500" />
              </div>

              <div className="space-y-4">
                {generatedPosters.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/40 border border-slate-800/60">
                    <img
                      src={p.previewUrl}
                      alt="Generated"
                      className="w-12 h-14 object-cover rounded-lg border border-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-xs text-white block truncate">{p.customerName}</span>
                      <span className="text-[10px] text-slate-400 block truncate">{p.generatedBy}</span>
                      <span className="text-[10px] text-cyan-400 font-medium block mt-0.5">{p.date}</span>
                    </div>
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-bold">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/admin/posters"
              className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl text-center block transition-colors border border-slate-700"
            >
              View Full History Logs
            </Link>
          </div>
        </div>

        {/* SHARE SYSTEM MODAL */}
        {shareModalTemplate && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
              <button
                onClick={() => setShareModalTemplate(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">Share Poster Form Options</h3>
                  <p className="text-xs text-slate-400">{shareModalTemplate.title}</p>
                </div>
              </div>

              {/* QR Code & Link Box */}
              {(() => {
                const activeToken = shareModalTemplate.shareToken || shareModalTemplate.id;
                const fullShareUrl = `${window.location.origin}/template/${activeToken}`;
                return (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
                    <div className="w-24 h-24 bg-white rounded-xl p-2 shrink-0 flex items-center justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(fullShareUrl)}`}
                        alt="QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Unique Shareable Link
                      </span>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-400 font-mono truncate">
                        {fullShareUrl}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopyShareUrl(activeToken)}
                          className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                        >
                          {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedToken ? 'Copied' : 'Copy Link'}</span>
                        </button>

                        <Link
                          to={`/template/${activeToken}`}
                          target="_blank"
                          className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1 border border-slate-700"
                          title="Open Live Shop Form"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Direct WhatsApp Share Button */}
              {(() => {
                const activeToken = shareModalTemplate.shareToken || shareModalTemplate.id;
                return (
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `Check out and generate custom posters for ${shareModalTemplate.title} using this link: ${window.location.origin}/template/${activeToken}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-100" />
                    <span>Share Directly on WhatsApp</span>
                  </a>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
