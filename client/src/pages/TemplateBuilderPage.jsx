import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import CanvasBoard from '../components/builder/CanvasBoard';
import PlaceholderToolbar from '../components/builder/PlaceholderToolbar';
import PropertyInspector from '../components/builder/PropertyInspector';
import { 
  ArrowLeft, Save, Sparkles, Image as ImageIcon, Eye, 
  RotateCcw, RotateCw, CheckCircle2, Layers, Grid, Sliders, ChevronDown, Sun, Moon, Keyboard, X
} from 'lucide-react';

export default function TemplateBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { templates, categories, saveTemplate, addToast } = useApp();

  const isNew = id === 'new' || !id;

  const [template, setTemplate] = useState(() => {
    if (!isNew) {
      const found = templates.find((t) => t.id === id);
      if (found) return found;
    }
    const uniqueId = `tmpl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    return {
      id: uniqueId,
      shareToken: `poster-${Math.random().toString(36).substring(2, 8)}`,
      title: 'New Dynamic Poster Template',
      category: 'SSLC',
      width: 800,
      height: 1000,
      aspectRatio: '4:5',
      bgImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      bgColor: '#0F172A',
      placeholders: [],
    };
  });

  const [selectedPlaceholderId, setSelectedPlaceholderId] = useState(null);
  const [zoom, setZoom] = useState(0.75);
  const [showGrid, setShowGrid] = useState(true);
  const [mobileTab, setMobileTab] = useState('canvas'); // 'toolbar' | 'canvas' | 'inspector'
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [history, setHistory] = useState([template]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleSelectPlaceholder = (id) => {
    setSelectedPlaceholderId(id);
  };

  const handleAddPlaceholderWithTab = (type, label, defaultProps) => {
    handleAddPlaceholder(type, label, defaultProps);
    if (window.innerWidth < 1024) {
      setMobileTab('canvas');
    }
  };

  // Pro Keyboard Shortcuts Engine
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore shortcut key triggers if user is typing in an input, textarea, or select field
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select' || document.activeElement?.isContentEditable) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl + Z -> Undo
      if (ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
        addToast('Undo (Ctrl + Z)');
        return;
      }

      // Ctrl + Y or Ctrl + Shift + Z -> Redo
      if ((ctrlKey && e.key.toLowerCase() === 'y') || (ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z')) {
        e.preventDefault();
        handleRedo();
        addToast('Redo (Ctrl + Y)');
        return;
      }

      // Ctrl + S -> Save & Share Template
      if (ctrlKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
        addToast('Template Saved (Ctrl + S)');
        return;
      }

      // Ctrl + D -> Duplicate Selected Placeholder
      if (ctrlKey && e.key.toLowerCase() === 'd') {
        if (selectedPlaceholderId) {
          e.preventDefault();
          handleDuplicatePlaceholder(selectedPlaceholderId);
        }
        return;
      }

      // Delete or Backspace -> Delete Selected Placeholder
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedPlaceholderId) {
        e.preventDefault();
        handleDeletePlaceholder(selectedPlaceholderId);
        return;
      }

      // Escape -> Deselect Active Element
      if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedPlaceholderId(null);
        return;
      }

      // Arrow Keys -> Precise Nudge Positioning (1px or 10px with Shift)
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key) && selectedPlaceholderId) {
        e.preventDefault();
        const selectedItem = template?.placeholders?.find(p => String(p.id || p._id) === String(selectedPlaceholderId));
        if (!selectedItem || selectedItem.locked) return;

        const step = e.shiftKey ? 10 : 1;
        let dx = 0;
        let dy = 0;

        if (e.key === 'ArrowLeft') dx = -step;
        if (e.key === 'ArrowRight') dx = step;
        if (e.key === 'ArrowUp') dy = -step;
        if (e.key === 'ArrowDown') dy = step;

        handleUpdatePlaceholder(selectedItem.id || selectedItem._id, {
          x: (selectedItem.x || 0) + dx,
          y: (selectedItem.y || 0) + dy,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPlaceholderId, historyIndex, history, template]);

  // Theme Mode (Dark Mode default, option to toggle to Light Mode)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('jk_builder_theme') !== 'light';
  });

  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    localStorage.setItem('jk_builder_theme', nextTheme ? 'dark' : 'light');
    addToast(`Switched to ${nextTheme ? 'Dark Studio' : 'Light Studio'} mode`);
  };

  const selectedPlaceholder = template.placeholders?.find((p) => (p.id || p._id) === selectedPlaceholderId);

  const pushState = (newTemplate) => {
    setTemplate(newTemplate);
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, newTemplate]);
    setHistoryIndex(newHistory.length);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setTemplate(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setTemplate(history[historyIndex + 1]);
    }
  };

  const handleAddPlaceholder = (type, label, defaultProps = {}) => {
    const defaultWidth = defaultProps?.width || (type === 'photo' ? 280 : 350);
    const defaultHeight = defaultProps?.height || (type === 'photo' ? 340 : 50);

    const newPlaceholder = {
      id: `pl_${type}_${Date.now()}`,
      type,
      label: label || 'New Placeholder',
      x: 200,
      y: 200,
      width: defaultWidth,
      height: defaultHeight,
      zIndex: (template.placeholders?.length || 0) + 1,
      ...defaultProps,
    };
    const updated = {
      ...template,
      placeholders: [...(template.placeholders || []), newPlaceholder],
    };
    pushState(updated);
    setSelectedPlaceholderId(newPlaceholder.id);
    addToast(`Added ${newPlaceholder.label}`);
  };

  const handleUpdatePlaceholder = (plId, updates) => {
    const updated = {
      ...template,
      placeholders: template.placeholders?.map((p) => ((p.id || p._id) === plId ? { ...p, ...updates } : p)),
    };
    setTemplate(updated);
  };

  const handleDeletePlaceholder = (plId) => {
    const updated = {
      ...template,
      placeholders: template.placeholders?.filter((p) => (p.id || p._id) !== plId),
    };
    pushState(updated);
    if (selectedPlaceholderId === plId) {
      setSelectedPlaceholderId(null);
    }
    addToast('Element deleted');
  };

  const handleDuplicatePlaceholder = (plId) => {
    const source = template.placeholders?.find((p) => (p.id || p._id) === plId);
    if (!source) return;
    const copy = {
      ...source,
      id: `pl_${source.type}_${Date.now()}`,
      x: source.x + 20,
      y: source.y + 20,
      label: `${source.label} Copy`,
    };
    const updated = {
      ...template,
      placeholders: [...(template.placeholders || []), copy],
    };
    pushState(updated);
    setSelectedPlaceholderId(copy.id);
    addToast('Element duplicated');
  };

  const handleReorderLayer = (plId, direction) => {
    const items = [...(template.placeholders || [])];
    const index = items.findIndex((p) => (p.id || p._id) === plId);
    if (index < 0) return;

    if (direction === 'up' && index < items.length - 1) {
      const temp = items[index];
      items[index] = items[index + 1];
      items[index + 1] = temp;
    } else if (direction === 'down' && index > 0) {
      const temp = items[index];
      items[index] = items[index - 1];
      items[index - 1] = temp;
    }

    const reordered = items.map((item, idx) => ({ ...item, zIndex: idx + 1 }));
    pushState({ ...template, placeholders: reordered });
  };

  const handleBgUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const scale = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        pushState({ ...template, bgImage: compressedDataUrl });
        addToast('Background image optimized & uploaded!');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveTemplate(template);
    navigate('/admin/templates');
  };

  const handlePreviewShopForm = () => {
    try {
      const templateStr = JSON.stringify(template);
      
      // 1. Try Session Storage (Tab-isolated 5-10MB storage)
      try {
        sessionStorage.setItem('jk_poster_preview_template', templateStr);
      } catch (e) {
        console.warn('sessionStorage save info:', e);
      }

      // 2. Try Local Storage with Quota Safety & Cleanup
      try {
        localStorage.setItem('jk_poster_preview_template', templateStr);
      } catch (quotaErr) {
        console.warn('LocalStorage quota exceeded, clearing old cached logs to free up space...');
        // Clear heavy generated history logs to free up quota
        localStorage.removeItem('jk_poster_generated_history');
        
        try {
          localStorage.setItem('jk_poster_preview_template', templateStr);
        } catch (e2) {
          // Fallback: Strip heavy base64 image placeholders to guarantee preview load
          const lightweightTemplate = {
            ...template,
            placeholders: template.placeholders?.map((p) => ({
              ...p,
              placeholderImg: p.placeholderImg && p.placeholderImg.length > 50000 ? '' : p.placeholderImg,
            })),
          };
          localStorage.setItem('jk_poster_preview_template', JSON.stringify(lightweightTemplate));
        }
      }
    } catch (err) {
      console.error('Preview storage handling error:', err);
    }
    window.open('/template/preview', '_blank');
  };

  return (
    <div className={`h-screen flex flex-col overflow-hidden font-sans transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'
    }`}>
      {/* Top Header Toolbar */}
      <header className={`h-16 px-4 sm:px-6 flex items-center justify-between z-30 shrink-0 border-b transition-colors duration-200 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar py-1">
          <Link
            to="/admin/templates"
            className={`p-2 rounded-xl transition-colors shrink-0 ${
              isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
            title="Back to Templates"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className={`h-5 w-px shrink-0 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />

          {/* Template Title Input */}
          <input
            type="text"
            value={template.title}
            onChange={(e) => setTemplate({ ...template, title: e.target.value })}
            className={`font-heading font-bold text-xs sm:text-sm rounded-xl px-3 py-1.5 outline-none w-44 sm:w-64 transition-all border shrink-0 ${
              isDarkMode
                ? 'bg-slate-950 text-white border-slate-800 hover:border-slate-700 focus:border-blue-500'
                : 'bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/20'
            }`}
            placeholder="Template Title..."
          />

          {/* Category Dropdown */}
          <select
            value={template.category}
            onChange={(e) => setTemplate({ ...template, category: e.target.value })}
            className={`text-xs font-semibold rounded-xl px-3 py-1.5 outline-none shadow-xs border cursor-pointer shrink-0 ${
              isDarkMode
                ? 'bg-slate-950 text-cyan-400 border-slate-800'
                : 'bg-white text-blue-600 border-slate-200 hover:border-blue-300 focus:ring-2 focus:ring-blue-500/20'
            }`}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.name} className={isDarkMode ? 'bg-slate-900 text-slate-200' : 'text-slate-800'}>{c.name}</option>
            ))}
          </select>

          {/* Aspect Ratio Selector & Custom Dimension Inputs */}
          <div className="flex items-center gap-1.5 shrink-0">
            <select
              value={`${template.width}x${template.height}`}
              onChange={(e) => {
                const val = e.target.value;
                const [w, h] = val.split('x').map(Number);
                const ratioLabel = w === 800 && h === 1000 ? '4:5' : w === 800 && h === 800 ? '1:1' : w === 720 && h === 1280 ? '9:16' : w === 1280 && h === 720 ? '16:9' : 'A4';
                pushState({ ...template, width: w, height: h, aspectRatio: ratioLabel });
                addToast(`Canvas ratio updated to ${w}x${h} (${ratioLabel})`);
              }}
              className={`text-xs font-semibold rounded-xl px-3 py-1.5 outline-none shadow-xs border cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-950 text-indigo-400 border-slate-800'
                  : 'bg-white text-indigo-600 border-slate-200'
              }`}
            >
              <option value="800x1000">4:5 Poster (800x1000 px)</option>
              <option value="800x800">1:1 Square (800x800 px)</option>
              <option value="720x1280">9:16 Story (720x1280 px)</option>
              <option value="1280x720">16:9 Banner (1280x720 px)</option>
              <option value="842x1191">A4 Document (842x1191 px)</option>
            </select>

            {/* Custom Width & Height Inputs */}
            <div className="hidden xl:flex items-center gap-1 text-[11px] font-semibold text-slate-400">
              <input
                type="number"
                value={template.width || 800}
                onChange={(e) => {
                  const w = parseInt(e.target.value) || 800;
                  pushState({ ...template, width: w });
                }}
                className={`w-14 rounded-lg px-1.5 py-1 text-center text-xs border outline-none ${
                  isDarkMode ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'
                }`}
                title="Canvas Width (px)"
              />
              <span>x</span>
              <input
                type="number"
                value={template.height || 1000}
                onChange={(e) => {
                  const h = parseInt(e.target.value) || 1000;
                  pushState({ ...template, height: h });
                }}
                className={`w-14 rounded-lg px-1.5 py-1 text-center text-xs border outline-none ${
                  isDarkMode ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'
                }`}
                title="Canvas Height (px)"
              />
              <span className="text-[10px] text-slate-500 font-mono">px</span>
            </div>
          </div>
        </div>

        {/* Center & Right Controls: Background Upload, Undo/Redo, Shortcuts & Preview */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Pro Keyboard Shortcuts Modal Button */}
          <button
            onClick={() => setShowShortcutsModal(true)}
            className={`p-2 rounded-xl border font-medium text-xs flex items-center gap-1.5 transition-all ${
              isDarkMode
                ? 'bg-slate-800 text-cyan-400 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-100 text-blue-600 border-slate-200 hover:bg-slate-200'
            }`}
            title="Keyboard Shortcuts Guide"
          >
            <Keyboard className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Shortcuts</span>
          </button>

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border font-medium text-xs flex items-center gap-1.5 transition-all ${
              isDarkMode
                ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
            title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            <span className="hidden sm:inline">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <div className={`h-4 w-px mx-0.5 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />

          <button
            onClick={() => { handleUndo(); addToast('Undo action'); }}
            disabled={historyIndex <= 0}
            className={`p-2 rounded-xl disabled:opacity-30 transition-colors ${
              isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => { handleRedo(); addToast('Redo action'); }}
            disabled={historyIndex >= history.length - 1}
            className={`p-2 rounded-xl disabled:opacity-30 transition-colors ${
              isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Redo"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <div className={`h-4 w-px mx-0.5 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />

          <label className={`px-3 py-1.5 text-xs font-semibold rounded-xl border shadow-xs cursor-pointer flex items-center gap-1.5 transition-all ${
            isDarkMode
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'
          }`}>
            <ImageIcon className={`w-3.5 h-3.5 ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
            <span className="hidden lg:inline">Upload Background</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleBgUpload(e.target.files[0])}
            />
          </label>

          <button
            onClick={handlePreviewShopForm}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all hover:scale-105 ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-200'
            }`}
            title="Preview Live Shop Form"
          >
            <Eye className={`w-3.5 h-3.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className="hidden sm:inline">Preview Shop Form</span>
          </button>

          <button
            onClick={() => { handleSave(); addToast('Template saved successfully!'); }}
            className="px-4 sm:px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all hover:scale-[1.02] shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Save & Share</span>
          </button>
        </div>
      </header>

      {/* Mobile Studio View Switcher Dock */}
      <div className={`flex lg:hidden border-b p-1.5 justify-around shrink-0 z-40 transition-colors ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <button
          onClick={() => setMobileTab('toolbar')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'toolbar'
              ? 'bg-blue-600 text-white shadow-md'
              : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Placeholders</span>
        </button>
        <button
          onClick={() => setMobileTab('canvas')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'canvas'
              ? 'bg-cyan-600 text-white shadow-md'
              : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Canvas Studio</span>
        </button>
        <button
          onClick={() => setMobileTab('inspector')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'inspector'
              ? 'bg-indigo-600 text-white shadow-md'
              : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Inspector</span>
        </button>
      </div>

      {/* Main 3-Column Studio Interface (Desktop 3-Col / Mobile Responsive Viewports) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Toolbar */}
        <div className={`${mobileTab === 'toolbar' ? 'flex w-full absolute inset-0 z-30 bg-slate-950 overflow-y-auto' : 'hidden lg:flex'}`}>
          <PlaceholderToolbar onAddPlaceholder={handleAddPlaceholderWithTab} isDarkMode={isDarkMode} />
        </div>

        {/* Center Interactive Canvas */}
        <div className={`${mobileTab === 'canvas' ? 'flex w-full flex-1 z-20 overflow-auto justify-center' : 'hidden lg:flex flex-1'}`}>
          <CanvasBoard
            template={template}
            selectedPlaceholderId={selectedPlaceholderId}
            onSelectPlaceholder={handleSelectPlaceholder}
            onUpdatePlaceholder={handleUpdatePlaceholder}
            onDeletePlaceholder={handleDeletePlaceholder}
            onDuplicatePlaceholder={handleDuplicatePlaceholder}
            zoom={zoom}
            setZoom={setZoom}
            showGrid={showGrid}
            setShowGrid={setShowGrid}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Right Inspector */}
        <div className={`${mobileTab === 'inspector' ? 'flex w-full absolute inset-0 z-30 bg-slate-950 overflow-y-auto' : 'hidden lg:flex'}`}>
          <PropertyInspector
            selectedPlaceholder={selectedPlaceholder}
            onUpdatePlaceholder={handleUpdatePlaceholder}
            onDeletePlaceholder={handleDeletePlaceholder}
            onDuplicatePlaceholder={handleDuplicatePlaceholder}
            onReorderLayer={handleReorderLayer}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Keyboard Shortcuts Guide Modal */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-cyan-400" />
                <h3 className="font-heading font-extrabold text-base text-white">Keyboard Shortcuts Guide</h3>
              </div>
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              {[
                { key: 'Ctrl + Z', action: 'Undo last change' },
                { key: 'Ctrl + Y  /  Ctrl + Shift + Z', action: 'Redo action' },
                { key: 'Delete  /  Backspace', action: 'Delete selected element' },
                { key: 'Ctrl + D', action: 'Duplicate selected element' },
                { key: 'Arrow Keys (← ↑ → ↓)', action: 'Nudge element by 1px' },
                { key: 'Shift + Arrow Keys', action: 'Nudge element by 10px' },
                { key: 'Ctrl + S', action: 'Save & Share template' },
                { key: 'Escape', action: 'Deselect element' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-800/60">
                  <span className="font-mono bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg text-cyan-400 font-bold">
                    {item.key}
                  </span>
                  <span className="text-slate-300 font-medium">{item.action}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs rounded-xl hover:scale-105 transition-all shadow-md shadow-cyan-500/20"
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
