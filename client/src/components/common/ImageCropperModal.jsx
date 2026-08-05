import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Crop, ZoomIn, ZoomOut, RotateCw, RotateCcw, Check, X, Move, Sparkles, RefreshCw } from 'lucide-react';

export default function ImageCropperModal({ imageSrc, onCropComplete, onClose, title = 'Crop & Position Photo' }) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState('4:5'); // '1:1' | '4:5' | '3:4'
  const [imageLoaded, setImageLoaded] = useState(false);

  const containerRef = useRef(null);
  const imgElementRef = useRef(null);

  // Load image
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgElementRef.current = img;
      setImageLoaded(true);
      setPan({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Pointer event handlers for drag/pan
  const handlePointerDown = (e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - pan.x, y: clientY - pan.y });
  };

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setPan({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Generate high quality cropped canvas output
  const handleApplyCrop = () => {
    if (!imgElementRef.current) return;

    const img = imgElementRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Output target dimensions based on aspect ratio
    let targetW = 800;
    let targetH = 1000;
    if (aspectRatio === '1:1') {
      targetW = 800;
      targetH = 800;
    } else if (aspectRatio === '3:4') {
      targetW = 750;
      targetH = 1000;
    }

    canvas.width = targetW;
    canvas.height = targetH;

    // Fill white background for transparency safety
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetW, targetH);

    ctx.save();
    ctx.translate(targetW / 2, targetH / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    const baseScale = Math.min(targetW / img.width, targetH / img.height);
    const finalScale = baseScale * zoom;

    const scaledPanX = (pan.x / 280) * targetW;
    const scaledPanY = (pan.y / 350) * targetH;

    ctx.translate(scaledPanX, scaledPanY);
    ctx.scale(finalScale, finalScale);

    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onCropComplete(croppedDataUrl);
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-heading font-bold text-white leading-tight">{title}</h3>
              <p className="text-xs text-slate-400">Drag to reposition, scale & rotate before applying</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Crop Viewport */}
        <div className="p-6 flex-1 flex flex-col items-center justify-center bg-slate-950/40 relative overflow-hidden select-none">
          {/* Crop Container Window */}
          <div
            ref={containerRef}
            onMouseDown={handlePointerDown}
            onTouchStart={handlePointerDown}
            className="relative border-2 border-dashed border-cyan-400/80 rounded-2xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing bg-slate-900 flex items-center justify-center transition-all duration-300"
            style={{
              width: aspectRatio === '1:1' ? '270px' : aspectRatio === '3:4' ? '270px' : '260px',
              height: aspectRatio === '1:1' ? '270px' : aspectRatio === '3:4' ? '360px' : '325px',
            }}
          >
            {/* Rule of Thirds Overlay Grid */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-20 border border-cyan-500/20">
              <div className="border-r border-b border-cyan-500/20" />
              <div className="border-r border-b border-cyan-500/20" />
              <div className="border-b border-cyan-500/20" />
              <div className="border-r border-b border-cyan-500/20" />
              <div className="border-r border-b border-cyan-500/20" />
              <div className="border-b border-cyan-500/20" />
              <div className="border-r border-cyan-500/20" />
              <div className="border-r border-cyan-500/20" />
              <div />
            </div>

            {/* Transform Image */}
            {imageLoaded ? (
              <img
                src={imageSrc}
                alt="Crop Target"
                draggable={false}
                className="max-w-none transition-transform duration-75 pointer-events-none"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin text-cyan-400 mb-2" />
                <span className="text-xs">Loading image...</span>
              </div>
            )}
          </div>

          <span className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5 font-medium">
            <Move className="w-3.5 h-3.5 text-cyan-400" /> Touch or drag mouse to center face / subject
          </span>
        </div>

        {/* Control Toolbar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 space-y-4">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="range"
              min="0.8"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <ZoomIn className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-xs font-mono text-cyan-300 w-10 text-right">{Math.round(zoom * 100)}%</span>
          </div>

          {/* Aspect Ratio & Rotation Buttons */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {['4:5', '1:1', '3:4'].map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    aspectRatio === ratio
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs border border-slate-700 flex items-center gap-1 transition-colors"
                title="Rotate Counter-Clockwise"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              </button>
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs border border-slate-700 flex items-center gap-1 transition-colors"
                title="Rotate Clockwise"
              >
                <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setPan({ x: 0, y: 0 });
                  setZoom(1);
                  setRotation(0);
                }}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs border border-slate-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Check className="w-4 h-4" />
            <span>Apply Cropped Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
