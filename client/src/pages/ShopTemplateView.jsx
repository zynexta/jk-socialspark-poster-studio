import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { toPng, toJpeg } from 'html-to-image';
import confetti from 'canvas-confetti';
import { 
  Download, Share2, Sparkles, Upload, CheckCircle2, Image as ImageIcon, 
  Send, Copy, ArrowLeft, RefreshCw, Eye, ShieldCheck, Printer, Check, MessageSquare,
  X, PartyPopper, Award, PlusCircle, HelpCircle, Lock
} from 'lucide-react';

export default function ShopTemplateView() {
  const { shareToken } = useParams();
  const { getTemplateByToken, recordPosterGeneration, addToast } = useApp();
  const { user } = useAuth();
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const cleanShareToken = (shareToken || '').trim().replace(/\/+$/, '');
  const localTemplate = getTemplateByToken(cleanShareToken, true);
  const [cloudTemplate, setCloudTemplate] = useState(null);
  const [loadingCloud, setLoadingCloud] = useState(true);
  
  const template = cloudTemplate || localTemplate;
  const posterRef = useRef(null);

  // Fetch live template from MongoDB Atlas Cloud DB
  useEffect(() => {
    let isMounted = true;
    const fetchLiveTemplate = async () => {
      if (!cleanShareToken || cleanShareToken === 'preview') {
        setLoadingCloud(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/templates/token/${encodeURIComponent(cleanShareToken)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.template && isMounted) {
            setCloudTemplate(data.template);
          }
        }
      } catch (err) {
        console.warn('Live cloud template fetch info:', err.message);
      } finally {
        if (isMounted) setLoadingCloud(false);
      }
    };

    fetchLiveTemplate();
    return () => { isMounted = false; };
  }, [cleanShareToken]);

  // Dynamic Form Values State
  const [formData, setFormData] = useState({});
  const [photoPreviews, setPhotoPreviews] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSuccess, setGeneratedSuccess] = useState(false);
  const [lastGeneratedUrl, setLastGeneratedUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (template?.placeholders) {
      const initial = {};
      const initialPhotos = {};
      template.placeholders.forEach(p => {
        const pId = p.id || p._id;
        if (p.type === 'photo') {
          initialPhotos[pId] = p.placeholderImg || '';
        } else {
          initial[pId] = p.text || '';
        }
      });
      setFormData(initial);
      setPhotoPreviews(initialPhotos);
    }
  }, [template]);

  const isExpired = template?.expirationDate 
    ? new Date(template.expirationDate) < new Date(new Date().setHours(0, 0, 0, 0))
    : false;
  const isPrivate = template?.isPublic === false;

  if (loadingCloud && !template) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400 mb-4 shadow-xl">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
        <h3 className="text-lg font-bold font-heading text-white">Loading Poster Studio Template...</h3>
        <p className="text-xs text-slate-400 mt-1">Fetching live layout from MongoDB Atlas Cloud</p>
      </div>
    );
  }

  if (!template || isPrivate || isExpired) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center text-rose-400 mb-4 shadow-xl">
          {isPrivate ? <Lock className="w-8 h-8 text-amber-400" /> : <Eye className="w-8 h-8 text-rose-400" />}
        </div>
        <h2 className="text-2xl font-bold font-heading text-white mb-2">
          {isPrivate 
            ? 'Private Template Access Only'
            : isExpired 
              ? 'Template Share Link Expired' 
              : 'Template Link Not Found'}
        </h2>
        <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
          {isPrivate 
            ? 'Public access to this poster template has been disabled or set to Private by the administrator.'
            : isExpired 
              ? `This poster share link expired on ${template.expirationDate}. Please request an updated share link from your administrator.`
              : 'The requested poster template share link could not be loaded. Please ask your administrator for a fresh share link.'}
        </p>
        <Link to="/" className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-all border border-slate-700 shadow-lg">
          Back to Home
        </Link>
      </div>
    );
  }

  const handleInputChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePhotoUpload = (id, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreviews(prev => ({ ...prev, [id]: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const triggerDownload = async (format = 'png') => {
    setIsGenerating(true);

    try {
      let dataUrl = '';

      if (posterRef.current) {
        await new Promise(r => setTimeout(r, 150));
        
        const width = template.width || 800;
        const height = template.height || 1000;

        const exportOptions = {
          quality: 0.98,
          pixelRatio: 2,
          width: width,
          height: height,
          style: {
            transform: 'none',
            transformOrigin: 'top left',
            margin: '0',
            padding: '0',
          },
          skipFonts: true,
          fontEmbedCSS: '',
        };

        try {
          dataUrl = format === 'jpg'
            ? await toJpeg(posterRef.current, exportOptions)
            : await toPng(posterRef.current, exportOptions);
        } catch (retryErr) {
          console.warn('First export failed, retrying without options:', retryErr);
          dataUrl = format === 'jpg'
            ? await toJpeg(posterRef.current, { quality: 0.95 })
            : await toPng(posterRef.current);
        }

        if (dataUrl) {
          const link = document.createElement('a');
          const filename = `${template.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_poster.${format}`;
          link.download = filename;
          link.href = dataUrl;
          link.click();
          setLastGeneratedUrl(dataUrl);
        }
      }

      const customerName = Object.values(formData).find(val => typeof val === 'string' && val.trim().length > 0) || 'Customer';

      // Record in history
      recordPosterGeneration({
        templateId: template.id,
        templateTitle: template.title,
        generatedBy: user?.shopName || 'Shop Owner',
        shopOwnerId: user?.id || 'usr_shop_guest',
        customerName: customerName,
        previewUrl: dataUrl || template.bgImage,
        fieldsData: formData,
      });

      // Fire celebratory fireworks confetti
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 }
      });

      setGeneratedSuccess(true);
      addToast(`Poster generated successfully as ${format.toUpperCase()}!`);
    } catch (err) {
      console.error('Poster export error:', err);
      // Guarantee modal popup even on edge cases
      setGeneratedSuccess(true);
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    } finally {
      setIsGenerating(false);
    }
  };

  const resetFormForNextPoster = () => {
    setGeneratedSuccess(false);
    setLastGeneratedUrl(null);
    if (template?.placeholders) {
      const initial = {};
      const initialPhotos = {};
      template.placeholders.forEach(p => {
        const pId = p.id || p._id;
        if (p.type === 'photo') {
          initialPhotos[pId] = '';
        } else {
          initial[pId] = '';
        }
      });
      setFormData(initial);
      setPhotoPreviews(initialPhotos);
    }
    addToast('Form reset for next poster!');
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Check out this customized poster generated via Zynexta Smart Poster SaaS for ${template.title}!`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    addToast('Poster share link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const targetWidth = template.width || 800;
  const targetHeight = template.height || 1000;
  const scaleRatio = 0.62;
  const customerName = Object.values(formData).find(val => typeof val === 'string' && val.trim().length > 0) || 'Customer';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* SUCCESS CELEBRATION MODAL SCREEN */}
      {generatedSuccess && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-slate-900 border-2 border-blue-500/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center relative shadow-2xl overflow-hidden transform scale-100">
            {/* Top Glow Orb */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-gradient-to-r from-blue-600/40 via-cyan-500/40 to-purple-600/40 blur-3xl rounded-full pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setGeneratedSuccess(false)}
              className="absolute top-4 right-4 p-2.5 text-slate-400 hover:text-white bg-slate-800/90 rounded-2xl hover:bg-slate-700 transition-colors z-20 border border-slate-700"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Celebration Icon Header */}
            <div className="relative z-10 mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-2xl shadow-blue-600/40 mb-4 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                <PartyPopper className="w-10 h-10 text-cyan-300 animate-bounce" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-extrabold mb-2 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              Celebration Alert 🎉
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
              Poster Generated Successfully!
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
              Your ultra HD print-ready poster for <strong className="text-cyan-400 font-bold">{customerName}</strong> has been generated!
            </p>

            {/* Generated Poster Thumbnail Preview */}
            <div className="my-5 relative max-w-[220px] mx-auto rounded-2xl overflow-hidden border-2 border-cyan-400/60 shadow-2xl group bg-slate-950">
              <img
                src={lastGeneratedUrl || template.bgImage}
                alt="Generated Poster"
                className="w-full h-auto object-cover rounded-xl"
              />
              <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-slate-950/90 backdrop-blur-md rounded-xl border border-slate-800 text-[9px] font-bold text-emerald-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                100% High-DPI Print Ready
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => triggerDownload('png')}
                  className="py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  Download PNG
                </button>
                <button
                  onClick={() => triggerDownload('jpg')}
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  Download JPG
                </button>
              </div>

              <button
                onClick={handleWhatsAppShare}
                className="w-full py-3 px-4 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 border border-emerald-500/30 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Share Directly on WhatsApp
              </button>

              <button
                onClick={resetFormForNextPoster}
                className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-800 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-blue-400" />
                Create Next Customer Poster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Navigation */}
      <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 rounded-xl flex items-center justify-center font-extrabold text-white text-sm shadow-lg shadow-blue-600/30">
            ZX
          </div>
          <div>
            <span className="text-xs text-cyan-400 font-semibold tracking-wide uppercase block">Zynexta Poster SaaS</span>
            <h1 className="text-base font-heading font-bold text-white leading-none">{template.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 hidden sm:inline-block">
            Category: <strong className="text-slate-200">{template.category}</strong>
          </span>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Share Link'}</span>
          </button>
        </div>
      </header>

      {/* Main Container: Left Form + Right Live Preview */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Clean Dynamic Form */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="mb-6 pb-4 border-b border-slate-800">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">Step 1 of 2</span>
              <h2 className="text-xl font-heading font-bold text-white">Enter Poster Information</h2>
              <p className="text-xs text-slate-400 mt-1">
                Fill in the details below. The poster preview on the right will update in real-time.
              </p>
            </div>

            {/* Dynamic Form Inputs */}
            <div className="space-y-5">
              {template.placeholders?.map((p) => {
                const pId = p.id || p._id;
                if (p.type === 'photo') {
                  return (
                    <div key={pId} className="space-y-2">
                      <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <span>{p.label || 'Upload Photo'}</span>
                          {p.isMandatory && <span className="text-rose-400 font-bold" title="Required Field">*</span>}
                        </span>
                        {p.helpTooltip ? (
                          <span className="text-[10px] text-cyan-300 font-normal flex items-center gap-1 bg-cyan-950/70 px-2 py-0.5 rounded-full border border-cyan-500/40">
                            <HelpCircle className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span>{p.helpTooltip}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-cyan-400 font-medium">Recommended: High Resolution</span>
                        )}
                      </label>

                      <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-4 transition-colors bg-slate-950/60 text-center group cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(pId, e.target.files[0])}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        {photoPreviews[pId] ? (
                          <div className="flex items-center gap-3 text-left">
                            <img
                              src={photoPreviews[pId]}
                              alt="Uploaded"
                              className="w-14 h-14 rounded-lg object-cover border border-slate-700"
                            />
                            <div>
                              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Photo Loaded
                              </span>
                              <span className="text-[10px] text-slate-400 block">Click or drop to replace photo</span>
                            </div>
                          </div>
                        ) : (
                          <div className="py-2">
                            <Upload className="w-7 h-7 text-cyan-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-medium text-slate-300 block">Drag & Drop Student Photo</span>
                            <span className="text-[10px] text-slate-500">or click to browse files from device</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                if (p.type === 'logo' || p.type === 'qr_code') {
                  return null; // Handled automatically by template
                }

                return (
                  <div key={pId} className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span>{p.label || 'Text Value'}</span>
                        {p.isMandatory && <span className="text-rose-400 font-bold" title="Required Field">*</span>}
                      </span>
                      {p.helpTooltip && (
                        <span className="text-[10px] text-cyan-300 font-normal flex items-center gap-1 bg-cyan-950/70 px-2.5 py-0.5 rounded-full border border-cyan-500/40">
                          <HelpCircle className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>{p.helpTooltip}</span>
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={formData[pId] !== undefined ? formData[pId] : p.text || ''}
                      onChange={(e) => handleInputChange(pId, e.target.value)}
                      placeholder={p.helpTooltip ? `e.g. ${p.helpTooltip}` : `Enter ${p.label}...`}
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm transition-all focus:border-cyan-400"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
            <button
              onClick={() => triggerDownload('png')}
              disabled={isGenerating}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating High-Res Poster...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  Generate & Download Poster (PNG)
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => triggerDownload('jpg')}
                disabled={isGenerating}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                Download JPG
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="py-2.5 px-4 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-emerald-500/30"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Share on WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Live Poster Preview */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 min-h-[600px] shadow-2xl relative overflow-hidden">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-cyan-400" />
              Live Output Preview (High DPI)
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {targetWidth} x {targetHeight} px ({template.aspectRatio || '4:5'})
            </span>
          </div>

          {/* Scaled Display Container for On-Screen Preview */}
          <div className="w-full flex justify-center py-2 overflow-hidden">
            <div
              style={{
                width: `${targetWidth * scaleRatio}px`,
                height: `${targetHeight * scaleRatio}px`,
                position: 'relative',
              }}
            >
              {/* Clean, 1:1 Target Element for html-to-image Export */}
              <div
                ref={posterRef}
                className="relative shadow-2xl overflow-hidden rounded-lg"
                style={{
                  width: `${targetWidth}px`,
                  height: `${targetHeight}px`,
                  backgroundColor: template.bgColor || '#0F172A',
                  backgroundImage: template.bgImage ? `url(${template.bgImage})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: `scale(${scaleRatio})`,
                  transformOrigin: 'top left',
                }}
              >
                {template.placeholders?.map((p) => {
                  const pId = p.id || p._id;
                  const textVal = formData[pId] !== undefined ? formData[pId] : p.text;
                  const photoSrc = photoPreviews[pId] || p.placeholderImg;

                  return (
                    <div
                      key={pId}
                      className="absolute flex items-center"
                      style={{
                        left: `${p.x}px`,
                        top: `${p.y}px`,
                        width: `${p.width}px`,
                        height: `${p.height}px`,
                        opacity: p.opacity !== undefined ? p.opacity : 1,
                        zIndex: p.zIndex || 1,
                      }}
                    >
                      {(() => {
                        const cornerRadiusCss = p.borderTopLeftRadius !== undefined || p.borderTopRightRadius !== undefined || p.borderBottomRightRadius !== undefined || p.borderBottomLeftRadius !== undefined
                          ? `${p.borderTopLeftRadius ?? (p.borderRadius || 0)}px ${p.borderTopRightRadius ?? (p.borderRadius || 0)}px ${p.borderBottomRightRadius ?? (p.borderRadius || 0)}px ${p.borderBottomLeftRadius ?? (p.borderRadius || 0)}px`
                          : `${p.borderRadius || 0}px`;

                        const imageFilterCss = p.brightness !== undefined || p.contrast !== undefined || p.saturation !== undefined || p.blur
                          ? `brightness(${p.brightness ?? 1}) contrast(${p.contrast ?? 1}) saturate(${p.saturation ?? 1}) blur(${p.blur || 0}px)`
                          : undefined;

                        return (
                          <div
                            className="w-full h-full flex items-center overflow-hidden"
                            style={{
                              backgroundColor: p.backgroundColor || 'transparent',
                              borderRadius: cornerRadiusCss,
                              borderWidth: p.borderWidth ? `${p.borderWidth}px` : undefined,
                              borderColor: p.borderColor || undefined,
                              borderStyle: p.borderStyle || (p.borderWidth ? 'solid' : undefined),
                              color: p.color || '#FFFFFF',
                              fontSize: `${p.fontSize || 18}px`,
                              fontFamily: p.fontFamily || 'Inter',
                              fontWeight: p.fontWeight || 'normal',
                              fontStyle: p.fontStyle || 'normal',
                              textAlign: p.align || 'left',
                              justifyContent: p.align === 'center' ? 'center' : p.align === 'right' ? 'flex-end' : 'flex-start',
                              letterSpacing: p.letterSpacing ? `${p.letterSpacing}px` : undefined,
                              boxShadow: p.shadow ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)' : undefined,
                              filter: imageFilterCss,
                            }}
                          >
                            {p.type === 'photo' ? (
                              photoSrc ? (
                                <img
                                  src={photoSrc}
                                  alt="Uploaded"
                                  className="w-full h-full object-cover rounded-[inherit]"
                                  style={{ filter: imageFilterCss }}
                                />
                              ) : (
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-semibold">
                                  [Photo Here]
                                </div>
                              )
                            ) : p.type === 'logo' || p.type === 'qr_code' ? (
                              <img
                                src={p.placeholderImg}
                                alt="Graphic"
                                className="max-w-full max-h-full object-contain mx-auto"
                                style={{ filter: imageFilterCss }}
                              />
                            ) : (
                              <span className="px-2 truncate w-full">
                                {textVal || `[${p.label}]`}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
