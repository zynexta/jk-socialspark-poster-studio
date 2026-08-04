import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import CanvasBoard from '../components/builder/CanvasBoard';
import PlaceholderToolbar from '../components/builder/PlaceholderToolbar';
import PropertyInspector from '../components/builder/PropertyInspector';
import { 
  ArrowLeft, Save, Sparkles, Image as ImageIcon, Eye, 
  RotateCcw, RotateCw, CheckCircle2, Layers, Grid, Sliders, ChevronDown, Sun, Moon
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
    return {
      id: `tmpl_${Date.now()}`,
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
  const [history, setHistory] = useState([template]);
  const [historyIndex, setHistoryIndex] = useState(0);

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

  const handleAddPlaceholder = (type, label, defaultProps) => {
    const newPlaceholder = {
      id: `pl_${type}_${Date.now()}`,
      type,
      label,
      x: 200,
      y: 200,
      zIndex: (template.placeholders?.length || 0) + 1,
      ...defaultProps,
    };
    const updated = {
      ...template,
      placeholders: [...(template.placeholders || []), newPlaceholder],
    };
    pushState(updated);
    setSelectedPlaceholderId(newPlaceholder.id);
    addToast(`Added ${label}`);
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
      pushState({ ...template, bgImage: e.target.result });
      addToast('Background image updated!');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveTemplate(template);
    navigate('/admin/templates');
  };

  return (
    <div className={`h-screen flex flex-col overflow-hidden font-sans transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'
    }`}>
      {/* Top Header Toolbar */}
      <header className={`h-16 px-4 flex items-center justify-between z-30 shrink-0 border-b transition-colors duration-200 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/templates"
            className={`p-2 rounded-xl transition-colors ${
              isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
            title="Back to Templates"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className={`h-5 w-px ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />

          {/* Template Title Input */}
          <input
            type="text"
            value={template.title}
            onChange={(e) => setTemplate({ ...template, title: e.target.value })}
            className={`font-heading font-bold text-sm rounded-xl px-3 py-1.5 outline-none w-64 transition-all border ${
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
            className={`text-xs font-semibold rounded-xl px-3.5 py-1.5 outline-none shadow-xs border cursor-pointer ${
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
          <div className="flex items-center gap-1.5">
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

        {/* Center Controls: Background Upload, Undo/Redo & Theme Switcher */}
        <div className="flex items-center gap-2">
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

          <div className={`h-4 w-px mx-1 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />

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

          <div className={`h-4 w-px mx-1 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />

          <label className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border shadow-xs cursor-pointer flex items-center gap-1.5 transition-all ${
            isDarkMode
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'
          }`}>
            <ImageIcon className={`w-3.5 h-3.5 ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
            <span>Upload Background</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleBgUpload(e.target.files[0])}
            />
          </label>
        </div>

        {/* Right: Save & Preview Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to={`/template/${template.shareToken || 'sslc-topper-2026'}`}
            target="_blank"
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-colors ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-200'
            }`}
          >
            <Eye className={`w-3.5 h-3.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            Preview Shop Form
          </Link>

          <button
            onClick={() => { handleSave(); addToast('Template saved successfully!'); }}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            Save & Share Template
          </button>
        </div>
      </header>

      {/* Main 3-Column Studio Interface */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <PlaceholderToolbar onAddPlaceholder={handleAddPlaceholder} isDarkMode={isDarkMode} />

        {/* Center Interactive Canvas */}
        <CanvasBoard
          template={template}
          selectedPlaceholderId={selectedPlaceholderId}
          onSelectPlaceholder={setSelectedPlaceholderId}
          onUpdatePlaceholder={handleUpdatePlaceholder}
          onDeletePlaceholder={handleDeletePlaceholder}
          onDuplicatePlaceholder={handleDuplicatePlaceholder}
          zoom={zoom}
          setZoom={setZoom}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          isDarkMode={isDarkMode}
        />

        {/* Right Inspector */}
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
  );
}
