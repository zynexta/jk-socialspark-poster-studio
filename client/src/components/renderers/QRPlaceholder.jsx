import React from 'react';
import { getNormalizedStyle, getOuterContainerStyle, getCornerRadiusCss } from './styleUtils';
import { QrCode } from 'lucide-react';

export default function QRPlaceholder({ placeholder, isBuilder = false, standalone = true }) {
  const outerStyle = getOuterContainerStyle(placeholder);
  const normalizedStyle = getNormalizedStyle(placeholder);
  const cornerRadiusCss = getCornerRadiusCss(placeholder);

  const imgSrc = placeholder.placeholderImg;

  const content = (
    <div
      className="w-full h-full flex items-center justify-center overflow-hidden transition-all bg-white p-1"
      style={{
        ...normalizedStyle,
        overflow: 'hidden',
      }}
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={placeholder.label || 'QR Code'}
          className="w-full h-full object-contain pointer-events-none"
          style={{ borderRadius: cornerRadiusCss }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-800 pointer-events-none">
          <QrCode className="w-8 h-8 text-slate-900" />
          <span className="text-[10px] font-bold text-slate-700 mt-0.5">Scan QR</span>
        </div>
      )}
    </div>
  );

  if (standalone) {
    return <div style={outerStyle} className="pointer-events-auto">{content}</div>;
  }
  return content;
}
