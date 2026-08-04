import React from 'react';
import { 
  Type, Palette, AlignLeft, AlignCenter, AlignRight, Bold, Italic, 
  Layers, Lock, Unlock, Trash2, Copy, Sliders, LayoutGrid, Eye, ArrowUp, ArrowDown,
  Unlink
} from 'lucide-react';

const FONT_FAMILIES = [
  { name: 'Outfit (Modern)', value: 'Outfit' },
  { name: 'Inter (Clean)', value: 'Inter' },
  { name: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans' },
  { name: 'Cinzel (Luxury)', value: 'Cinzel' },
  { name: 'Playfair Display (Serif)', value: 'Playfair Display' },
];

export default function PropertyInspector({
  selectedPlaceholder,
  onUpdatePlaceholder,
  onDeletePlaceholder,
  onDuplicatePlaceholder,
  onReorderLayer,
  isDarkMode = true,
}) {
  if (!selectedPlaceholder) {
    return (
      <div className={`w-80 border-l p-6 flex flex-col items-center justify-center text-center transition-colors duration-200 ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'
      }`}>
        <Sliders className={`w-10 h-10 mb-3 animate-pulse ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`} />
        <h4 className={`font-heading text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
          No Element Selected
        </h4>
        <p className={`text-xs mt-1 max-w-[200px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Click any element on the poster canvas or add a new placeholder to edit styling properties.
        </p>
      </div>
    );
  }

  const p = selectedPlaceholder;
  const targetId = p.id || p._id;

  return (
    <div className={`w-80 border-l flex flex-col h-full overflow-hidden font-sans transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b flex items-center justify-between ${
        isDarkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/50'
      }`}>
        <div>
          <span className={`text-[10px] font-extrabold tracking-wider uppercase block ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          }`}>
            {p.type.replace('_', ' ')}
          </span>
          <h3 className={`font-heading font-bold text-sm truncate max-w-[180px] ${
            isDarkMode ? 'text-slate-100' : 'text-slate-900'
          }`}>
            {p.label}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onUpdatePlaceholder(targetId, { locked: !p.locked })}
            className={`p-1.5 rounded-lg border transition-all ${
              p.locked
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : isDarkMode
                ? 'hover:bg-slate-800 text-slate-400 border-slate-700'
                : 'hover:bg-slate-100 text-slate-500 border-slate-200'
            }`}
            title={p.locked ? 'Unlock Position' : 'Lock Position'}
          >
            {p.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDuplicatePlaceholder(targetId)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isDarkMode ? 'hover:bg-slate-800 text-slate-400 border-slate-700' : 'hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeletePlaceholder(targetId)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isDarkMode ? 'hover:bg-rose-500/20 text-rose-400 border-rose-500/30' : 'hover:bg-rose-50 text-rose-600 border-rose-200'
            }`}
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inspector Body Controls */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Label Config */}
        <div>
          <label className={`text-[11px] font-bold block mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Dynamic Field Label (Shop Form)
          </label>
          <input
            type="text"
            value={p.label || ''}
            onChange={(e) => onUpdatePlaceholder(targetId, { label: e.target.value })}
            className={`w-full rounded-xl px-3 py-1.5 text-xs outline-none transition-all border ${
              isDarkMode
                ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500'
                : 'bg-slate-50 text-slate-900 border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
            }`}
            placeholder="e.g. Student Full Name"
          />
        </div>

        {/* Text Content (If text placeholder) */}
        {p.type !== 'photo' && p.type !== 'logo' && p.type !== 'qr_code' && (
          <div>
            <label className={`text-[11px] font-bold block mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Sample Text / Default Value
            </label>
            <input
              type="text"
              value={p.text || ''}
              onChange={(e) => onUpdatePlaceholder(targetId, { text: e.target.value })}
              className={`w-full rounded-xl px-3 py-1.5 text-xs outline-none transition-all border ${
                isDarkMode
                  ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500'
                  : 'bg-slate-50 text-slate-900 border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
              }`}
            />
          </div>
        )}

        {/* Geometry (X, Y, W, H) */}
        <div>
          <label className={`text-[11px] font-bold block mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Position & Dimensions
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {['X', 'Y', 'W', 'H'].map((label, idx) => {
              const keys = ['x', 'y', 'width', 'height'];
              const defaults = [0, 0, 10, 10];
              const key = keys[idx];
              return (
                <div key={label} className={`flex items-center px-2.5 py-1.5 rounded-xl border ${
                  isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-slate-400 font-bold text-[10px] w-6">{label}:</span>
                  <input
                    type="number"
                    value={p[key] || 0}
                    onChange={(e) => onUpdatePlaceholder(targetId, { [key]: parseInt(e.target.value) || defaults[idx] })}
                    className={`w-full bg-transparent text-xs font-semibold text-right outline-none ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Typography Section (for text items) */}
        {p.type !== 'photo' && p.type !== 'logo' && p.type !== 'qr_code' && (
          <div className={`space-y-3 pt-3 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <h4 className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Typography</h4>
            
            {/* Font Family */}
            <div>
              <label className="text-[10px] text-slate-500 font-medium block mb-1">Font Family</label>
              <select
                value={p.fontFamily || 'Inter'}
                onChange={(e) => onUpdatePlaceholder(targetId, { fontFamily: e.target.value })}
                className={`w-full rounded-xl px-3 py-1.5 text-xs outline-none cursor-pointer border ${
                  isDarkMode
                    ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500'
                    : 'bg-slate-50 text-slate-900 border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
                }`}
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f.value} value={f.value} className={isDarkMode ? 'bg-slate-900 text-slate-100' : ''}>{f.name}</option>
                ))}
              </select>
            </div>

            {/* Font Size & Weight */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-medium block mb-1">Font Size (px)</label>
                <input
                  type="number"
                  value={p.fontSize || 18}
                  onChange={(e) => onUpdatePlaceholder(targetId, { fontSize: parseInt(e.target.value) || 12 })}
                  className={`w-full rounded-xl px-3 py-1.5 text-xs outline-none border ${
                    isDarkMode
                      ? 'bg-slate-950 text-white border-slate-800'
                      : 'bg-slate-50 text-slate-900 border-slate-200 focus:bg-white focus:border-blue-600'
                  }`}
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-medium block mb-1">Style Format</label>
                <div className="flex gap-1">
                  <button
                    onClick={() => onUpdatePlaceholder(targetId, { fontWeight: p.fontWeight === 'bold' ? 'normal' : 'bold' })}
                    className={`flex-1 p-1.5 rounded-xl border text-xs flex items-center justify-center transition-all ${
                      p.fontWeight === 'bold'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : isDarkMode
                        ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onUpdatePlaceholder(targetId, { fontStyle: p.fontStyle === 'italic' ? 'normal' : 'italic' })}
                    className={`flex-1 p-1.5 rounded-xl border text-xs flex items-center justify-center transition-all ${
                      p.fontStyle === 'italic'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : isDarkMode
                        ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Text Alignment */}
            <div>
              <label className="text-[10px] text-slate-500 font-medium block mb-1">Text Alignment</label>
              <div className={`flex gap-1 p-1 rounded-xl border ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
                {['left', 'center', 'right'].map((alignMode) => {
                  const Icon = alignMode === 'left' ? AlignLeft : alignMode === 'center' ? AlignCenter : AlignRight;
                  const isActive = (p.align || 'left') === alignMode;
                  return (
                    <button
                      key={alignMode}
                      onClick={() => onUpdatePlaceholder(targetId, { align: alignMode })}
                      className={`flex-1 py-1 rounded-lg text-xs flex justify-center transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : isDarkMode
                          ? 'text-slate-400 hover:text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Colors & Appearance */}
        <div className={`space-y-3 pt-3 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <h4 className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Colors & Background</h4>
          
          <div className="grid grid-cols-2 gap-2">
            {p.type !== 'photo' && p.type !== 'logo' && p.type !== 'qr_code' && (
              <div>
                <label className="text-[10px] text-slate-500 font-medium block mb-1">Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={p.color || '#ffffff'}
                    onChange={(e) => onUpdatePlaceholder(targetId, { color: e.target.value })}
                    className="w-7 h-7 rounded-lg cursor-pointer border border-slate-700 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={p.color || '#ffffff'}
                    onChange={(e) => onUpdatePlaceholder(targetId, { color: e.target.value })}
                    className={`w-full rounded-lg px-2 py-1 text-xs outline-none border ${
                      isDarkMode ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'
                    }`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] text-slate-500 font-medium block mb-1">Background Fill</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={p.backgroundColor && p.backgroundColor !== 'transparent' ? p.backgroundColor : '#0f172a'}
                  onChange={(e) => onUpdatePlaceholder(targetId, { backgroundColor: e.target.value })}
                  className="w-7 h-7 rounded-lg cursor-pointer border border-slate-700 bg-transparent p-0"
                />
                <button
                  onClick={() => onUpdatePlaceholder(targetId, { backgroundColor: 'transparent' })}
                  className="text-[10px] text-slate-400 hover:text-slate-200 underline"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Borders & 4-Corner Radius Section */}
        <div className={`space-y-3 pt-3 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex items-center justify-between">
            <h4 className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Borders & 4-Corner Radius
            </h4>
            <button
              type="button"
              onClick={() => {
                const linkNext = !p.linkCorners;
                const uniform = p.borderRadius || 0;
                onUpdatePlaceholder(targetId, {
                  linkCorners: linkNext,
                  borderTopLeftRadius: uniform,
                  borderTopRightRadius: uniform,
                  borderBottomRightRadius: uniform,
                  borderBottomLeftRadius: uniform,
                });
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-all ${
                p.linkCorners
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700'
              }`}
            >
              {p.linkCorners ? <Link className="w-3 h-3 text-blue-400" /> : <Unlink className="w-3 h-3 text-slate-400" />}
              <span>{p.linkCorners ? 'Corners Linked' : 'Independent'}</span>
            </button>
          </div>

          {/* Shape Presets Chips */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-medium block">Shape Presets</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Square', tl: 0, tr: 0, br: 0, bl: 0, icon: '🔲' },
                { label: 'Soft', tl: 16, tr: 16, br: 16, bl: 16, icon: '▢' },
                { label: 'Round', tl: 999, tr: 999, br: 999, bl: 999, icon: '⭕' },
                { label: 'Arch', tl: 140, tr: 140, br: 0, bl: 0, icon: '🏛️' },
                { label: 'Leaf', tl: 90, tr: 0, br: 90, bl: 0, icon: '🍃' },
                { label: 'Slant', tl: 0, tr: 45, br: 0, bl: 45, icon: '📐' },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onUpdatePlaceholder(targetId, {
                    linkCorners: false,
                    borderTopLeftRadius: preset.tl,
                    borderTopRightRadius: preset.tr,
                    borderBottomRightRadius: preset.br,
                    borderBottomLeftRadius: preset.bl,
                    borderRadius: preset.tl,
                  })}
                  className={`py-1 px-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-blue-500/50' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-500'
                  }`}
                >
                  <span>{preset.icon}</span>
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Corner Inputs */}
          {p.linkCorners ? (
            <div>
              <label className="text-[10px] text-slate-500 font-medium block mb-1">Uniform Radius (px)</label>
              <input
                type="number"
                value={p.borderRadius || 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  onUpdatePlaceholder(targetId, {
                    borderRadius: val,
                    borderTopLeftRadius: val,
                    borderTopRightRadius: val,
                    borderBottomRightRadius: val,
                    borderBottomLeftRadius: val,
                  });
                }}
                className={`w-full rounded-xl px-3 py-1.5 text-xs outline-none border ${
                  isDarkMode ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'
                }`}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-medium block mb-0.5">Top-Left (px)</label>
                <input
                  type="number"
                  value={p.borderTopLeftRadius !== undefined ? p.borderTopLeftRadius : (p.borderRadius || 0)}
                  onChange={(e) => onUpdatePlaceholder(targetId, { borderTopLeftRadius: parseInt(e.target.value) || 0 })}
                  className={`w-full rounded-xl px-2.5 py-1 text-xs outline-none border ${
                    isDarkMode ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'
                  }`}
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-medium block mb-0.5">Top-Right (px)</label>
                <input
                  type="number"
                  value={p.borderTopRightRadius !== undefined ? p.borderTopRightRadius : (p.borderRadius || 0)}
                  onChange={(e) => onUpdatePlaceholder(targetId, { borderTopRightRadius: parseInt(e.target.value) || 0 })}
                  className={`w-full rounded-xl px-2.5 py-1 text-xs outline-none border ${
                    isDarkMode ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'
                  }`}
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-medium block mb-0.5">Bottom-Left (px)</label>
                <input
                  type="number"
                  value={p.borderBottomLeftRadius !== undefined ? p.borderBottomLeftRadius : (p.borderRadius || 0)}
                  onChange={(e) => onUpdatePlaceholder(targetId, { borderBottomLeftRadius: parseInt(e.target.value) || 0 })}
                  className={`w-full rounded-xl px-2.5 py-1 text-xs outline-none border ${
                    isDarkMode ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'
                  }`}
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-medium block mb-0.5">Bottom-Right (px)</label>
                <input
                  type="number"
                  value={p.borderBottomRightRadius !== undefined ? p.borderBottomRightRadius : (p.borderRadius || 0)}
                  onChange={(e) => onUpdatePlaceholder(targetId, { borderBottomRightRadius: parseInt(e.target.value) || 0 })}
                  className={`w-full rounded-xl px-2.5 py-1 text-xs outline-none border ${
                    isDarkMode ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Border Style & Width */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="text-[10px] text-slate-500 font-medium block mb-1">Border Style</label>
              <select
                value={p.borderStyle || 'solid'}
                onChange={(e) => onUpdatePlaceholder(targetId, { borderStyle: e.target.value })}
                className={`w-full rounded-xl px-2 py-1.5 text-xs outline-none border ${
                  isDarkMode ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'
                }`}
              >
                <option value="solid">Solid Line</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-medium block mb-1">Border Width (px)</label>
              <input
                type="number"
                value={p.borderWidth || 0}
                onChange={(e) => onUpdatePlaceholder(targetId, { borderWidth: parseInt(e.target.value) || 0 })}
                className={`w-full rounded-xl px-3 py-1.5 text-xs outline-none border ${
                  isDarkMode ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 font-medium block mb-1">Border Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={p.borderColor || '#38bdf8'}
                onChange={(e) => onUpdatePlaceholder(targetId, { borderColor: e.target.value })}
                className="w-7 h-7 rounded-lg cursor-pointer border border-slate-700 bg-transparent p-0"
              />
              <input
                type="text"
                value={p.borderColor || '#38bdf8'}
                onChange={(e) => onUpdatePlaceholder(targetId, { borderColor: e.target.value })}
                className={`flex-1 rounded-xl px-3 py-1 text-xs uppercase font-mono outline-none border ${
                  isDarkMode ? 'bg-slate-950 text-slate-200 border-slate-800' : 'bg-slate-50 text-slate-800 border-slate-200'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Advanced Image Filters (Photo/Logo) */}
        {(p.type === 'photo' || p.type === 'logo') && (
          <div className={`space-y-3 pt-3 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <h4 className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Image Filters & Adjustments</h4>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                  <span>Brightness</span>
                  <span>{Math.round((p.brightness !== undefined ? p.brightness : 1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={p.brightness !== undefined ? p.brightness : 1}
                  onChange={(e) => onUpdatePlaceholder(targetId, { brightness: parseFloat(e.target.value) })}
                  className="w-full accent-blue-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                  <span>Contrast</span>
                  <span>{Math.round((p.contrast !== undefined ? p.contrast : 1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={p.contrast !== undefined ? p.contrast : 1}
                  onChange={(e) => onUpdatePlaceholder(targetId, { contrast: parseFloat(e.target.value) })}
                  className="w-full accent-blue-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                  <span>Saturation</span>
                  <span>{Math.round((p.saturation !== undefined ? p.saturation : 1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={p.saturation !== undefined ? p.saturation : 1}
                  onChange={(e) => onUpdatePlaceholder(targetId, { saturation: parseFloat(e.target.value) })}
                  className="w-full accent-blue-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                  <span>Blur Filter (px)</span>
                  <span>{p.blur || 0}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={p.blur || 0}
                  onChange={(e) => onUpdatePlaceholder(targetId, { blur: parseInt(e.target.value) || 0 })}
                  className="w-full accent-blue-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Field Form Controls & Guidance Tooltips */}
        <div className={`space-y-3 pt-3 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <h4 className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Shop Form Guidance Tooltips</h4>

          <div>
            <label className="text-[10px] text-slate-500 font-medium block mb-1 font-semibold">Help Hint for Shop Owner</label>
            <input
              type="text"
              value={p.helpTooltip || ''}
              onChange={(e) => onUpdatePlaceholder(targetId, { helpTooltip: e.target.value })}
              placeholder="e.g. Type full student name in ALL CAPS"
              className={`w-full rounded-xl px-3 py-1.5 text-xs outline-none border ${
                isDarkMode ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'
              }`}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Mandatory Field in Form</span>
            <button
              type="button"
              onClick={() => onUpdatePlaceholder(targetId, { isMandatory: !p.isMandatory })}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                p.isMandatory ? 'bg-emerald-600' : 'bg-slate-800'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${p.isMandatory ? 'translate-x-4' : ''}`} />
            </button>
          </div>
        </div>

        {/* Layer Ordering */}
        <div className={`space-y-2 pt-3 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <h4 className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Layer Ordering</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onReorderLayer(targetId, 'up')}
              className={`p-2.5 rounded-xl border text-xs flex items-center justify-center gap-1.5 font-semibold shadow-xs transition-all ${
                isDarkMode
                  ? 'bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <ArrowUp className="w-3.5 h-3.5 text-blue-500" />
              Bring Forward
            </button>
            <button
              onClick={() => onReorderLayer(targetId, 'down')}
              className={`p-2.5 rounded-xl border text-xs flex items-center justify-center gap-1.5 font-semibold shadow-xs transition-all ${
                isDarkMode
                  ? 'bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <ArrowDown className="w-3.5 h-3.5 text-blue-500" />
              Send Backward
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
