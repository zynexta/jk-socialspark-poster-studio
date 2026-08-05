import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AdminLayout from '../components/layout/AdminLayout';
import { 
  Search, Plus, Layers, Share2, Copy, Trash2, Edit3, Eye, 
  Filter, QrCode, Calendar, Lock, Globe, Check, X, Sparkles, 
  MessageSquare
} from 'lucide-react';

export default function TemplateManagementPage() {
  const { templates, categories, deleteTemplate, duplicateTemplate, saveTemplate, addToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [shareModalTemplate, setShareModalTemplate] = useState(null);
  const [deleteConfirmTemplate, setDeleteConfirmTemplate] = useState(null);
  const [copiedToken, setCopiedToken] = useState(false);

  // Expiration settings for share modal
  const [expirationDate, setExpirationDate] = useState('2026-12-31');
  const [isPublic, setIsPublic] = useState(true);

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

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
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-white">Template Management</h1>
            <p className="text-xs text-slate-400 mt-1">
              Create, edit, duplicate, and share poster templates with shop owners.
            </p>
          </div>

          <Link
            to="/admin/templates/builder/new"
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Create New Template
          </Link>
        </div>

        {/* Search & Category Filter Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates by title or category..."
                className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-xs"
              />
            </div>

            {/* Total Badge */}
            <span className="text-xs text-slate-400">
              Showing <strong className="text-white font-bold">{filteredTemplates.length}</strong> of {templates.length} templates
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400'
              }`}
            >
              All Categories ({templates.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.name
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* TEMPLATES GRID */}
        {filteredTemplates.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center">
            <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">No Templates Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No poster templates matched your search filter. Create a new template or reset filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="glass-card rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-between group"
              >
                <div>
                  {/* Poster Thumbnail */}
                  <div className="relative h-56 bg-slate-950 overflow-hidden border-b border-slate-800">
                    <img
                      src={tmpl.bgImage}
                      alt={tmpl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-[10px] font-bold text-cyan-400 uppercase">
                      {tmpl.category}
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700 text-[10px] font-bold text-slate-300">
                        {tmpl.aspectRatio}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmTemplate(tmpl);
                        }}
                        className="p-1.5 rounded-full bg-rose-950/80 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 transition-all shadow-md hover:scale-110"
                        title="Delete Template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-base text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {tmpl.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span>Placeholders: <strong className="text-slate-200">{tmpl.placeholders?.length || 0}</strong></span>
                      <span>•</span>
                      <span>Generations: <strong className="text-emerald-400">{tmpl.generatedCount || 0}</strong></span>
                    </p>
                  </div>
                </div>

                {/* Card Actions Footer (4 Buttons) */}
                <div className="p-4 pt-0 grid grid-cols-4 gap-1.5">
                  <Link
                    to={`/admin/templates/builder/${tmpl.id}`}
                    className="py-2 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1 border border-slate-700 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Edit</span>
                  </Link>

                  <button
                    onClick={() => setShareModalTemplate(tmpl)}
                    className="py-2 px-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-semibold rounded-xl text-xs flex items-center justify-center gap-1 border border-blue-500/30 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Share</span>
                  </button>

                  <button
                    onClick={() => duplicateTemplate(tmpl.id)}
                    className="py-2 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1 border border-slate-700 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Copy</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmTemplate(tmpl)}
                    className="py-2 px-2 bg-rose-500/15 hover:bg-rose-600 text-rose-300 hover:text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1 border border-rose-500/30 transition-colors"
                    title="Delete Template"
                  >
                    <Trash2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

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
                  <h3 className="font-heading font-bold text-lg text-white">Shareable Link & Access Controls</h3>
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
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Unique Shareable URL
                      </span>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-400 font-mono truncate mb-2">
                        {fullShareUrl}
                      </div>
                      <button
                        onClick={async () => {
                          const saved = await saveTemplate({
                            ...shareModalTemplate,
                            shareToken: activeToken,
                            isPublic: isPublic,
                            expirationDate: expirationDate,
                          });
                          const finalTok = saved?.shareToken || activeToken;
                          handleCopyShareUrl(finalTok);
                        }}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                      >
                        {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedToken ? 'Copied to Clipboard' : 'Copy Share Link'}</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Settings Controls */}
              <div className="space-y-4 pt-1">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Custom Link Slug / URL Token</label>
                  <div className="relative flex items-center">
                    <span className="bg-slate-950 px-3 py-2 text-xs text-slate-500 font-mono border border-r-0 border-slate-800 rounded-l-xl select-none">
                      /template/
                    </span>
                    <input
                      type="text"
                      value={shareModalTemplate.shareToken || ''}
                      onChange={(e) => {
                        const cleanSlug = e.target.value.toLowerCase().replace(/[^\w-]/g, '-');
                        setShareModalTemplate(prev => ({
                          ...prev,
                          shareToken: cleanSlug
                        }));
                      }}
                      placeholder="e.g. sslc-topper-2026"
                      className="w-full glass-input px-3 py-2 rounded-r-xl text-xs font-mono text-cyan-300 outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                  <div>
                    <span className="text-xs font-semibold text-white flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-400" /> Public Access Enabled
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {isPublic ? 'Anyone with the link can generate posters' : 'Link is disabled (Private / Disabled mode)'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextPublic = !isPublic;
                      setIsPublic(nextPublic);
                      saveTemplate({
                        ...shareModalTemplate,
                        isPublic: nextPublic,
                        expirationDate: expirationDate,
                      });
                    }}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                      isPublic ? 'bg-emerald-600' : 'bg-slate-800'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isPublic ? 'translate-x-5' : ''}`} />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Link Expiration Date</label>
                  <input
                    type="date"
                    value={expirationDate}
                    onChange={(e) => {
                      const nextExp = e.target.value;
                      setExpirationDate(nextExp);
                      saveTemplate({
                        ...shareModalTemplate,
                        isPublic: isPublic,
                        expirationDate: nextExp,
                      });
                    }}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs text-slate-200"
                  />
                </div>

                {/* Direct WhatsApp Share Button */}
                <button
                  onClick={async () => {
                    const updated = {
                      ...shareModalTemplate,
                      isPublic: isPublic,
                      expirationDate: expirationDate,
                    };
                    const saved = await saveTemplate(updated);
                    const targetToken = saved?.shareToken || shareModalTemplate.shareToken;
                    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `Check out and generate custom posters for ${shareModalTemplate.title} using this link: ${window.location.origin}/template/${targetToken}`
                    )}`;
                    window.open(url, '_blank');
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] mt-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-100" />
                  <span>Share Directly on WhatsApp</span>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setShareModalTemplate(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
                <button
                  onClick={async () => {
                    const updated = {
                      ...shareModalTemplate,
                      isPublic: isPublic,
                      expirationDate: expirationDate,
                    };
                    await saveTemplate(updated);
                    setShareModalTemplate(null);
                    addToast('Share link settings saved successfully!');
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 hover:scale-[1.02] transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Link Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deleteConfirmTemplate && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
              <button
                onClick={() => setDeleteConfirmTemplate(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-heading font-bold text-lg text-white">Delete Poster Template?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Are you sure you want to remove <strong className="text-slate-200 font-bold">"{deleteConfirmTemplate.title}"</strong>? This action will delete the template permanently.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmTemplate(null)}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs border border-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteTemplate(deleteConfirmTemplate.id);
                    setDeleteConfirmTemplate(null);
                  }}
                  className="py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-rose-600/30 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Yes, Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
