import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AdminLayout from '../components/layout/AdminLayout';
import { 
  Search, Plus, Layers, Share2, Copy, Trash2, Edit3, Eye, 
  Filter, QrCode, Calendar, Lock, Globe, Check, X, Sparkles, 
  MessageSquare
} from 'lucide-react';
import { getTemplateShareUrl } from '../utils/url';

export default function TemplateManagementPage() {
  const { templates, categories, deleteTemplate, duplicateTemplate, saveTemplate, addToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [shareModalTemplate, setShareModalTemplate] = useState(null);
  const [deleteConfirmTemplate, setDeleteConfirmTemplate] = useState(null);
  const [copiedToken, setCopiedToken] = useState(false);

  // Expiration settings for share modal
  const [expirationDate, setExpirationDate] = useState('2026-12-31');
  const [enableExpiration, setEnableExpiration] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

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
    const fullUrl = getTemplateShareUrl(token);
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
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black font-heading text-[#0A0A0A]">Template Management</h1>
            <p className="text-xs text-[#555555] font-medium mt-1">
              Create, edit, duplicate, and share poster templates with shop owners.
            </p>
          </div>

          <Link
            to="/admin/templates/builder/new"
            className="px-5 py-3 bg-[#C1121F] hover:bg-[#8B0E16] text-white font-extrabold rounded-xl text-xs shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4" />
            Create New Template
          </Link>
        </div>

        {/* Search & Category Filter Header */}
        <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl p-4 sm:p-6 space-y-4 shadow-xs">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates by title or category..."
                className="w-full bg-[#F8F8F6] border border-[#E5E5E5] focus:border-[#C1121F] text-[#111111] placeholder-[#777777] pl-10 pr-4 py-2 rounded-xl text-xs outline-none transition-colors"
              />
            </div>

            {/* Total Badge */}
            <span className="text-xs text-[#555555] font-medium">
              Showing <strong className="text-[#0A0A0A] font-bold">{filteredTemplates.length}</strong> of {templates.length} templates
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-[#C1121F] text-white shadow-xs'
                  : 'bg-[#F8F8F6] hover:bg-[#E5E5E5] text-[#555555] border border-[#E5E5E5]'
              }`}
            >
              All Categories ({templates.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.name
                    ? 'bg-[#C1121F] text-white shadow-xs'
                    : 'bg-[#F8F8F6] hover:bg-[#E5E5E5] text-[#555555] border border-[#E5E5E5]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* TEMPLATES GRID */}
        {filteredTemplates.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl p-12 text-center shadow-xs">
            <Layers className="w-12 h-12 text-[#777777] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0A0A0A]">No Templates Found</h3>
            <p className="text-xs text-[#555555] mt-1 max-w-sm mx-auto font-medium">
              No poster templates matched your search filter. Create a new template or reset filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-[#FFFFFF] rounded-3xl overflow-hidden border border-[#E5E5E5] hover:border-[#111111] flex flex-col justify-between transition-all hover:-translate-y-0.5 shadow-xs group"
              >
                <div>
                  {/* Poster Thumbnail */}
                  <div className="relative h-56 bg-[#0A0A0A] overflow-hidden border-b border-[#E5E5E5]">
                    <img
                      src={tmpl.bgImage}
                      alt={tmpl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#FFFFFF]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#E5E5E5] text-[10px] font-black text-[#C1121F] uppercase">
                      {tmpl.category}
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span className="bg-[#FFFFFF]/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#E5E5E5] text-[10px] font-bold text-[#0A0A0A]">
                        {tmpl.aspectRatio}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmTemplate(tmpl);
                        }}
                        className="p-1.5 rounded-full bg-[#FFF1F2] hover:bg-[#C1121F] text-[#C1121F] hover:text-white border border-red-200 transition-all shadow-xs"
                        title="Delete Template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-base text-[#0A0A0A] group-hover:text-[#C1121F] transition-colors line-clamp-1">
                      {tmpl.title}
                    </h3>
                    <p className="text-xs text-[#555555] font-medium mt-1 flex items-center gap-3">
                      <span>Placeholders: <strong className="text-[#0A0A0A]">{tmpl.placeholders?.length || 0}</strong></span>
                      <span>•</span>
                      <span>Generations: <strong className="text-[#C1121F]">{tmpl.generatedCount || 0}</strong></span>
                    </p>
                  </div>
                </div>

                {/* Card Actions Footer (4 Buttons) */}
                <div className="p-4 pt-0 grid grid-cols-4 gap-1.5">
                  <Link
                    to={`/admin/templates/builder/${tmpl.id}`}
                    className="py-2 px-2 bg-[#FFFFFF] hover:bg-[#111111] text-[#111111] hover:text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 border border-[#111111] transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 shrink-0" />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => {
                      setShareModalTemplate(tmpl);
                      setIsPublic(tmpl.isPublic !== undefined ? tmpl.isPublic : true);
                      setEnableExpiration(tmpl.enableExpiration || false);
                      setExpirationDate(tmpl.expirationDate || '2026-12-31');
                    }}
                    className="py-2 px-2 bg-[#FFF1F2] hover:bg-red-100 text-[#C1121F] font-bold rounded-xl text-xs flex items-center justify-center gap-1 border border-red-200 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Share</span>
                  </button>

                  <button
                    onClick={() => duplicateTemplate(tmpl.id)}
                    className="py-2 px-2 bg-[#F8F8F6] hover:bg-[#E5E5E5] text-[#0A0A0A] font-bold rounded-xl text-xs flex items-center justify-center gap-1 border border-[#E5E5E5] transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#555555] shrink-0" />
                    <span>Copy</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmTemplate(tmpl)}
                    className="py-2 px-2 bg-[#FFF1F2] hover:bg-[#C1121F] text-[#C1121F] hover:text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 border border-red-200 transition-colors"
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
          <div className="fixed inset-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl p-6 max-w-lg w-full relative shadow-2xl space-y-5 text-[#111111]">
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
                  <h3 className="font-heading font-bold text-lg text-[#0A0A0A]">Shareable Link & Access Controls</h3>
                  <p className="text-xs text-[#555555] font-medium">{shareModalTemplate.title}</p>
                </div>
              </div>

              {/* QR Code & Link Box */}
              {(() => {
                const activeToken = shareModalTemplate.shareToken || shareModalTemplate.id;
                const fullShareUrl = getTemplateShareUrl(activeToken);
                return (
                  <div className="bg-[#F8F8F6] p-4 rounded-2xl border border-[#E5E5E5] flex items-center gap-4">
                    <div className="w-24 h-24 bg-white rounded-xl p-2 shrink-0 flex items-center justify-center border border-[#E5E5E5]">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(fullShareUrl)}`}
                        alt="QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-[#555555] uppercase tracking-wider block mb-1">
                        Unique Shareable URL
                      </span>
                      <div className="p-2 rounded-lg bg-[#FFFFFF] border border-[#E5E5E5] text-xs text-[#C1121F] font-mono truncate mb-2">
                        {fullShareUrl}
                      </div>
                      <button
                        onClick={() => {
                          const currentTok = shareModalTemplate.shareToken || activeToken;
                          handleCopyShareUrl(currentTok);
                          saveTemplate({
                            ...shareModalTemplate,
                            shareToken: currentTok,
                            isPublic: isPublic,
                            enableExpiration: enableExpiration,
                            expirationDate: enableExpiration ? expirationDate : 'never',
                          }, { showToast: false });
                        }}
                        className="w-full py-2 bg-[#C1121F] hover:bg-[#8B0E16] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
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
                  <label className="text-xs font-bold text-[#0A0A0A] block mb-1">Custom Link Slug / URL Token</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-mono text-[#777777] pointer-events-none">/template/</span>
                    <input
                      type="text"
                      value={shareModalTemplate.shareToken || ''}
                      onChange={(e) => {
                        const nextSlug = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
                        setShareModalTemplate({
                          ...shareModalTemplate,
                          shareToken: nextSlug,
                        });
                      }}
                      placeholder="custom-link-name"
                      className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#C1121F] pl-22 pr-3 py-2 rounded-xl text-xs font-mono text-[#C1121F] outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-[#F8F8F6] p-3 rounded-2xl border border-[#E5E5E5]">
                  <div>
                    <span className="text-xs font-bold text-[#0A0A0A] flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-600" /> Public Access Enabled
                    </span>
                    <span className="text-[10px] text-[#555555] block mt-0.5 font-medium">
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
                        enableExpiration: enableExpiration,
                        expirationDate: enableExpiration ? expirationDate : 'never',
                      }, { showToast: false });
                      addToast(nextPublic ? 'Public access enabled for share link' : 'Public access set to private mode', 'info');
                    }}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                      isPublic ? 'bg-emerald-600' : 'bg-[#E5E5E5]'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isPublic ? 'translate-x-5' : ''}`} />
                  </button>
                </div>

                {/* Enable Expiration Date Toggle */}
                <div className="bg-[#F8F8F6] p-3 rounded-2xl border border-[#E5E5E5] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#0A0A0A] flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#C1121F]" /> Link Expiration Date
                      </span>
                      <span className="text-[10px] text-[#555555] block mt-0.5 font-medium">
                        {enableExpiration ? `Link expires on ${expirationDate}` : 'No expiration date (Link never expires)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const nextEnable = !enableExpiration;
                        setEnableExpiration(nextEnable);
                        saveTemplate({
                          ...shareModalTemplate,
                          enableExpiration: nextEnable,
                          isPublic: isPublic,
                          expirationDate: nextEnable ? (expirationDate || '2026-12-31') : 'never',
                        }, { showToast: false });
                        addToast(nextEnable ? 'Link expiration enabled' : 'Link expiration disabled (Never expires)', 'info');
                      }}
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                        enableExpiration ? 'bg-[#C1121F]' : 'bg-[#E5E5E5]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${enableExpiration ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>

                  {enableExpiration && (
                    <input
                      type="date"
                      value={expirationDate === 'never' ? '2026-12-31' : expirationDate}
                      onChange={(e) => {
                        const nextExp = e.target.value;
                        setExpirationDate(nextExp);
                        saveTemplate({
                          ...shareModalTemplate,
                          enableExpiration: true,
                          isPublic: isPublic,
                          expirationDate: nextExp,
                        }, { showToast: false });
                        addToast(`Expiration date set to ${nextExp}`, 'info');
                      }}
                      className="w-full bg-[#FFFFFF] border border-[#E5E5E5] px-3 py-2 rounded-xl text-xs text-[#0A0A0A] mt-2 outline-none"
                    />
                  )}
                </div>

                {/* Direct WhatsApp Share Button */}
                <button
                  onClick={async () => {
                    const updated = {
                      ...shareModalTemplate,
                      isPublic: isPublic,
                      enableExpiration: enableExpiration,
                      expirationDate: enableExpiration ? expirationDate : 'never',
                    };
                    const saved = await saveTemplate(updated, { showToast: false });
                    const targetToken = saved?.shareToken || shareModalTemplate.shareToken;
                    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `Check out and generate custom posters for ${shareModalTemplate.title} using this link: ${getTemplateShareUrl(targetToken)}`
                    )}`;
                    addToast('Opening WhatsApp to share link...', 'info');
                    window.open(url, '_blank');
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all mt-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>Share Directly on WhatsApp</span>
                </button>
              </div>

              <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between">
                <button
                  onClick={() => setShareModalTemplate(null)}
                  className="px-4 py-2 bg-[#F5F5F3] hover:bg-[#E5E5E5] text-[#555555] font-bold text-xs rounded-xl border border-[#E5E5E5]"
                >
                  Close
                </button>
                <button
                  onClick={async () => {
                    const updated = {
                      ...shareModalTemplate,
                      isPublic: isPublic,
                      enableExpiration: enableExpiration,
                      expirationDate: enableExpiration ? expirationDate : 'never',
                    };
                    await saveTemplate(updated, { showToast: false });
                    setShareModalTemplate(null);
                    addToast('Share link settings saved & synchronized successfully!');
                  }}
                  className="px-5 py-2 bg-[#C1121F] hover:bg-[#8B0E16] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
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
          <div className="fixed inset-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative text-[#111111]">
              <button
                onClick={() => setDeleteConfirmTemplate(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#F5F5F3] text-[#555555] hover:text-[#0A0A0A] hover:bg-[#E5E5E5]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] border border-red-200 flex items-center justify-center text-[#C1121F] mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-heading font-bold text-lg text-[#0A0A0A]">Delete Poster Template?</h3>
                <p className="text-xs text-[#555555] font-medium leading-relaxed">
                  Are you sure you want to remove <strong className="text-[#0A0A0A] font-bold">"{deleteConfirmTemplate.title}"</strong>? This action will delete the template permanently.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmTemplate(null)}
                  className="py-2.5 px-4 bg-[#F5F5F3] hover:bg-[#E5E5E5] text-[#555555] font-bold rounded-xl text-xs border border-[#E5E5E5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteTemplate(deleteConfirmTemplate.id);
                    setDeleteConfirmTemplate(null);
                  }}
                  className="py-2.5 px-4 bg-[#C1121F] hover:bg-[#8B0E16] text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
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
