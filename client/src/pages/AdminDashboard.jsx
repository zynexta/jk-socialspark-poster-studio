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

  const fallbackCopyTextToClipboard = (text) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  };

  const handleCopyShareUrl = (token) => {
    const fullUrl = `${window.location.origin}/template/${token}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(fullUrl).catch(() => {
          fallbackCopyTextToClipboard(fullUrl);
        });
      } else {
        fallbackCopyTextToClipboard(fullUrl);
      }
    } catch {
      fallbackCopyTextToClipboard(fullUrl);
    }
    setCopiedToken(true);
    addToast('Unique template share link copied!');
    setTimeout(() => setCopiedToken(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-[#FFFFFF] p-6 sm:p-8 border border-[#E5E5E5] shadow-xs text-[#111111]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1F2] border border-red-200 text-[#C1121F] text-xs font-black mb-3 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Super Admin Control Dashboard
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#0A0A0A] tracking-tight">
                Zynexta Poster Studio Control Center
              </h1>
              <p className="text-[#555555] text-xs sm:text-sm mt-1 max-w-xl leading-relaxed font-medium">
                Manage dynamic poster templates, issue shop owner credentials, and monitor regional poster generation stats in real-time.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/admin/templates/builder/new"
                className="px-5 py-2.5 bg-[#C1121F] hover:bg-[#8B0E16] text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Layers className="w-4 h-4" />
                Build Poster Template
              </Link>
              <Link
                to="/admin/templates"
                className="px-4 py-2.5 bg-[#FFFFFF] hover:bg-[#111111] text-[#111111] hover:text-white font-bold text-xs rounded-xl border border-[#111111] transition-colors"
              >
                Manage All Templates
              </Link>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] hover:border-[#111111] rounded-3xl p-6 shadow-xs transition-all hover:-translate-y-0.5 group">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#555555] uppercase tracking-wider block mb-1">Total Templates</span>
                <h3 className="text-3xl font-black text-[#0A0A0A] font-heading">{templates.length}</h3>
                <span className="text-[11px] text-[#C1121F] font-bold mt-2 inline-flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12% this month
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] border border-red-200 flex items-center justify-center text-[#C1121F]">
                <Layers className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E5E5E5] hover:border-[#111111] rounded-3xl p-6 shadow-xs transition-all hover:-translate-y-0.5 group">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#555555] uppercase tracking-wider block mb-1">Posters Generated</span>
                <h3 className="text-3xl font-black text-[#C1121F] font-heading">{generatedPosters.length}</h3>
                <span className="text-[11px] text-[#555555] font-bold mt-2 inline-flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-[#C1121F]" /> +34% active shop usage
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#F5F5F3] border border-[#E5E5E5] flex items-center justify-center text-[#0A0A0A]">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E5E5E5] hover:border-[#111111] rounded-3xl p-6 shadow-xs transition-all hover:-translate-y-0.5 group">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#555555] uppercase tracking-wider block mb-1">Active Shop Owners</span>
                <h3 className="text-3xl font-black text-[#0A0A0A] font-heading">48</h3>
                <span className="text-[11px] text-[#555555] font-bold mt-2 inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#C1121F]" /> Across 8 districts
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] border border-red-200 flex items-center justify-center text-[#C1121F]">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Templates & Recent Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Templates List */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
              <div>
                <h2 className="text-lg font-bold font-heading text-[#0A0A0A]">Active Templates</h2>
                <p className="text-xs text-[#555555] font-medium">Master templates available for shop owner links</p>
              </div>
              <Link to="/admin/templates" className="text-xs font-bold text-[#C1121F] hover:text-[#8B0E16] flex items-center gap-1">
                View All ({templates.length}) <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {templates.slice(0, 4).map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-[#F8F8F6] border border-[#E5E5E5] hover:border-[#111111] transition-all group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={tmpl.bgImage}
                      alt={tmpl.title}
                      className="w-16 h-20 object-cover rounded-xl border border-[#E5E5E5] shadow-xs group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-black text-[#C1121F] uppercase tracking-wider block mb-0.5">
                        {tmpl.category}
                      </span>
                      <h4 className="font-bold text-sm text-[#0A0A0A] truncate max-w-[220px]">{tmpl.title}</h4>
                      <p className="text-xs text-[#555555] font-medium mt-1 flex items-center gap-3">
                        <span>Placeholders: <strong className="text-[#0A0A0A]">{tmpl.placeholders?.length || 0}</strong></span>
                        <span>•</span>
                        <span>Generated: <strong className="text-[#0A0A0A]">{tmpl.generatedCount || 0} times</strong></span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/templates/builder/${tmpl.id}`}
                      className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#111111] text-[#111111] hover:text-white font-bold text-xs rounded-xl border border-[#111111] transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setShareModalTemplate(tmpl)}
                      className="px-3 py-1.5 bg-[#FFF1F2] hover:bg-red-100 text-[#C1121F] font-bold text-xs rounded-xl border border-red-200 transition-colors flex items-center gap-1"
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
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E5E5]">
                <div>
                  <h2 className="text-lg font-bold font-heading text-[#0A0A0A]">Recent Poster Activity</h2>
                  <p className="text-xs text-[#555555] font-medium">Live feed from regional shop owners</p>
                </div>
                <Clock className="w-4 h-4 text-[#777777]" />
              </div>

              <div className="space-y-4">
                {generatedPosters.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8F8F6] border border-[#E5E5E5]">
                    <img
                      src={p.previewUrl}
                      alt="Generated"
                      className="w-12 h-14 object-cover rounded-lg border border-[#E5E5E5]"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-xs text-[#0A0A0A] block truncate">{p.customerName}</span>
                      <span className="text-[10px] text-[#555555] block truncate">{p.generatedBy}</span>
                      <span className="text-[10px] text-[#C1121F] font-bold block mt-0.5">{p.date}</span>
                    </div>
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/admin/posters"
              className="mt-6 w-full py-2.5 bg-[#FFFFFF] hover:bg-[#111111] text-[#111111] hover:text-white font-bold text-xs rounded-xl text-center block transition-colors border border-[#111111]"
            >
              View Full History Logs
            </Link>
          </div>
        </div>

        {/* SHARE SYSTEM MODAL */}
        {shareModalTemplate && (
          <div className="fixed inset-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative text-[#111111]">
              <button
                onClick={() => setShareModalTemplate(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#F5F5F3] text-[#555555] hover:text-[#0A0A0A] hover:bg-[#E5E5E5]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF1F2] border border-red-200 flex items-center justify-center text-[#C1121F]">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-[#0A0A0A]">Share Poster Form Options</h3>
                  <p className="text-xs text-[#555555]">{shareModalTemplate.title}</p>
                </div>
              </div>

              {/* QR Code & Link Box */}
              {(() => {
                const activeToken = shareModalTemplate.shareToken || shareModalTemplate.id;
                const fullShareUrl = `${window.location.origin}/template/${activeToken}`;
                return (
                  <div className="bg-[#F8F8F6] p-4 rounded-2xl border border-[#E5E5E5] flex items-center gap-4">
                    <div className="w-24 h-24 bg-white rounded-xl p-2 shrink-0 flex items-center justify-center border border-[#E5E5E5]">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(fullShareUrl)}`}
                        alt="QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <span className="text-[10px] font-bold text-[#555555] uppercase tracking-wider block">
                        Unique Shareable Link
                      </span>
                      <div className="p-2 rounded-lg bg-[#FFFFFF] border border-[#E5E5E5] text-xs text-[#C1121F] font-mono truncate">
                        {fullShareUrl}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopyShareUrl(activeToken)}
                          className="flex-1 py-2 bg-[#C1121F] hover:bg-[#8B0E16] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedToken ? 'Copied' : 'Copy Link'}</span>
                        </button>

                        <Link
                          to={`/template/${activeToken}`}
                          target="_blank"
                          className="py-2 px-3 bg-[#FFFFFF] hover:bg-[#111111] text-[#111111] hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 border border-[#111111]"
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
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    <MessageSquare className="w-4 h-4 text-white" />
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
