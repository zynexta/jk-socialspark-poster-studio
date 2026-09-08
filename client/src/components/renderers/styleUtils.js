/**
 * Centralized Style Normalizer for JK SocialSpark.
 * Converts placeholder JSON (whether nested in .style or top-level properties)
 * into a complete, pixel-perfect CSS style object.
 */

export function getCornerRadiusCss(item) {
  const style = item.style || {};
  const tl = item.borderTopLeftRadius ?? style.borderTopLeftRadius;
  const tr = item.borderTopRightRadius ?? style.borderTopRightRadius;
  const br = item.borderBottomRightRadius ?? style.borderBottomRightRadius;
  const bl = item.borderBottomLeftRadius ?? style.borderBottomLeftRadius;
  const r = item.borderRadius ?? style.borderRadius ?? 0;

  if (tl !== undefined || tr !== undefined || br !== undefined || bl !== undefined) {
    return `${tl ?? r}px ${tr ?? r}px ${br ?? r}px ${bl ?? r}px`;
  }
  return `${r}px`;
}

export function getImageFilterCss(item) {
  const style = item.style || {};
  const brightness = item.brightness ?? style.brightness;
  const contrast = item.contrast ?? style.contrast;
  const saturation = item.saturation ?? style.saturation;
  const blur = item.blur ?? style.blur;

  if (brightness !== undefined || contrast !== undefined || saturation !== undefined || blur) {
    return `brightness(${brightness ?? 1}) contrast(${contrast ?? 1}) saturate(${saturation ?? 1}) blur(${blur || 0}px)`;
  }
  return style.filter || undefined;
}

export function getNormalizedStyle(item) {
  const s = item.style || {};

  const cornerRadius = getCornerRadiusCss(item);
  const filter = getImageFilterCss(item);

  const borderEnabled = item.borderEnabled !== false;
  const borderWidth = borderEnabled ? (item.borderWidth ?? s.borderWidth) : 0;
  const borderColor = borderEnabled ? (item.borderColor ?? s.borderColor) : undefined;
  const borderStyle = borderEnabled ? (item.borderStyle ?? s.borderStyle ?? (borderWidth ? 'solid' : undefined)) : 'none';

  const shadow = item.shadow ?? s.shadow;
  const boxShadow = s.boxShadow || (shadow ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)' : undefined);

  const clipPath = item.clipPath ?? s.clipPath ?? undefined;
  const maskImage = item.maskImage ?? s.maskImage ?? undefined;

  const resStyle = {
    // Colors & Backgrounds
    backgroundColor: item.backgroundColor ?? s.backgroundColor ?? 'transparent',
    color: item.color ?? s.color ?? '#FFFFFF',

    // Borders & Shapes
    borderRadius: cornerRadius,
    borderWidth: borderWidth ? `${borderWidth}px` : undefined,
    borderColor: borderColor || undefined,
    borderStyle: borderStyle,
    boxShadow: boxShadow,
    clipPath: clipPath,
    WebkitClipPath: clipPath,
    maskImage: maskImage,
    WebkitMaskImage: maskImage,

    // Typography
    fontSize: `${item.fontSize ?? s.fontSize ?? 18}px`,
    fontFamily: item.fontFamily ?? s.fontFamily ?? 'Inter',
    fontWeight: item.fontWeight ?? s.fontWeight ?? 'normal',
    fontStyle: item.fontStyle ?? s.fontStyle ?? 'normal',
    textAlign: item.align ?? item.textAlign ?? s.textAlign ?? 'left',
    letterSpacing: (item.letterSpacing ?? s.letterSpacing) ? `${item.letterSpacing ?? s.letterSpacing}px` : undefined,
    lineHeight: item.lineHeight ?? s.lineHeight ?? 1.2,

    // Effects & Blend Modes
    filter: filter,
    mixBlendMode: item.mixBlendMode ?? s.mixBlendMode ?? undefined,
    opacity: item.opacity ?? s.opacity ?? 1,
  };

  console.log("5. Final Computed DOM Style:", resStyle);
  return resStyle;
}

export function getOuterContainerStyle(item) {
  const rotation = item.rotation ?? item.style?.rotation ?? 0;
  const opacity = item.opacity ?? item.style?.opacity ?? 1;

  return {
    position: 'absolute',
    left: `${item.x}px`,
    top: `${item.y}px`,
    width: `${item.width}px`,
    height: `${item.height}px`,
    zIndex: item.zIndex ?? item.style?.zIndex ?? 1,
    opacity: opacity,
    transform: rotation ? `rotate(${rotation}deg)` : undefined,
    transformOrigin: 'center center',
  };
}
