import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { toPng, toJpeg } from 'html-to-image';
import confetti from 'canvas-confetti';
import ImageCropperModal from '../components/common/ImageCropperModal';
import PlaceholderRenderer from '../components/renderers/PlaceholderRenderer';
import { 
  Download, Share2, Sparkles, Upload, CheckCircle2, Image as ImageIcon, 
  Send, Copy, ArrowLeft, RefreshCw, Eye, ShieldCheck, Printer, Check, MessageSquare,
  X, PartyPopper, Award, PlusCircle, HelpCircle, Lock, Crop
} from 'lucide-react';
import { getTemplateShareUrl } from '../utils/url';

export default function ShopTemplateView() {
  const { shareToken } = useParams();
  const { getTemplateByToken, recordPosterGeneration, addToast } = useApp();
  const { user } = useAuth();
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const cleanShareToken = (shareToken || '').trim().replace(/\/+$/, '');
  const isPreviewMode = cleanShareToken === 'preview' || window.location.pathname.includes('/builder') || window.location.search.includes('preview=true');
  const localTemplate = getTemplateByToken(cleanShareToken, true);
  const [cloudTemplate, setCloudTemplate] = useState(null);
  const [loadingCloud, setLoadingCloud] = useState(true);
  
  const template = cloudTemplate || localTemplate;
  const posterRef = useRef(null);

  const previewBoxRef = useRef(null);
  const [availableWidth, setAvailableWidth] = useState(360);

  // Dynamic responsive scaling for mobile/desktop container
  useEffect(() => {
    const updateScale = () => {
      if (previewBoxRef.current) {
        const currentWidth = previewBoxRef.current.clientWidth - 32;
        if (currentWidth > 0) {
          setAvailableWidth(currentWidth);
        }
      } else {
        setAvailableWidth(Math.min(window.innerWidth - 48, 540));
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Fetch live template from MongoDB Atlas Cloud DB
  useEffect(() => {
    let isMounted = true;
    const fetchLiveTemplate = async () => {
      if (!cleanShareToken || cleanShareToken === 'preview' || cleanShareToken === 'sslc-topper-2026' || cleanShareToken === 'demo') {
        setLoadingCloud(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/templates/token/${encodeURIComponent(cleanShareToken)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.template && isMounted) {
            const mergedPlaceholders = data.template.placeholders?.map(cloudPl => {
              const localPl = localTemplate?.placeholders?.find(lp => (lp.id || lp._id) === (cloudPl.id || cloudPl._id));
              if (localPl) {
                const hasLocalCustomCorners = localPl.borderTopLeftRadius !== undefined ||
                                              localPl.borderTopRightRadius !== undefined ||
                                              localPl.borderBottomRightRadius !== undefined ||
                                              localPl.borderBottomLeftRadius !== undefined;

                return {
                  ...cloudPl,
                  borderTopLeftRadius: hasLocalCustomCorners ? localPl.borderTopLeftRadius : (cloudPl.borderTopLeftRadius ?? localPl.borderTopLeftRadius),
                  borderTopRightRadius: hasLocalCustomCorners ? localPl.borderTopRightRadius : (cloudPl.borderTopRightRadius ?? localPl.borderTopRightRadius),
                  borderBottomRightRadius: hasLocalCustomCorners ? localPl.borderBottomRightRadius : (cloudPl.borderBottomRightRadius ?? localPl.borderBottomRightRadius),
                  borderBottomLeftRadius: hasLocalCustomCorners ? localPl.borderBottomLeftRadius : (cloudPl.borderBottomLeftRadius ?? localPl.borderBottomLeftRadius),
                  clipPath: cloudPl.clipPath || localPl.clipPath,
                  maskImage: cloudPl.maskImage || localPl.maskImage,
                  shape: cloudPl.shape || localPl.shape,
                };
              }
              return cloudPl;
            });
            const mergedTemplate = {
              ...data.template,
              placeholders: mergedPlaceholders || data.template.placeholders,
            };
            console.log("3. Loaded Template (Merged)", mergedTemplate);
            setCloudTemplate(mergedTemplate);
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
  const [cropperModal, setCropperModal] = useState({ open: false, placeholderId: null, imageSrc: null });

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

  const isExpired = template?.enableExpiration && template?.expirationDate && template?.expirationDate !== 'never'
    ? new Date(template.expirationDate) < new Date(new Date().setHours(0, 0, 0, 0))
    : false;
  const isPrivate = template?.isPublic === false;

  if (loadingCloud && !template) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 bg-[#FFF1F2] border border-red-200 rounded-2xl flex items-center justify-center text-[#C1121F] mb-4 shadow-xs">
          <RefreshCw className="w-8 h-8 text-[#C1121F] animate-spin" />
        </div>
        <h3 className="text-lg font-black font-heading text-[#0A0A0A]">Loading Poster Studio Template...</h3>
        <p className="text-xs text-[#555555] mt-1 font-medium">Fetching live layout from MongoDB Atlas Cloud</p>
      </div>
    );
  }

  if (!template || isPrivate || isExpired) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 bg-[#FFF1F2] border border-red-200 rounded-2xl flex items-center justify-center text-[#C1121F] mb-4 shadow-xs">
          {isPrivate ? <Lock className="w-8 h-8 text-[#C1121F]" /> : <Eye className="w-8 h-8 text-[#C1121F]" />}
        </div>
        <h2 className="text-2xl font-black font-heading text-[#0A0A0A] mb-2">
          {isPrivate 
            ? 'Private Template Access Only'
            : isExpired 
              ? 'Template Share Link Expired' 
              : 'Template Link Not Found'}
        </h2>
        <p className="text-[#555555] text-sm max-w-md mb-6 leading-relaxed font-medium">
          {isPrivate 
            ? 'Public access to this poster template has been disabled or set to Private by the administrator.'
            : isExpired 
              ? `This poster share link expired on ${template.expirationDate}. Please request an updated share link from your administrator.`
              : 'The requested poster template share link could not be loaded. Please ask your administrator for a fresh share link.'}
        </p>
        <Link to="/" className="px-6 py-2.5 bg-[#0A0A0A] hover:bg-[#C1121F] text-white font-bold rounded-xl text-sm transition-all shadow-xs">
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
      setCropperModal({
        open: true,
        placeholderId: id,
        imageSrc: e.target.result
      });
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

      // Sanitize fieldsData so temporary customer photo data URLs are not persisted in MongoDB
      const sanitizedFields = {};
      Object.keys(formData || {}).forEach(key => {
        const val = formData[key];
        if (typeof val === 'string' && val.startsWith('data:image')) {
          sanitizedFields[key] = '[Temporary Customer Photo]';
        } else {
          sanitizedFields[key] = val;
        }
      });

      // Record in history with clean template background reference URL (zero customer photo storage)
      recordPosterGeneration({
        templateId: template.id,
        templateTitle: template.title,
        generatedBy: user?.shopName || 'Shop Owner',
        shopOwnerId: user?.id || 'usr_shop_guest',
        customerName: customerName,
        previewUrl: template.bgImage || '',
        fieldsData: sanitizedFields,
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
    const activeToken = template?.shareToken || template?.id;
    const shareUrl = getTemplateShareUrl(activeToken);
    const text = encodeURIComponent(`Check out this customized poster generated via JK SocialSpark for ${template.title}! ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    const activeToken = template?.shareToken || template?.id;
    const shareUrl = getTemplateShareUrl(activeToken);
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    addToast('Poster share link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const targetWidth = template?.width || 800;
  const targetHeight = template?.height || 1000;
  
  const maxAllowedWidth = Math.min(availableWidth > 0 ? availableWidth : 360, 540);
  const scaleRatio = Math.max(0.18, Math.min(0.68, maxAllowedWidth / targetWidth));
  const customerName = Object.values(formData).find(val => typeof val === 'string' && val.trim().length > 0) || 'Customer';

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#111111] flex flex-col font-sans">
      {/* SUCCESS CELEBRATION MODAL SCREEN */}
      {generatedSuccess && (
        <div className="fixed inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center relative shadow-2xl overflow-hidden transform scale-100 text-[#111111]">

            {/* Close Button */}
            <button
              onClick={() => setGeneratedSuccess(false)}
              className="absolute top-4 right-4 p-2.5 text-[#555555] hover:text-[#0A0A0A] bg-[#F5F5F3] hover:bg-[#E5E5E5] rounded-2xl transition-colors z-20 border border-[#E5E5E5]"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Celebration Icon Header */}
            <div className="relative z-10 mx-auto w-20 h-20 rounded-3xl bg-[#C1121F] p-0.5 shadow-xl mb-4 flex items-center justify-center">
              <div className="w-full h-full bg-[#FFFFFF] rounded-[22px] flex items-center justify-center">
                <PartyPopper className="w-10 h-10 text-[#C1121F] animate-bounce" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1F2] border border-red-200 text-[#C1121F] text-[11px] font-extrabold mb-2 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#C1121F]" />
              Celebration Alert 🎉
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-heading text-[#0A0A0A] tracking-tight">
              Poster Generated Successfully!
            </h2>

            <p className="text-xs sm:text-sm text-[#555555] font-medium mt-2 max-w-sm mx-auto leading-relaxed">
              Your ultra HD print-ready poster for <strong className="text-[#C1121F] font-bold">{customerName}</strong> has been generated!
            </p>

            {/* Generated Poster Thumbnail Preview */}
            <div className="my-5 relative max-w-[220px] mx-auto rounded-2xl overflow-hidden border border-[#E5E5E5] shadow-xl group bg-[#0A0A0A]">
              <img
                src={lastGeneratedUrl || template.bgImage}
                alt="Generated Poster"
                className="w-full h-auto object-cover rounded-xl"
              />
              <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-[#FFFFFF]/90 backdrop-blur-md rounded-xl border border-[#E5E5E5] text-[9px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                100% High-DPI Print Ready
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => triggerDownload('png')}
                  className="py-3 px-4 bg-[#C1121F] hover:bg-[#8B0E16] text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all hover:scale-102"
                >
                  <Download className="w-4 h-4" />
                  Download PNG
                </button>
                <button
                  onClick={() => triggerDownload('jpg')}
                  className="py-3 px-4 bg-[#FFFFFF] hover:bg-[#111111] text-[#111111] hover:text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 border border-[#111111] transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download JPG
                </button>
              </div>

              <button
                onClick={handleWhatsAppShare}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                Share Directly on WhatsApp
              </button>

              <button
                onClick={resetFormForNextPoster}
                className="w-full py-3 px-4 bg-[#F5F5F3] hover:bg-[#E5E5E5] text-[#111111] font-bold rounded-2xl text-xs flex items-center justify-center gap-2 border border-[#E5E5E5] transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-[#C1121F]" />
                Create Next Customer Poster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Navigation */}
      <header className="bg-[#FFFFFF] border-b border-[#E5E5E5] px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="JK SocialSpark Logo" 
            className="h-9 w-auto object-contain" 
          />
          <div>
            <span className="text-xs text-[#C1121F] font-bold tracking-wide uppercase block">JK SocialSpark</span>
            <h1 className="text-base font-heading font-black text-[#0A0A0A] leading-none">{template.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#555555] bg-[#FFF1F2] border border-red-200 px-3 py-1.5 rounded-full hidden sm:inline-block font-bold">
            Category: <strong className="text-[#C1121F]">{template.category}</strong>
          </span>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] hover:bg-[#F5F5F3] text-[#0A0A0A] text-xs font-bold transition-colors shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#C1121F]" />}
            <span>{copied ? 'Copied' : 'Share Link'}</span>
          </button>
        </div>
      </header>

      {/* Main Container: Left Form + Right Live Preview */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Clean Dynamic Form with Independent Vertical Scroll */}
        <div className="lg:col-span-5 order-2 lg:order-1 bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl p-6 flex flex-col justify-between shadow-xs lg:max-h-[calc(100vh-120px)] overflow-hidden">
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="mb-4 pb-3 border-b border-[#E5E5E5] shrink-0">
              <span className="text-xs font-black text-[#C1121F] uppercase tracking-wider block mb-1">Step 1 of 2</span>
              <h2 className="text-xl font-heading font-black text-[#0A0A0A]">Enter Poster Information</h2>
              <p className="text-xs text-[#555555] font-medium mt-1">
                Fill in the details below. The poster preview on the right will update in real-time.
              </p>
            </div>

            {/* Dynamic Form Inputs (Independently Scrollable Container) */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[420px] lg:max-h-none no-scrollbar">
              {template.placeholders?.map((p) => {
                const pId = p.id || p._id;
                if (p.type === 'photo') {
                  return (
                    <div key={pId} className="space-y-2">
                      <label className="text-xs font-bold text-[#0A0A0A] flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <span>{p.label || 'Upload Photo'}</span>
                          {p.isMandatory && <span className="text-[#C1121F] font-bold" title="Required Field">*</span>}
                        </span>
                        {p.helpTooltip ? (
                          <span className="text-[10px] text-[#C1121F] font-bold flex items-center gap-1 bg-[#FFF1F2] px-2 py-0.5 rounded-full border border-red-200">
                            <HelpCircle className="w-3 h-3 text-[#C1121F] shrink-0" />
                            <span>{p.helpTooltip}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#C1121F] font-bold">Recommended: High Resolution</span>
                        )}
                      </label>

                      <div className="relative border-2 border-dashed border-[#E5E5E5] hover:border-[#C1121F] rounded-2xl p-4 transition-colors bg-[#F8F8F6] text-center group cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(pId, e.target.files[0])}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        {photoPreviews[pId] ? (
                          <div className="flex items-center justify-between gap-3 text-left w-full">
                            <div className="flex items-center gap-3">
                              <img
                                src={photoPreviews[pId]}
                                alt="Uploaded"
                                className="w-14 h-14 rounded-xl object-cover border border-[#E5E5E5] shadow-xs"
                              />
                              <div>
                                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Photo Loaded
                                </span>
                                <span className="text-[10px] text-[#555555] font-medium block">Click or drop to replace photo</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCropperModal({
                                  open: true,
                                  placeholderId: pId,
                                  imageSrc: photoPreviews[pId]
                                });
                              }}
                              className="px-3 py-1.5 bg-[#FFF1F2] hover:bg-red-100 text-[#C1121F] border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0 z-20"
                            >
                              <Crop className="w-3.5 h-3.5" />
                              <span>Crop & Adjust</span>
                            </button>
                          </div>
                        ) : (
                          <div className="py-2">
                            <Upload className="w-6 h-6 text-[#C1121F] group-hover:scale-110 mx-auto mb-1 transition-transform" />
                            <span className="text-xs font-bold text-[#0A0A0A] block">
                              Drag & Drop {p.label || 'Student Photo'}
                            </span>
                            <span className="text-[10px] text-[#555555] font-medium block">
                              or click to browse files from device
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                // Text Inputs
                return (
                  <div key={pId}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-[#0A0A0A]">
                        {p.label || 'Text Field'}
                      </label>
                      {p.required && (
                        <span className="text-[10px] text-[#C1121F] font-bold bg-[#FFF1F2] px-2.5 py-0.5 rounded-full border border-red-200">
                          Required
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={formData[pId] || ''}
                      onChange={(e) => handleInputChange(pId, e.target.value)}
                      placeholder={`Enter ${p.label || 'information'}...`}
                      className="w-full bg-[#F8F8F6] border border-[#E5E5E5] focus:border-[#C1121F] text-[#0A0A0A] font-bold px-3.5 py-2.5 rounded-xl text-sm transition-all outline-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons: Sticky Bottom */}
          <div className="mt-4 pt-4 border-t border-[#E5E5E5] space-y-3 shrink-0">
            <button
              onClick={() => triggerDownload('png')}
              disabled={isGenerating}
              className="w-full py-3.5 px-6 bg-[#C1121F] hover:bg-[#8B0E16] text-white font-extrabold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  Generating High DPI Poster...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  Generate & Download Poster (PNG)
                </>
              )}
            </button>

            <div className={`grid ${cleanShareToken === 'preview' || isPreviewMode ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
              <button
                onClick={() => triggerDownload('jpg')}
                disabled={isGenerating}
                className="py-2.5 px-4 bg-[#FFFFFF] hover:bg-[#111111] text-[#111111] hover:text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-[#111111] disabled:opacity-50 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download JPG
              </button>

              {!isPreviewMode && cleanShareToken !== 'preview' && (
                <button
                  onClick={handleWhatsAppShare}
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-white" />
                  Share on WhatsApp
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Fixed / Sticky Large Live Poster Preview */}
        <div ref={previewBoxRef} className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-center justify-center bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl p-4 sm:p-6 min-h-[480px] lg:sticky lg:top-24 shadow-xs relative overflow-hidden">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#C1121F]" />
              Live Output Preview (High DPI)
            </span>
            <span className="text-[11px] text-[#555555] font-mono font-bold">
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
                className="relative shadow-xl overflow-hidden rounded-xl"
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
                    <PlaceholderRenderer
                      key={pId}
                      placeholder={p}
                      value={textVal}
                      photoSrc={photoSrc}
                      isBuilder={false}
                      standalone={true}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Photo Cropper Modal */}
      {cropperModal.open && (
        <ImageCropperModal
          imageSrc={cropperModal.imageSrc}
          onClose={() => setCropperModal({ open: false, placeholderId: null, imageSrc: null })}
          onCropComplete={(croppedUrl) => {
            setPhotoPreviews(prev => ({ ...prev, [cropperModal.placeholderId]: croppedUrl }));
            setCropperModal({ open: false, placeholderId: null, imageSrc: null });
            addToast('Cropped photo applied to poster preview!');
          }}
        />
      )}
    </div>
  );
}
