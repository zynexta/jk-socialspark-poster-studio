import React from 'react';
import { getNormalizedStyle, getOuterContainerStyle, getCornerRadiusCss, getImageFilterCss } from './styleUtils';
import { Maximize2 } from 'lucide-react';

export default function PhotoPlaceholder({ placeholder, photoSrc, isBuilder = false, standalone = true }) {
  const outerStyle = getOuterContainerStyle(placeholder);
  const normalizedStyle = getNormalizedStyle(placeholder);
  const cornerRadiusCss = getCornerRadiusCss(placeholder);
  const filterCss = getImageFilterCss(placeholder);

  const imgSrc = photoSrc || placeholder.placeholderImg;

  const content = (
    <div
      className="w-full h-full relative overflow-hidden flex items-center justify-center transition-all"
      style={{
        ...normalizedStyle,
        overflow: 'hidden',
      }}
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={placeholder.label || 'Photo'}
          className="w-full h-full object-cover pointer-events-none"
          style={{
            borderRadius: cornerRadiusCss,
            clipPath: normalizedStyle.clipPath,
            WebkitClipPath: normalizedStyle.WebkitClipPath,
            filter: filterCss,
          }}
        />
      ) : (
        <div
          className="text-center p-3 flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-sky-950/40 to-slate-900/80 border border-sky-400/30 border-dashed pointer-events-none"
          style={{ borderRadius: cornerRadiusCss }}
        >
          <Maximize2 className="w-7 h-7 text-sky-400 mb-1 opacity-80 animate-pulse" />
          <span className="text-xs font-bold text-sky-300 block truncate max-w-full px-2">
            {placeholder.label || 'Photo Upload'}
          </span>
          <span className="text-[9px] text-slate-400 font-medium">
            {isBuilder ? 'Shop Photo Upload Box' : '[Photo Here]'}
          </span>
        </div>
      )}
    </div>
  );

  if (standalone) {
    return <div style={outerStyle} className="pointer-events-auto">{content}</div>;
  }
  return content;
}
