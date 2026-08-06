import React from 'react';
import { getNormalizedStyle, getOuterContainerStyle, getCornerRadiusCss, getImageFilterCss } from './styleUtils';

export default function LogoPlaceholder({ placeholder, logoSrc, isBuilder = false, standalone = true }) {
  const outerStyle = getOuterContainerStyle(placeholder);
  const normalizedStyle = getNormalizedStyle(placeholder);
  const cornerRadiusCss = getCornerRadiusCss(placeholder);
  const filterCss = getImageFilterCss(placeholder);

  const imgSrc = logoSrc || placeholder.placeholderImg;

  const content = (
    <div
      className="w-full h-full flex items-center justify-center overflow-hidden transition-all"
      style={{
        ...normalizedStyle,
        overflow: 'hidden',
      }}
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={placeholder.label || 'Logo'}
          className="max-w-full max-h-full object-contain pointer-events-none"
          style={{
            borderRadius: cornerRadiusCss,
            filter: filterCss,
          }}
        />
      ) : (
        <span className="text-xs font-bold text-amber-400 px-2 truncate pointer-events-none">
          {placeholder.label || 'Logo / Graphic'}
        </span>
      )}
    </div>
  );

  if (standalone) {
    return <div style={outerStyle} className="pointer-events-auto">{content}</div>;
  }
  return content;
}
