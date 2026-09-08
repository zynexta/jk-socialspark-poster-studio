import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Lock, Unlock, Trash2, Copy, Layers, Eye, Grid, Move, Maximize2, Sliders, ChevronUp, ChevronDown } from 'lucide-react';
import PlaceholderRenderer from '../renderers/PlaceholderRenderer';

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
}) {
  const containerRef = useRef(null);
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null); // 'se', 'sw', 'ne', 'nw'
  const [initialSize, setInitialSize] = useState({ w: 0, h: 0, x: 0, y: 0 });
  const [initialMouse, setInitialMouse] = useState({ x: 0, y: 0 });
  const [snapLines, setSnapLines] = useState({ x: null, y: null });

  const canvasWidth = template?.width || 800;
  const canvasHeight = template?.height || 1000;

  // Auto-fit zoom for mobile screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && setZoom) {
        const autoZoom = Math.max(0.3, Math.min(0.42, (window.innerWidth - 32) / canvasWidth));
        setZoom(Number(autoZoom.toFixed(2)));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasWidth, setZoom]);

  const getClientPos = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  // Handle Dragging (Mouse & Touch)
  const handlePointerDownElement = (e, item) => {
    e.stopPropagation();
    const itemId = item.id || item._id;
    onSelectPlaceholder(itemId);
    if (item.locked) return;

    setIsDragging(true);
    const pos = getClientPos(e);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: (pos.x - rect.left) / zoom,
      y: (pos.y - rect.top) / zoom,
    });
  };

  const handlePointerDownResize = (e, item, handle) => {
    e.stopPropagation();
    const itemId = item.id || item._id;
    onSelectPlaceholder(itemId);
    if (item.locked) return;

    setIsResizing(true);
    setResizeHandle(handle);
    const pos = getClientPos(e);
    setInitialMouse({ x: pos.x, y: pos.y });
    setInitialSize({
      w: item.width,
      h: item.height,
      x: item.x,
      y: item.y,
    });
  };

  const handlePointerMove = (e) => {
    if (!selectedPlaceholderId) return;
    const selectedItem = template?.placeholders?.find(p => String(p.id || p._id) === String(selectedPlaceholderId));
    if (!selectedItem || selectedItem.locked) return;

    const pos = getClientPos(e);

    if (isDragging && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      let rawX = (pos.x - containerRect.left) / zoom - dragOffset.x;
      let rawY = (pos.y - containerRect.top) / zoom - dragOffset.y;

      // Snap guidelines detection
      let newSnapX = null;
      let newSnapY = null;
      const snapThreshold = 6;

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

      onUpdatePlaceholder(selectedItem.id || selectedItem._id, {
        x: Math.round(rawX),
        y: Math.round(rawY),
      });
    }

    if (isResizing) {
      const deltaX = (pos.x - initialMouse.x) / zoom;
      const deltaY = (pos.y - initialMouse.y) / zoom;

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

      onUpdatePlaceholder(selectedItem.id || selectedItem._id, {
        width: Math.round(newWidth),
        height: Math.round(newHeight),
        x: Math.round(newX),
        y: Math.round(newY),
      });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setSnapLines({ x: null, y: null });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, isResizing, selectedPlaceholderId, zoom, dragOffset, initialMouse, initialSize, template]);

  // Sort placeholders by zIndex
  const sortedPlaceholders = [...(template?.placeholders || [])].sort(
    (a, b) => (a.zIndex || 1) - (b.zIndex || 1)
  );

  return (
    <div className="relative flex-1 overflow-auto w-full h-full flex flex-col items-center select-none bg-[#F5F5F3] text-[#111111] p-4 sm:p-8 custom-scrollbar">
      {/* Floating Canvas Controls Overlay */}
      <div className="sticky top-2 sm:top-4 z-40 mb-2 shrink-0 transition-all">
        {controlsCollapsed ? (
          <button
            onClick={() => setControlsCollapsed(false)}
            className="px-3.5 py-2 rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] shadow-lg text-[#0A0A0A] font-bold text-xs flex items-center gap-2 hover:bg-[#F5F5F3] transition-all transform hover:scale-105"
            title="Expand Canvas Controls"
          >
            <Sliders className="w-4 h-4 text-[#C1121F]" />
            <span>Canvas Controls ({Math.round(zoom * 100)}%)</span>
            {showGrid && <span className="w-2 h-2 rounded-full bg-[#C1121F]" title="Grid Active" />}
            <ChevronDown className="w-3.5 h-3.5 text-[#555555]" />
          </button>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] shadow-xl text-[#111111] transition-all">
            <button
              onClick={() => setZoom(z => Math.max(0.3, Number((z - 0.05).toFixed(2))))}
              className="p-1.5 rounded-lg transition-colors hover:bg-[#F5F5F3] text-[#555555] hover:text-[#0A0A0A]"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(0.85)}
              className="text-xs font-bold px-2 py-0.5 rounded-md hover:bg-[#F5F5F3] text-[#0A0A0A]"
              title="Click to reset zoom to 85%"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={() => setZoom(z => Math.min(1.8, Number((z + 0.05).toFixed(2))))}
              className="p-1.5 rounded-lg transition-colors hover:bg-[#F5F5F3] text-[#555555] hover:text-[#0A0A0A]"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(0.85)}
              className="p-1.5 rounded-lg transition-colors text-xs hover:bg-[#F5F5F3] text-[#777777]"
              title="Reset Zoom to 85%"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="h-4 w-px mx-0.5 bg-[#E5E5E5]" />
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
                showGrid
                  ? 'bg-[#C1121F] text-white font-bold shadow-xs'
                  : 'bg-[#F8F8F6] border border-[#E5E5E5] text-[#555555] hover:text-[#0A0A0A] hover:bg-[#E5E5E5]'
              }`}
              title={showGrid ? "Hide Canvas Alignment Grid" : "Show Canvas Alignment Grid"}
            >
              <Grid className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">Grid</span>
            </button>
            <div className="h-4 w-px mx-0.5 bg-[#E5E5E5]" />
            <button
              onClick={() => setControlsCollapsed(true)}
              className="p-1.5 rounded-lg transition-colors text-[#555555] hover:text-[#0A0A0A] hover:bg-[#F5F5F3]"
              title="Minimize Canvas Controls"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Canvas Centered Workspace Wrapper */}
      <div className="my-auto py-4 flex flex-col items-center justify-center shrink-0">
        <div
          className="relative shadow-2xl transition-transform duration-75 origin-center rounded-xl overflow-hidden border border-[#E5E5E5]"
          style={{
            width: `${canvasWidth * zoom}px`,
            height: `${canvasHeight * zoom}px`,
          }}
        >
          <div
            ref={containerRef}
            onClick={() => onSelectPlaceholder(null)}
            className="relative w-full h-full"
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
          {/* Visible Canvas Alignment Grid Overlay */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-200"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(193, 18, 31, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(193, 18, 31, 0.15) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />
          )}

          {/* Alignment Snap Lines */}
          {snapLines.x !== null && (
            <div
              className="absolute top-0 bottom-0 w-px bg-[#C1121F] z-50 shadow-[0_0_8px_#C1121F]"
              style={{ left: `${snapLines.x}px` }}
            />
          )}
          {snapLines.y !== null && (
            <div
              className="absolute left-0 right-0 h-px bg-[#C1121F] z-50 shadow-[0_0_8px_#C1121F]"
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
                onMouseDown={(e) => handlePointerDownElement(e, item)}
                onTouchStart={(e) => handlePointerDownElement(e, item)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPlaceholder(itemId);
                }}
                className={`absolute cursor-move group transition-shadow ${
                  isSelected ? 'ring-2 ring-[#C1121F] ring-offset-1 ring-offset-transparent z-40' : ''
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
                {/* Unified Placeholder Renderer */}
                <PlaceholderRenderer
                  placeholder={item}
                  isBuilder={true}
                  standalone={false}
                />

                {/* Selection Handles & Controls */}
                {isSelected && !item.locked && (
                  <>
                    {/* Corner Resize Handles */}
                    <div
                      onMouseDown={(e) => handlePointerDownResize(e, item, 'nw')}
                      onTouchStart={(e) => handlePointerDownResize(e, item, 'nw')}
                      className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-[#C1121F] border-2 border-white rounded-full cursor-nwse-resize z-50 shadow-xs"
                    />
                    <div
                      onMouseDown={(e) => handlePointerDownResize(e, item, 'ne')}
                      onTouchStart={(e) => handlePointerDownResize(e, item, 'ne')}
                      className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#C1121F] border-2 border-white rounded-full cursor-nesw-resize z-50 shadow-xs"
                    />
                    <div
                      onMouseDown={(e) => handlePointerDownResize(e, item, 'sw')}
                      onTouchStart={(e) => handlePointerDownResize(e, item, 'sw')}
                      className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-[#C1121F] border-2 border-white rounded-full cursor-nesw-resize z-50 shadow-xs"
                    />
                    <div
                      onMouseDown={(e) => handlePointerDownResize(e, item, 'se')}
                      onTouchStart={(e) => handlePointerDownResize(e, item, 'se')}
                      className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-[#C1121F] border-2 border-white rounded-full cursor-nwse-resize z-50 shadow-xs"
                    />

                    {/* Floating Quick Action Overlay */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#FFFFFF] border border-[#E5E5E5] px-2 py-1 rounded-xl shadow-md text-[#111111] z-50">
                      <button
                        onClick={() => onDuplicatePlaceholder(item.id)}
                        className="p-1 hover:bg-[#F5F5F3] rounded-lg text-[#111111] transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeletePlaceholder(item.id)}
                        className="p-1 hover:bg-[#FFF1F2] rounded-lg text-[#C1121F] transition-colors"
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
  </div>
  );
}
