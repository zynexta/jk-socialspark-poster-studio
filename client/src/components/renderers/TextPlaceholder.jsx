import React from 'react';
import { getNormalizedStyle, getOuterContainerStyle } from './styleUtils';

export default function TextPlaceholder({ placeholder, textValue, isBuilder = false, standalone = true }) {
  const outerStyle = getOuterContainerStyle(placeholder);
  const normalizedStyle = getNormalizedStyle(placeholder);

  const displayContent = textValue !== undefined && textValue !== null
    ? textValue
    : placeholder.text !== undefined
      ? placeholder.text
      : `[${placeholder.label || 'Text Field'}]`;

  const content = (
    <div
      className="w-full h-full flex items-center overflow-hidden transition-all"
      style={{
        ...normalizedStyle,
        justifyContent:
          normalizedStyle.textAlign === 'center'
            ? 'center'
            : normalizedStyle.textAlign === 'right'
            ? 'flex-end'
            : 'flex-start',
      }}
    >
      <span className="w-full truncate px-1 pointer-events-none">
        {displayContent}
      </span>
    </div>
  );

  if (standalone) {
    return <div style={outerStyle} className="pointer-events-auto">{content}</div>;
  }
  return content;
}
