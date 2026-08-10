import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const generateSlug = (title) => {
  if (!title) return `template-${Date.now().toString(36)}`;
  const clean = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return clean || `template-${Date.now().toString(36)}`;
};

const INITIAL_CATEGORIES = [
  { id: 'cat_sslc', name: 'SSLC / Academic', icon: 'GraduationCap', count: 12, color: 'from-blue-600 to-indigo-600' },
  { id: 'cat_security', name: 'Security & CCTV', icon: 'ShieldCheck', count: 8, color: 'from-cyan-600 to-blue-600' },
  { id: 'cat_sports', name: 'Sports & Awards', icon: 'Trophy', count: 5, color: 'from-amber-500 to-orange-600' },
  { id: 'cat_offers', name: 'Offers & Discounts', icon: 'Tag', count: 14, color: 'from-emerald-600 to-teal-600' },
  { id: 'cat_events', name: 'Events & Festivals', icon: 'Calendar', count: 9, color: 'from-purple-600 to-pink-600' },
];

const INITIAL_TEMPLATES = [
  {
    id: 'tmpl_sslc_topper_2026',
    shareToken: 'sslc-topper-2026',
    title: 'SSLC State Topper 2026 Poster',
    category: 'SSLC / Academic',
    width: 800,
    height: 1000,
    aspectRatio: '4:5',
    bgImage: '',
    bgColor: '#0A0A0A',
    createdAt: '2026-07-20',
    generatedCount: 0,
    isPublic: true,
    expirationDate: '2026-12-31',
    placeholders: [
      {
        id: 'pl_frame_1',
        type: 'custom_text',
        label: 'Outer Red Frame',
        text: '',
        x: 40,
        y: 40,
        width: 720,
        height: 920,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#C1121F',
        borderStyle: 'solid',
        borderEnabled: true,
        backgroundColor: 'transparent',
        zIndex: 1,
      },
      {
        id: 'pl_subtitle_1',
        type: 'custom_text',
        label: 'Subtitle Banner',
        text: 'ACADEMIC DISTINCTION',
        x: 100,
        y: 85,
        width: 600,
        height: 30,
        fontSize: 16,
        fontFamily: 'Outfit',
        fontWeight: 'bold',
        color: '#C1121F',
        align: 'center',
        zIndex: 2,
      },
      {
        id: 'pl_title_1',
        type: 'custom_text',
        label: 'Main Poster Title',
        text: 'SSLC State Topper 2026',
        x: 100,
        y: 120,
        width: 600,
        height: 45,
        fontSize: 32,
        fontFamily: 'Outfit',
        fontWeight: 'bold',
        color: '#FFFFFF',
        align: 'center',
        zIndex: 3,
      },
      {
        id: 'pl_photo_1',
        type: 'photo',
        label: 'Student Photo',
        x: 260,
        y: 185,
        width: 280,
        height: 350,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: '#C1121F',
        borderStyle: 'dashed',
        placeholderImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        zIndex: 4,
      },
      {
        id: 'pl_rank_1',
        type: 'rank',
        label: 'Rank / Grade Badge',
        text: 'FULL A+ (10/10 GPA)',
        x: 250,
        y: 570,
        width: 300,
        height: 44,
        fontSize: 18,
        fontFamily: 'Outfit',
        fontWeight: 'bold',
        color: '#FFFFFF',
        backgroundColor: '#C1121F',
        borderRadius: 22,
        borderWidth: 0,
        align: 'center',
        zIndex: 5,
      },
      {
        id: 'pl_name_1',
        type: 'student_name',
        label: 'Student Full Name',
        text: 'ADITHYA V. NAIR',
        x: 100,
        y: 645,
        width: 600,
        height: 50,
        fontSize: 34,
        fontFamily: 'Outfit',
        fontWeight: 'bold',
        color: '#FFFFFF',
        align: 'center',
        zIndex: 6,
      },
      {
        id: 'pl_school_1',
        type: 'school',
        label: 'School / Institution Name',
        text: 'St. Joseph Higher Secondary School, Calicut',
        x: 80,
        y: 710,
        width: 640,
        height: 35,
        fontSize: 16,
        fontFamily: 'Inter',
        color: '#A3A3A3',
        align: 'center',
        zIndex: 7,
      },
      {
        id: 'pl_footer_text',
        type: 'custom_text',
        label: 'Footer SaaS Text',
        text: 'Powered by Zynexta SaaS Platform',
        x: 80,
        y: 835,
        width: 400,
        height: 25,
        fontSize: 13,
        fontFamily: 'Inter',
        color: '#737373',
        align: 'left',
        zIndex: 8,
      },
      {
        id: 'pl_qr_code',
        type: 'qr_code',
        label: 'QR Code',
        x: 650,
        y: 810,
        width: 50,
        height: 50,
        borderRadius: 8,
        placeholderImg: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://zynexta.com&color=c1121f',
        zIndex: 9,
      },
    ]
  },
  {
    id: 'tmpl_cctv_offer_2026',
    shareToken: 'cctv-camera-mega-offer',
    title: 'CCTV Camera Mega Offer Poster',
    category: 'Security & CCTV',
    width: 800,
    height: 1000,
    aspectRatio: '4:5',
    bgImage: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
    bgColor: '#0284C7',
    createdAt: '2026-07-21',
    generatedCount: 0,
    isPublic: true,
    expirationDate: '2026-12-31',
    placeholders: [
      {
        id: 'pl_offer_img',
        type: 'photo',
        label: 'Product Photo Box',
        x: 200,
        y: 150,
        width: 400,
        height: 350,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#0284C7',
        placeholderImg: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
        zIndex: 2,
      },
      {
        id: 'pl_headline',
        type: 'text',
        label: 'Main Offer Title',
        text: 'ZYNEXTA SECURITY HQ MEGA SALE',
        x: 50,
        y: 540,
        width: 700,
        height: 50,
        fontSize: 28,
        fontFamily: 'Outfit',
        fontWeight: 'bold',
        color: '#FFFFFF',
        align: 'center',
        zIndex: 3,
      },
      {
        id: 'pl_discount_badge',
        type: 'badge',
        label: 'Discount Badge',
        text: 'FLAT 40% OFF - LIMITED PERIOD',
        x: 150,
        y: 610,
        width: 500,
        height: 48,
        fontSize: 22,
        fontFamily: 'Outfit',
        fontWeight: 'bold',
        color: '#38BDF8',
        backgroundColor: 'rgba(56, 189, 248, 0.2)',
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#38BDF8',
        align: 'center',
        zIndex: 4,
      },
      {
        id: 'pl_contact_details',
        type: 'text',
        label: 'Shop Contact Phone',
        text: 'Call Us: +91 98765 43210 | www.zynexta.com',
        x: 50,
        y: 680,
        width: 700,
        height: 40,
        fontSize: 18,
        fontFamily: 'Inter',
        color: '#E0F2FE',
        align: 'center',
        zIndex: 5,
      }
    ]
  }
];

