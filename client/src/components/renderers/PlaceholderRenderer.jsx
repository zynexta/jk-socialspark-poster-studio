import React from 'react';
import PhotoPlaceholder from './PhotoPlaceholder';
import TextPlaceholder from './TextPlaceholder';
import LogoPlaceholder from './LogoPlaceholder';
import QRPlaceholder from './QRPlaceholder';

export default function PlaceholderRenderer({
  placeholder,
  value,
  photoSrc,
  isBuilder = false,
  standalone = true,
}) {
  if (!placeholder) return null;
  console.log("4. Renderer Placeholder", placeholder);

  const type = placeholder.type;

  if (type === 'photo') {
    return (
      <PhotoPlaceholder
        placeholder={placeholder}
        photoSrc={photoSrc}
        isBuilder={isBuilder}
        standalone={standalone}
      />
    );
  }

  if (type === 'logo') {
    return (
      <LogoPlaceholder
        placeholder={placeholder}
        logoSrc={photoSrc}
        isBuilder={isBuilder}
        standalone={standalone}
      />
    );
  }

  if (type === 'qr_code') {
    return (
      <QRPlaceholder
        placeholder={placeholder}
        isBuilder={isBuilder}
        standalone={standalone}
      />
    );
  }

  // Default to Text Placeholder
  return (
    <TextPlaceholder
      placeholder={placeholder}
      textValue={value}
      isBuilder={isBuilder}
      standalone={standalone}
    />
  );
}
