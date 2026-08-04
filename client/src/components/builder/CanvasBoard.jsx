import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Lock, Unlock, Trash2, Copy, Layers, Eye, Grid, Move, Maximize2 } from 'lucide-react';

export default function CanvasBoard({
  template,
  selectedPlaceholderId,
  onSelectPlaceholder,
  onUpdatePlaceholder,
  onDeletePlaceholder,
  onDuplicatePlaceholder,
  zoom,
  setZoom,
  showGrid,
  setShowGrid,
  isDarkMode = true,
}) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null); // 'se', 'sw', 'ne', 'nw'
  const [initialSize, setInitialSize] = useState({ w: 0, h: 0, x: 0, y: 0 });
  const [initialMouse, setInitialMouse] = useState({ x: 0, y: 0 });
  const [snapLines, setSnapLines] = useState({ x: null, y: null });

  const canvasWidth = template?.width || 800;
  const canvasHeight = template?.height || 1000;

  // Handle Dragging
  const handleMouseDownElement = (e, item) => {
    e.stopPropagation();
    const itemId = item.id || item._id;
    onSelectPlaceholder(itemId);
    if (item.locked) return;

    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    });
  };

  const handleMouseDownResize = (e, item, handle) => {
    e.stopPropagation();
    const itemId = item.id || item._id;
    onSelectPlaceholder(itemId);
    if (item.locked) return;

    setIsResizing(true);
    setResizeHandle(handle);
    setInitialMouse({ x: e.clientX, y: e.clientY });
    setInitialSize({
      w: item.width,
      h: item.height,
      x: item.x,
      y: item.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!selectedPlaceholderId) return;
    const selectedItem = template?.placeholders?.find(p => (p.id || p._id) === selectedPlaceholderId);
    if (!selectedItem || selectedItem.locked) return;

    if (isDragging && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      let rawX = (e.clientX - containerRect.left) / zoom - dragOffset.x;
      let rawY = (e.clientY - containerRect.top) / zoom - dragOffset.y;

      // Snap guidelines detection
      let newSnapX = null;
      let newSnapY = null;
      const snapThreshold = 6;

      // Snap to canvas center
      const centerX = canvasWidth / 2 - selectedItem.width / 2;
      const centerY = canvasHeight / 2 - selectedItem.height / 2;

      if (Math.abs(rawX - centerX) < snapThreshold) {
        rawX = centerX;
        newSnapX = canvasWidth / 2;
      }
      if (Math.abs(rawY - centerY) < snapThreshold) {
        rawY = centerY;
        newSnapY = canvasHeight / 2;
      }

      setSnapLines({ x: newSnapX, y: newSnapY });

      onUpdatePlaceholder(selectedItem.id, {
        x: Math.round(rawX),
        y: Math.round(rawY),
      });
    }

    if (isResizing) {
      const deltaX = (e.clientX - initialMouse.x) / zoom;
      const deltaY = (e.clientY - initialMouse.y) / zoom;

      let newWidth = initialSize.w;
      let newHeight = initialSize.h;
      let newX = initialSize.x;
      let newY = initialSize.y;

      if (resizeHandle.includes('e')) {
        newWidth = Math.max(30, initialSize.w + deltaX);
      }
      if (resizeHandle.includes('s')) {
        newHeight = Math.max(20, initialSize.h + deltaY);
      }
      if (resizeHandle.includes('w')) {
        const possibleWidth = initialSize.w - deltaX;
        if (possibleWidth > 30) {
          newWidth = possibleWidth;
          newX = initialSize.x + deltaX;
        }
      }
      if (resizeHandle.includes('n')) {
        const possibleHeight = initialSize.h - deltaY;
        if (possibleHeight > 20) {
          newHeight = possibleHeight;
          newY = initialSize.y + deltaY;
        }
      }

      onUpdatePlaceholder(selectedItem.id, {
        width: Math.round(newWidth),
        height: Math.round(newHeight),
        x: Math.round(newX),
        y: Math.round(newY),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setSnapLines({ x: null, y: null });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, selectedPlaceholderId, zoom, dragOffset, initialMouse, initialSize]);

  // Sort placeholders by zIndex
  const sortedPlaceholders = [...(template?.placeholders || [])].sort(
    (a, b) => (a.zIndex || 1) - (b.zIndex || 1)
  );

  return (
    <div className={`relative flex-1 overflow-auto flex flex-col items-center justify-center p-8 select-none transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100/90 text-slate-800'
    }`}>
      {/* Top Floating Canvas Toolbar */}
      <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-2xl border shadow-xl transition-all ${
        isDarkMode
          ? 'bg-slate-900/95 backdrop-blur-md border-slate-800 shadow-2xl text-slate-200'
          : 'bg-white/95 backdrop-blur-md border-slate-200 shadow-slate-200/50 text-slate-800'
      }`}>
        <button
          onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}
          className={`p-1.5 rounded-lg transition-colors ${
            isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
          }`}
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-semibold w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(z => Math.min(1.8, z + 0.1))}
          className={`p-1.5 rounded-lg transition-colors ${
            isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
          }`}
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(0.85)}
          className={`p-1.5 rounded-lg transition-colors text-xs ${
            isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
          }`}
          title="Reset Zoom"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className={`h-4 w-px mx-1 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
            showGrid
              ? isDarkMode
                ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40 font-medium'
                : 'bg-blue-50 text-blue-600 border border-blue-200/80 font-medium'
              : isDarkMode
              ? 'hover:bg-slate-800 text-slate-400'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
          title="Toggle Grid Lines"
        >
          <Grid className="w-4 h-4" />
          <span className="text-xs">Grid</span>
        </button>
      </div>

      {/* Canvas Workspace */}
      <div
        className={`relative shadow-2xl transition-transform duration-75 origin-center ${
          isDarkMode ? 'shadow-black/60' : 'shadow-slate-300/60'
        }`}
        style={{
          width: `${canvasWidth * zoom}px`,
          height: `${canvasHeight * zoom}px`,
        }}
      >
        <div
          ref={containerRef}
          onClick={() => onSelectPlaceholder(null)}
          className={`relative w-full h-full rounded-lg overflow-hidden border ${
            isDarkMode ? 'border-slate-700/60' : 'border-slate-300'
          } ${
            showGrid ? (isDarkMode ? 'canvas-bg-grid' : 'canvas-bg-grid-light') : ''
          }`}
          style={{
            backgroundColor: template?.bgColor || '#0F172A',
            backgroundImage: template?.bgImage ? `url(${template.bgImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
          }}
        >
          {/* Alignment Snap Lines */}
          {snapLines.x !== null && (
            <div
              className="absolute top-0 bottom-0 w-px bg-cyan-400 z-50 shadow-[0_0_8px_#38bdf8]"
              style={{ left: `${snapLines.x}px` }}
            />
          )}
          {snapLines.y !== null && (
            <div
              className="absolute left-0 right-0 h-px bg-cyan-400 z-50 shadow-[0_0_8px_#38bdf8]"
              style={{ top: `${snapLines.y}px` }}
            />
          )}

          {/* Placeholders Rendered */}
          {sortedPlaceholders.map((item) => {
            const itemId = item.id || item._id;
            const isSelected = selectedPlaceholderId === itemId;

            return (
              <div
                key={itemId}
                onMouseDown={(e) => handleMouseDownElement(e, item)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPlaceholder(itemId);
                }}
                className={`absolute cursor-move group transition-shadow ${
                  isSelected ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-transparent z-40' : ''
                }`}
                style={{
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  width: `${item.width}px`,
                  height: `${item.height}px`,
                  opacity: item.opacity !== undefined ? item.opacity : 1,
                  zIndex: isSelected ? 50 : item.zIndex || 1,
                }}
              >
                {/* Element Content Preview */}
                {(() => {
                  const cornerRadiusCss = item.borderTopLeftRadius !== undefined || item.borderTopRightRadius !== undefined || item.borderBottomRightRadius !== undefined || item.borderBottomLeftRadius !== undefined
                    ? `${item.borderTopLeftRadius ?? (item.borderRadius || 0)}px ${item.borderTopRightRadius ?? (item.borderRadius || 0)}px ${item.borderBottomRightRadius ?? (item.borderRadius || 0)}px ${item.borderBottomLeftRadius ?? (item.borderRadius || 0)}px`
                    : `${item.borderRadius || 0}px`;

                  const imageFilterCss = item.brightness !== undefined || item.contrast !== undefined || item.saturation !== undefined || item.blur
                    ? `brightness(${item.brightness ?? 1}) contrast(${item.contrast ?? 1}) saturate(${item.saturation ?? 1}) blur(${item.blur || 0}px)`
                    : undefined;

                  return (
                    <div
                      className="w-full h-full flex items-center overflow-hidden transition-all"
                      style={{
                        backgroundColor: item.backgroundColor || 'transparent',
                        borderRadius: cornerRadiusCss,
                        borderWidth: item.borderWidth ? `${item.borderWidth}px` : undefined,
                        borderColor: item.borderColor || undefined,
                        borderStyle: item.borderStyle || (item.borderWidth ? 'solid' : undefined),
                        color: item.color || '#FFFFFF',
                        fontSize: `${item.fontSize || 18}px`,
                        fontFamily: item.fontFamily || 'Inter',
                        fontWeight: item.fontWeight || 'normal',
                        textAlign: item.align || 'left',
                        justifyContent: item.align === 'center' ? 'center' : item.align === 'right' ? 'flex-end' : 'flex-start',
                        letterSpacing: item.letterSpacing ? `${item.letterSpacing}px` : undefined,
                        lineHeight: item.lineHeight || 1.2,
                        boxShadow: item.shadow ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)' : undefined,
                        filter: imageFilterCss,
                      }}
                    >
                      {item.type === 'photo' ? (
                        <div 
                          className="w-full h-full relative overflow-hidden bg-slate-800/80 flex flex-col items-center justify-center transition-all"
                          style={{ borderRadius: cornerRadiusCss }}
                        >
                          {item.placeholderImg ? (
                            <img
                              src={item.placeholderImg}
                              alt={item.label}
                              className="w-full h-full object-cover"
                              style={{ borderRadius: cornerRadiusCss, filter: imageFilterCss }}
                            />
                          ) : (
                            <div className="text-center p-3 flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-sky-950/40 to-slate-900/80 border border-sky-400/30 border-dashed" style={{ borderRadius: cornerRadiusCss }}>
                              <Maximize2 className="w-7 h-7 text-sky-400 mb-1 opacity-80 animate-pulse" />
                              <span className="text-xs font-bold text-sky-300 block truncate max-w-full px-2">{item.label}</span>
                              <span className="text-[9px] text-slate-400 font-medium">Shop Photo Upload</span>
                            </div>
                          )}
                        </div>
                      ) : item.type === 'logo' || item.type === 'qr_code' ? (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900/60" style={{ borderRadius: cornerRadiusCss }}>
                          {item.placeholderImg ? (
                            <img src={item.placeholderImg} alt={item.label} className="max-w-full max-h-full object-contain" style={{ filter: imageFilterCss }} />
                          ) : (
                            <span className="text-xs font-bold text-amber-400 px-2">{item.label}</span>
                          )}
                        </div>
                      ) : (
                        <span className="px-2 truncate w-full">
                          {item.text || `[${item.label}]`}
                        </span>
                      )}
                    </div>
                  );
                })()}

                {/* Selection Handles & Controls */}
                {isSelected && !item.locked && (
                  <>
                    {/* Corner Resize Handles */}
                    <div
                      onMouseDown={(e) => handleMouseDownResize(e, item, 'nw')}
                      className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-blue-500 border border-white rounded-full cursor-nwse-resize z-50"
                    />
                    <div
                      onMouseDown={(e) => handleMouseDownResize(e, item, 'ne')}
                      className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-blue-500 border border-white rounded-full cursor-nesw-resize z-50"
                    />
                    <div
                      onMouseDown={(e) => handleMouseDownResize(e, item, 'sw')}
                      className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-blue-500 border border-white rounded-full cursor-nesw-resize z-50"
                    />
                    <div
                      onMouseDown={(e) => handleMouseDownResize(e, item, 'se')}
                      className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-blue-500 border border-white rounded-full cursor-nwse-resize z-50"
                    />

                    {/* Floating Quick Action Overlay */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-xl shadow-lg text-slate-700 z-50">
                      <button
                        onClick={() => onDuplicatePlaceholder(item.id)}
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeletePlaceholder(item.id)}
                        className="p-1 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