export const AppProvider = ({ children }) => {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  const [templates, setTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem('jk_poster_templates');
      return saved ? JSON.parse(saved) : INITIAL_TEMPLATES;
    } catch {
      return INITIAL_TEMPLATES;
    }
  });

  const [generatedPosters, setGeneratedPosters] = useState(() => {
    try {
      const saved = localStorage.getItem('jk_poster_generated_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toasts, setToasts] = useState([]);

  // Fetch Templates Live from MongoDB Atlas Cloud Database with Smart Local Merge
  useEffect(() => {
    const fetchCloudTemplates = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/templates`);
        if (res.ok) {
          const data = await res.json();
          const cloudList = data.templates || [];
          
          // Get local templates saved in browser storage
          let localList = [];
          try {
            const saved = localStorage.getItem('jk_poster_templates');
            localList = saved ? JSON.parse(saved) : [];
          } catch (e) {
            localList = [];
          }

          // Merge strategy: Combine cloud + local templates cleanly by unique ID
          const templateMap = new Map();
          localList.forEach(t => { if (t && t.id) templateMap.set(t.id, t); });

          cloudList.forEach(cloudTmpl => {
            if (!cloudTmpl || !cloudTmpl.id) return;
            const localTmpl = templateMap.get(cloudTmpl.id);
            if (!localTmpl) {
              templateMap.set(cloudTmpl.id, cloudTmpl);
            } else {
              const mergedPlaceholders = cloudTmpl.placeholders?.map(cloudPl => {
                const localPl = localTmpl.placeholders?.find(lp => (lp.id || lp._id) === (cloudPl.id || cloudPl._id));
                if (localPl) {
                  return {
                    ...cloudPl,
                    borderTopLeftRadius: cloudPl.borderTopLeftRadius ?? localPl.borderTopLeftRadius,
                    borderTopRightRadius: cloudPl.borderTopRightRadius ?? localPl.borderTopRightRadius,
                    borderBottomRightRadius: cloudPl.borderBottomRightRadius ?? localPl.borderBottomRightRadius,
                    borderBottomLeftRadius: cloudPl.borderBottomLeftRadius ?? localPl.borderBottomLeftRadius,
                    clipPath: cloudPl.clipPath || localPl.clipPath,
                    maskImage: cloudPl.maskImage || localPl.maskImage,
                    shape: cloudPl.shape || localPl.shape,
                  };
                }
                return cloudPl;
              });
              templateMap.set(cloudTmpl.id, {
                ...cloudTmpl,
                placeholders: mergedPlaceholders || cloudTmpl.placeholders,
              });
            }
          });

          const mergedTemplates = Array.from(templateMap.values());
          if (mergedTemplates.length > 0) {
            setTemplates(mergedTemplates);
            try {
              localStorage.setItem('jk_poster_templates', JSON.stringify(mergedTemplates));
            } catch (e) {
              console.warn('LocalStorage save info:', e);
            }
          } else {
            // Seed initial templates to MongoDB Atlas if DB is empty
            for (const tmpl of INITIAL_TEMPLATES) {
              await fetch(`${API_BASE_URL}/templates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tmpl),
              }).catch(() => {});
            }
          }
        }
      } catch (err) {
        console.warn('MongoDB Atlas live template sync info:', err.message);
      }
    };

    fetchCloudTemplates();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('jk_poster_templates', JSON.stringify(templates));
    } catch {
      // ignore
    }
  }, [templates]);

  useEffect(() => {
    try {
      localStorage.setItem('jk_poster_generated_history', JSON.stringify(generatedPosters));
    } catch {
      // ignore
    }
  }, [generatedPosters]);

  const addToast = (message, type = 'success') => {
    setToasts(prev => {
      // Deduplicate toasts so identical messages do not stack up
      if (prev.some(t => t.message === message)) {
        return prev;
      }
      const id = Date.now() + Math.random();
      setTimeout(() => {
        removeToast(id);
      }, 3500);
      return [...prev, { id, message, type }];
    });
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Template CRUD with Live MongoDB Atlas Sync
  const saveTemplate = async (templateData, options = { showToast: true }) => {
    const existingIndex = templates.findIndex(t => t.id === templateData.id);
    let baseSlug = templateData.shareToken && !templateData.shareToken.startsWith('token-')
      ? templateData.shareToken
      : generateSlug(templateData.title);

    // Guarantee 100% Unique Share Token across all templates (no collisions!)
    let uniqueSlug = baseSlug;
    const isDuplicateSlug = templates.some(t => t.id !== templateData.id && t.shareToken === uniqueSlug);
    if (isDuplicateSlug) {
      uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    let finalTmpl;

    if (existingIndex >= 0) {
      const updated = [...templates];
      finalTmpl = {
        ...templateData,
        shareToken: uniqueSlug,
        updatedAt: new Date().toISOString()
      };
      updated[existingIndex] = finalTmpl;
      setTemplates(updated);
      try {
        localStorage.setItem('jk_poster_templates', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage save templates warning:', e);
      }
      if (options?.showToast !== false) {
        addToast('Template updated successfully!');
      }
    } else {
      finalTmpl = {
        ...templateData,
        id: templateData.id || `tmpl_${Date.now()}`,
        shareToken: uniqueSlug,
        isPublic: templateData.isPublic !== undefined ? templateData.isPublic : true,
        expirationDate: templateData.expirationDate || '2026-12-31',
        createdAt: new Date().toISOString(),
        generatedCount: 0,
      };
      const newList = [finalTmpl, ...templates];
      setTemplates(newList);
      try {
        localStorage.setItem('jk_poster_templates', JSON.stringify(newList));
      } catch (e) {
        console.warn('LocalStorage save templates warning:', e);
      }
      if (options?.showToast !== false) {
        addToast('New poster template created successfully!');
      }
    }

    // Save to MongoDB Atlas Cloud Database instantly
    try {
      await fetch(`${API_BASE_URL}/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalTmpl),
      });
    } catch (err) {
      console.warn('MongoDB Atlas template save info:', err.message);
    }
    return finalTmpl;
  };

  const deleteTemplate = async (id) => {
    setTemplates(templates.filter(t => t.id !== id));
    addToast('Template deleted successfully!', 'warning');

    try {
      await fetch(`${API_BASE_URL}/templates/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('MongoDB Atlas template delete info:', err.message);
    }
  };

  const duplicateTemplate = async (id) => {
    const found = templates.find(t => t.id === id);
    if (!found) return;
    const duplicated = {
      ...found,
      id: `tmpl_${Date.now()}`,
      shareToken: generateSlug(`${found.title}-copy`),
      title: `${found.title} (Copy)`,
      createdAt: new Date().toISOString(),
      generatedCount: 0,
    };
    setTemplates([duplicated, ...templates]);
    addToast(`Template "${found.title}" duplicated successfully!`);

    try {
      await fetch(`${API_BASE_URL}/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicated),
      });
    } catch (err) {
      console.warn('MongoDB Atlas duplicate info:', err.message);
    }
  };

  // Universal Share Link Resolver (MongoDB Atlas + Local Memory)
  const getTemplateByToken = (token, strictOnly = false) => {
    if (!token) return null;

    if (token === 'sslc-topper-2026' || token === 'demo') {
      return INITIAL_TEMPLATES[0];
    }

    if (token === 'preview') {
      try {
        const sessionDraft = sessionStorage.getItem('jk_poster_preview_template');
        if (sessionDraft) return JSON.parse(sessionDraft);
        const localDraft = localStorage.getItem('jk_poster_preview_template');
        if (localDraft) return JSON.parse(localDraft);
      } catch (e) {
        console.warn('Draft preview parse error:', e);
      }
    }

    if (!templates || templates.length === 0) return null;
    
    let rawToken = token;
    try {
      rawToken = decodeURIComponent(token);
    } catch (e) {
      rawToken = token;
    }

    const cleanSearch = rawToken.toLowerCase().trim();
    const normalizedSearch = cleanSearch.replace(/[\s_-]+/g, '');

    if (!normalizedSearch) return strictOnly ? null : (templates[0] || null);

    // 1. Exact or case-insensitive match on shareToken or id FIRST
    let found = templates.find(t => 
      t && (
        (t.shareToken && t.shareToken.toLowerCase().trim() === cleanSearch) || 
        (t.id && t.id.toLowerCase().trim() === cleanSearch)
      )
    );
    if (found) return found;

    // 2. Exact Normalized match on shareToken or id (ignores hyphens/spaces)
    found = templates.find(t => {
      if (!t) return false;
      const normToken = (t.shareToken || '').toLowerCase().replace(/[\s_-]+/g, '');
      const normId = (t.id || '').toLowerCase().replace(/[\s_-]+/g, '');
      return normToken === normalizedSearch || normId === normalizedSearch;
    });
    if (found) return found;

    // 3. Match title exact normalized
    found = templates.find(t => {
      if (!t) return false;
      const normTitle = (t.title || '').toLowerCase().replace(/[\s_-]+/g, '');
      return normTitle === normalizedSearch;
    });

    if (found) return found;
    return strictOnly ? null : (templates[0] || null);
  };

  const recordPosterGeneration = async (posterData) => {
    const newEntry = {
      id: `gen_${Date.now()}`,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      ...posterData,
    };
    setGeneratedPosters(prev => [newEntry, ...prev]);

    try {
      await fetch(`${API_BASE_URL}/posters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });
    } catch (err) {
      console.warn('MongoDB Atlas poster generation log info:', err.message);
    }
  };

  return (
    <AppContext.Provider
      value={{
        categories,
        templates,
        generatedPosters,
        toasts,
        saveTemplate,
        deleteTemplate,
        duplicateTemplate,
        getTemplateByToken,
        addGeneratedPosterHistory: recordPosterGeneration,
        recordPosterGeneration,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
