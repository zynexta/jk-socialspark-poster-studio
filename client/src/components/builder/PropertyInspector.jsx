import React from 'react';
import { 
  Type, Palette, AlignLeft, AlignCenter, AlignRight, Bold, Italic, 
  Layers, Lock, Unlock, Trash2, Copy, Sliders, LayoutGrid, Eye, ArrowUp, ArrowDown,
  Unlink,
  Link
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
}) {
  if (!selectedPlaceholder) {
    return (
      <div className="w-80 border-l border-[#E5E5E5] p-6 flex flex-col items-center justify-center text-center bg-[#FFFFFF] text-[#777777]">
        <Sliders className="w-10 h-10 mb-3 animate-pulse text-[#C1121F]" />
        <h4 className="font-heading text-sm font-bold text-[#0A0A0A]">
          No Element Selected
        </h4>
        <p className="text-xs mt-1 max-w-[200px] text-[#555555] font-medium leading-relaxed">
          Click any element on the poster canvas or add a new placeholder to edit styling properties.
        </p>
      </div>
    );
  }

  const p = selectedPlaceholder;
  const targetId = p.id || p._id;

  return (
    <div className="w-80 border-l border-[#E5E5E5] flex flex-col h-full overflow-hidden font-sans bg-[#FFFFFF] text-[#111111]">
      {/* Header */}
      <div className="p-4 border-b border-[#E5E5E5] bg-[#F8F8F6] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black tracking-wider uppercase block text-[#C1121F]">
            {p.type.replace('_', ' ')}
          </span>
          <h3 className="font-heading font-bold text-sm truncate max-w-[180px] text-[#0A0A0A]">
            {p.label}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onUpdatePlaceholder(targetId, { locked: !p.locked })}
            className={`p-1.5 rounded-lg border transition-all ${
              p.locked
                ? 'bg-[#FFF1F2] text-[#C1121F] border-red-200'
                : 'hover:bg-[#E5E5E5] text-[#555555] border-[#E5E5E5] bg-[#FFFFFF]'
            }`}
            title={p.locked ? 'Unlock Position' : 'Lock Position'}
          >
            {p.locked ? <Lock className="w-4 h-4 text-[#C1121F]" /> : <Unlock className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDuplicatePlaceholder(targetId)}
            className="p-1.5 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#555555] transition-colors"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeletePlaceholder(targetId)}
            className="p-1.5 rounded-lg border border-red-200 bg-[#FFF1F2] hover:bg-[#C1121F] text-[#C1121F] hover:text-white transition-colors"
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
          <label className="text-[11px] font-bold block mb-1 text-[#0A0A0A]">
            Dynamic Field Label (Shop Form)
          </label>
          <input
            type="text"
            value={p.label || ''}
            onChange={(e) => onUpdatePlaceholder(targetId, { label: e.target.value })}
            className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#C1121F] text-[#0A0A0A] font-bold rounded-xl px-3 py-1.5 text-xs outline-none transition-all"
            placeholder="e.g. Student Full Name"
          />
        </div>

        {/* Text Content (If text placeholder) */}
        {p.type !== 'photo' && p.type !== 'logo' && p.type !== 'qr_code' && (
          <div>
            <label className="text-[11px] font-bold block mb-1 text-[#0A0A0A]">
              Sample Text / Default Value
            </label>
            <input
              type="text"
              value={p.text || ''}
              onChange={(e) => onUpdatePlaceholder(targetId, { text: e.target.value })}
              className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#C1121F] text-[#0A0A0A] font-bold rounded-xl px-3 py-1.5 text-xs outline-none transition-all"
            />
          </div>
        )}

        {/* Geometry (X, Y, W, H) */}
        <div>
          <label className="text-[11px] font-bold block mb-2 text-[#0A0A0A]">
            Position & Dimensions
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {['X', 'Y', 'W', 'H'].map((label, idx) => {
              const keys = ['x', 'y', 'width', 'height'];
              const defaults = [0, 0, 10, 10];
              const key = keys[idx];
              return (
                <div key={label} className="flex items-center px-2.5 py-1.5 rounded-xl border border-[#E5E5E5] bg-[#F8F8F6]">
                  <span className="text-[#555555] font-bold text-[10px] w-6">{label}:</span>
                  <input
                    type="number"
                    value={p[key] || 0}
                    onChange={(e) => onUpdatePlaceholder(targetId, { [key]: parseInt(e.target.value) || defaults[idx] })}
                    className="w-full bg-transparent text-xs font-bold text-right outline-none text-[#0A0A0A]"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Typography Section (for text items) */}
        {p.type !== 'photo' && p.type !== 'logo' && p.type !== 'qr_code' && (
          <div className="space-y-3 pt-3 border-t border-[#E5E5E5]">
            <h4 className="text-[11px] font-bold text-[#0A0A0A]">Typography</h4>
            
            {/* Font Family */}
            <div>
              <label className="text-[10px] text-[#555555] font-bold block mb-1">Font Family</label>
              <select
                value={p.fontFamily || 'Inter'}
                onChange={(e) => onUpdatePlaceholder(targetId, { fontFamily: e.target.value })}
                className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#C1121F] text-[#0A0A0A] font-bold rounded-xl px-3 py-1.5 text-xs outline-none cursor-pointer"
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f.value} value={f.value} className="bg-[#FFFFFF] text-[#0A0A0A] font-medium">{f.name}</option>
                ))}
              </select>
            </div>

            {/* Font Size & Weight */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#555555] font-bold block mb-1">Font Size (px)</label>
                <input
                  type="number"
                  value={p.fontSize || 18}
                  onChange={(e) => onUpdatePlaceholder(targetId, { fontSize: parseInt(e.target.value) || 12 })}
                  className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#C1121F] text-[#0A0A0A] font-bold rounded-xl px-3 py-1.5 text-xs outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#555555] font-bold block mb-1">Style Format</label>
                <div className="flex gap-1">
                  <button
                    onClick={() => onUpdatePlaceholder(targetId, { fontWeight: p.fontWeight === 'bold' ? 'normal' : 'bold' })}
                    className={`flex-1 p-1.5 rounded-xl border text-xs flex items-center justify-center transition-all ${
                      p.fontWeight === 'bold'
                        ? 'bg-[#C1121F] text-white border-[#C1121F] shadow-xs'
                        : 'bg-[#FFFFFF] border-[#E5E5E5] text-[#555555] hover:bg-[#F5F5F3]'
                    }`}
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onUpdatePlaceholder(targetId, { fontStyle: p.fontStyle === 'italic' ? 'normal' : 'italic' })}
                    className={`flex-1 p-1.5 rounded-xl border text-xs flex items-center justify-center transition-all ${
                      p.fontStyle === 'italic'
                        ? 'bg-[#C1121F] text-white border-[#C1121F] shadow-xs'
                        : 'bg-[#FFFFFF] border-[#E5E5E5] text-[#555555] hover:bg-[#F5F5F3]'
                    }`}
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Text Alignment */}
            <div>
              <label className="text-[10px] text-[#555555] font-bold block mb-1">Text Alignment</label>
              <div className="flex gap-1 p-1 rounded-xl border border-[#E5E5E5] bg-[#F8F8F6]">
                {['left', 'center', 'right'].map((alignMode) => {
                  const Icon = alignMode === 'left' ? AlignLeft : alignMode === 'center' ? AlignCenter : AlignRight;
                  const isActive = (p.align || 'left') === alignMode;
                  return (
                    <button
                      key={alignMode}
                      onClick={() => onUpdatePlaceholder(targetId, { align: alignMode })}
                      className={`flex-1 py-1 rounded-lg text-xs flex justify-center transition-all ${
                        isActive
                          ? 'bg-[#C1121F] text-white shadow-xs'
                          : 'text-[#555555] hover:text-[#0A0A0A]'
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
        <div className="space-y-3 pt-3 border-t border-[#E5E5E5]">
          <h4 className="text-[11px] font-bold text-[#0A0A0A]">Colors & Background</h4>
          
          <div className="grid grid-cols-2 gap-2">
            {p.type !== 'photo' && p.type !== 'logo' && p.type !== 'qr_code' && (
              <div>
                <label className="text-[10px] text-[#555555] font-bold block mb-1">Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={p.color || '#ffffff'}
                    onChange={(e) => onUpdatePlaceholder(targetId, { color: e.target.value })}
                    className="w-7 h-7 rounded-lg cursor-pointer border border-[#E5E5E5] bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={p.color || '#ffffff'}
                    onChange={(e) => onUpdatePlaceholder(targetId, { color: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E5E5E5] font-mono text-[#0A0A0A] rounded-lg px-2 py-1 text-xs outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] text-[#555555] font-bold block mb-1">Background Fill</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={p.backgroundColor && p.backgroundColor !== 'transparent' ? p.backgroundColor : '#0f172a'}
                  onChange={(e) => onUpdatePlaceholder(targetId, { backgroundColor: e.target.value })}
                  className="w-7 h-7 rounded-lg cursor-pointer border border-[#E5E5E5] bg-transparent p-0"
                />
                <button
                  onClick={() => onUpdatePlaceholder(targetId, { backgroundColor: 'transparent' })}
                  className="text-[10px] text-[#C1121F] hover:underline font-bold"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Borders & 4-Corner Radius Section */}
        <div className="space-y-3 pt-3 border-t border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-bold text-[#0A0A0A]">
              Borders & 4-Corner Radius
            </h4>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  const borderNext = p.borderEnabled === false;
                  onUpdatePlaceholder(targetId, {
                    borderEnabled: borderNext,
                    borderWidth: borderNext ? (p.borderWidth || 4) : 0,
                  });
                }}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-all ${
                  p.borderEnabled !== false && (p.borderWidth ?? 0) > 0
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-[#F8F8F6] text-[#555555] border-[#E5E5E5]'
                }`}
                title="Toggle Border Line On or Off"
              >
                <span>{p.borderEnabled !== false && (p.borderWidth ?? 0) > 0 ? 'Border ON' : 'Border OFF'}</span>
              </button>

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
                    ? 'bg-[#FFF1F2] text-[#C1121F] border-red-200'
                    : 'bg-[#F8F8F6] text-[#555555] border-[#E5E5E5]'
                }`}
              >
                {p.linkCorners ? <Link className="w-3 h-3 text-[#C1121F]" /> : <Unlink className="w-3 h-3 text-[#777777]" />}
                <span>{p.linkCorners ? 'Linked' : 'Independent'}</span>
              </button>
            </div>
          </div>

          {/* Shape Presets Chips */}
          <div className="space-y-1">
            <span className="text-[10px] text-[#555555] font-bold block">Shape Presets</span>
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
                  className="py-1 px-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition-all bg-[#FFFFFF] border-[#E5E5E5] text-[#0A0A0A] hover:border-[#C1121F] hover:bg-[#FFF1F2]"
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
              <label className="text-[10px] text-[#555555] font-bold block mb-1">Uniform Radius (px)</label>
              <input
                type="number"
                value={p.borderRadius ?? 0}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0;
                  onUpdatePlaceholder(targetId, {
                    borderRadius: val,
                    borderTopLeftRadius: val,
                    borderTopRightRadius: val,
                    borderBottomRightRadius: val,
                    borderBottomLeftRadius: val,
                  });
                }}
                className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#C1121F] text-[#0A0A0A] font-bold rounded-xl px-3 py-1.5 text-xs outline-none"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#555555] font-bold block mb-0.5">Top-Left (px)</label>
                <input
                  type="number"
                  value={p.borderTopLeftRadius !== undefined ? p.borderTopLeftRadius : (p.borderRadius ?? 0)}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => onUpdatePlaceholder(targetId, { borderTopLeftRadius: e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#C1121F] text-[#0A0A0A] font-bold rounded-xl px-2.5 py-1 text-xs outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#555555] font-bold block mb-0.5">Top-Right (px)</label>
                <input
                  type="number"
                  value={p.borderTopRightRadius !== undefined ? p.borderTopRightRadius : (p.borderRadius ?? 0)}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => onUpdatePlaceholder(targetId, { borderTopRightRadius: e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#C1121F] text-[#0A0A0A] font-bold rounded-xl px-2.5 py-1 text-xs outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#555555] font-bold block mb-0.5">Bottom-Left (px)</label>
                <input
                  type="number"
                  value={p.borderBottomLeftRadius !== undefined ? p.borderBottomLeftRadius : (p.borderRadius ?? 0)}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => onUpdatePlaceholder(targetId, { borderBottomLeftRadius: e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#C1121F] text-[#0A0A0A] font-bold rounded-xl px-2.5 py-1 text-xs outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#555555] font-bold block mb-0.5">Bottom-Right (px)</label>
                <input
                  type="number"
                  value={p.borderBottomRightRadius !== undefined ? p.borderBottomRightRadius : (p.borderRadius ?? 0)}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => onUpdatePlaceholder(targetId, { borderBottomRightRadius: e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#C1121F] text-[#0A0A0A] font-bold rounded-xl px-2.5 py-1 text-xs outline-none"
                />
              </div>
            </div>
          )}

          {/* Border Style & Width */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="text-[10px] text-[#555555] font-bold block mb-1">Border Style</label>
              <select
                value={p.borderStyle || 'solid'}
                onChange={(e) => onUpdatePlaceholder(targetId, { borderStyle: e.target.value })}
                className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#C1121F] text-[#0A0A0A] font-bold rounded-xl px-2 py-1.5 text-xs outline-none"
              >
                <option value="solid">Solid Line</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-[#555555] font-bold block mb-1">Border Width (px)</label>
              <input
                type="number"
                value={p.borderWidth ?? 0}
                onFocus={(e) => e.target.select()}
                onChange={(e) => onUpdatePlaceholder(targetId, { borderWidth: e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0 })}
                className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#C1121F] text-[#0A0A0A] font-bold rounded-xl px-3 py-1.5 text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#555555] font-bold block mb-1">Border Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={p.borderColor || '#38bdf8'}
                onChange={(e) => onUpdatePlaceholder(targetId, { borderColor: e.target.value })}
                className="w-7 h-7 rounded-lg cursor-pointer border border-[#E5E5E5] bg-transparent p-0"
              />
              <input
                type="text"
                value={p.borderColor || '#38bdf8'}
                onChange={(e) => onUpdatePlaceholder(targetId, { borderColor: e.target.value })}
                className="flex-1 bg-[#FFFFFF] border border-[#E5E5E5] text-[#0A0A0A] font-mono rounded-xl px-3 py-1 text-xs uppercase outline-none"
              />
            </div>
          </div>
        </div>

        {/* Advanced Image Filters (Photo/Logo) */}
        {(p.type === 'photo' || p.type === 'logo') && (
          <div className="space-y-3 pt-3 border-t border-[#E5E5E5]">
            <h4 className="text-[11px] font-bold text-[#0A0A0A]">Image Filters & Adjustments</h4>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[10px] text-[#555555] font-bold mb-0.5">
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
                  className="w-full accent-[#C1121F] h-1.5 bg-[#E5E5E5] rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-[#555555] font-bold mb-0.5">
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
                  className="w-full accent-[#C1121F] h-1.5 bg-[#E5E5E5] rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-[#555555] font-bold mb-0.5">
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
                  className="w-full accent-[#C1121F] h-1.5 bg-[#E5E5E5] rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-[#555555] font-bold mb-0.5">
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
                  className="w-full accent-[#C1121F] h-1.5 bg-[#E5E5E5] rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Field Form Controls & Guidance Tooltips */}
        <div className="space-y-3 pt-3 border-t border-[#E5E5E5]">
          <h4 className="text-[11px] font-bold text-[#0A0A0A]">Shop Form Guidance Tooltips</h4>

          <div>
            <label className="text-[10px] text-[#555555] block mb-1 font-bold">Help Hint for Shop Owner</label>
            <input
              type="text"
              value={p.helpTooltip || ''}
              onChange={(e) => onUpdatePlaceholder(targetId, { helpTooltip: e.target.value })}
              placeholder="e.g. Type full student name in ALL CAPS"
              className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#C1121F] text-[#0A0A0A] font-bold rounded-xl px-3 py-1.5 text-xs outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0A0A0A]">Mandatory Field in Form</span>
            <button
              type="button"
              onClick={() => onUpdatePlaceholder(targetId, { isMandatory: !p.isMandatory })}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                p.isMandatory ? 'bg-emerald-600' : 'bg-[#E5E5E5]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${p.isMandatory ? 'translate-x-4' : ''}`} />
            </button>
          </div>
        </div>

        {/* Layer Ordering */}
        <div className="space-y-2 pt-3 border-t border-[#E5E5E5]">
          <h4 className="text-[11px] font-bold text-[#0A0A0A]">Layer Ordering</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onReorderLayer(targetId, 'up')}
              className="p-2.5 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] hover:bg-[#F5F5F3] text-[#0A0A0A] text-xs flex items-center justify-center gap-1.5 font-bold shadow-xs transition-all"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#C1121F]" />
              Bring Forward
            </button>
            <button
              onClick={() => onReorderLayer(targetId, 'down')}
              className="p-2.5 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] hover:bg-[#F5F5F3] text-[#0A0A0A] text-xs flex items-center justify-center gap-1.5 font-bold shadow-xs transition-all"
            >
              <ArrowDown className="w-3.5 h-3.5 text-[#C1121F]" />
              Send Backward
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
