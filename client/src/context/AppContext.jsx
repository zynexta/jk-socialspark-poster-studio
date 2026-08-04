import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

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
    bgImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    bgColor: '#0F172A',
    createdAt: '2026-07-20',
    generatedCount: 0,
    placeholders: [
      {
        id: 'pl_photo_1',
        type: 'photo',
        label: 'Student Photo',
        x: 250,
        y: 180,
        width: 300,
        height: 380,
        borderRadius: 24,
        borderWidth: 4,
        borderColor: '#38BDF8',
        placeholderImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        zIndex: 2,
      },
      {
        id: 'pl_name_1',
        type: 'text',
        label: 'Student Full Name',
        text: 'ADITHYA V. NAIR',
        x: 100,
        y: 600,
        width: 600,
        height: 50,
        fontSize: 32,
        fontFamily: 'Outfit',
        fontWeight: 'bold',
        color: '#FFFFFF',
        align: 'center',
        zIndex: 3,
      },
      {
        id: 'pl_rank_1',
        type: 'badge',
        label: 'Rank / Grade Badge',
        text: 'FULL A+ (10/10 GPA)',
        x: 200,
        y: 670,
        width: 400,
        height: 44,
        fontSize: 20,
        fontFamily: 'Outfit',
        fontWeight: 'bold',
        color: '#FACC15',
        backgroundColor: 'rgba(250, 204, 21, 0.15)',
        borderRadius: 22,
        borderWidth: 2,
        borderColor: '#FACC15',
        align: 'center',
        zIndex: 4,
      },
      {
        id: 'pl_school_1',
        type: 'text',
        label: 'School / Institution Name',
        text: 'St. Joseph Higher Secondary School, Calicut',
        x: 80,
        y: 740,
        width: 640,
        height: 40,
        fontSize: 18,
        fontFamily: 'Inter',
        color: '#94A3B8',
        align: 'center',
        zIndex: 5,
      },
      {
        id: 'pl_qr_1',
        type: 'qr_code',
        label: 'Verification QR Code',
        x: 650,
        y: 830,
        width: 100,
        height: 100,
        placeholderImg: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://zynexta.com/verify/topper-2026',
        zIndex: 6,
      }
    ]
  },
  {
    id: 'tmpl_cctv_offer_2026',
    shareToken: 'cctv-mega-offer',
    title: 'CCTV Security Festival Offer',
    category: 'Security & CCTV',
    width: 800,
    height: 1000,
    aspectRatio: '4:5',
    bgImage: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
    bgColor: '#0284C7',
    createdAt: '2026-07-22',
    generatedCount: 0,
    placeholders: [
      {
        id: 'pl_cctv_title',
        type: 'text',
        label: 'Offer Headline',
        text: 'ZYNEXTA SECURITY MEGA OFFER',
        x: 100,
        y: 120,
        width: 600,
        height: 60,
        fontSize: 36,
        fontFamily: 'Outfit',
        fontWeight: 'bold',
        color: '#FFFFFF',
        align: 'center',
        zIndex: 2,
      },
      {
        id: 'pl_cctv_desc',
        type: 'text',
        label: 'Offer Details',
        text: 'Get 4 MP HD Cameras + 8 Channel DVR + Installation at 40% Off!',
        x: 100,
        y: 720,
        width: 600,
        height: 80,
        fontSize: 20,
        fontFamily: 'Inter',
        color: '#E0F2FE',
        align: 'center',
        zIndex: 3,
      }
    ]
  }
];

const INITIAL_GENERATED_POSTERS = [
  {
    id: 'post_1',
    templateTitle: 'SSLC State Topper 2026 Poster',
    customerName: 'Adithya V. Nair',
    generatedBy: 'Kochi Print Hub',
    date: '2026-07-26 14:30',
    downloads: 3,
    previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'post_2',
    templateTitle: 'CCTV Security Festival Offer',
    customerName: 'Zynexta Security HQ',
    generatedBy: 'Calicut Digital Press',
    date: '2026-07-26 12:15',
    downloads: 5,
    previewUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=300&q=80',
  }
];

export function AppProvider({ children }) {
  const [templates, setTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem('jk_templates');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(t => {
          if (t.generatedCount === 142 || t.generatedCount === 89) {
            return { ...t, generatedCount: 0 };
          }
          return t;
        });
      }
      return INITIAL_TEMPLATES;
    } catch {
      return INITIAL_TEMPLATES;
    }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('jk_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [generatedPosters, setGeneratedPosters] = useState(() => {
    try {
      const saved = localStorage.getItem('jk_generated_posters');
      return saved ? JSON.parse(saved) : INITIAL_GENERATED_POSTERS;
    } catch {
      return INITIAL_GENERATED_POSTERS;
    }
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem('jk_templates', JSON.stringify(templates));
    } catch (e) {
      console.warn('localStorage save failed for templates', e);
    }
  }, [templates]);

  useEffect(() => {
    try {
      localStorage.setItem('jk_categories', JSON.stringify(categories));
    } catch (e) {
      console.warn('localStorage save failed for categories', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      // Clean preview URLs if base64 data strings are too large for localStorage quota
      const safePosters = generatedPosters.slice(0, 15).map(p => ({
        ...p,
        previewUrl: p.previewUrl && p.previewUrl.startsWith('data:') && p.previewUrl.length > 5000 ? '' : p.previewUrl
      }));
      localStorage.setItem('jk_generated_posters', JSON.stringify(safePosters));
    } catch (e) {
      console.warn('localStorage quota handling for generated posters:', e);
    }
  }, [generatedPosters]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Template CRUD
  const saveTemplate = (templateData) => {
    const existingIndex = templates.findIndex(t => t.id === templateData.id);
    const slug = templateData.shareToken && !templateData.shareToken.startsWith('token-')
      ? templateData.shareToken
      : generateSlug(templateData.title);

    if (existingIndex >= 0) {
      const updated = [...templates];
      updated[existingIndex] = {
        ...templateData,
        shareToken: slug,
        updatedAt: new Date().toISOString()
      };
      setTemplates(updated);
      addToast('Template updated successfully!');
    } else {
      const newTmpl = {
        ...templateData,
        id: templateData.id || `tmpl_${Date.now()}`,
        shareToken: slug,
        isPublic: templateData.isPublic !== undefined ? templateData.isPublic : true,
        expirationDate: templateData.expirationDate || '2026-12-31',
        createdAt: new Date().toISOString(),
        generatedCount: 0,
      };
      setTemplates([newTmpl, ...templates]);
      addToast('New poster template created successfully!');
    }
  };

  const deleteTemplate = (id) => {
    setTemplates(templates.filter(t => t.id !== id));
    addToast('Template deleted successfully!', 'warning');
  };

  const duplicateTemplate = (id) => {
    const found = templates.find(t => t.id === id);
    if (!found) return;
    const duplicated = {
      ...found,
      id: `tmpl_${Date.now()}`,
      shareToken: `token-${Math.random().toString(36).substring(2, 9)}`,
      title: `${found.title} (Copy)`,
      createdAt: new Date().toISOString(),
      generatedCount: 0,
    };
    setTemplates([duplicated, ...templates]);
    addToast(`Template "${found.title}" duplicated successfully!`);
  };

  // Share system (supports exact slug, case-insensitive, title slug, and fallback matches)
  const getTemplateByToken = (token) => {
    if (!token) return null;
    const search = token.toLowerCase().trim();

    // 1. Exact or case-insensitive match on shareToken or id
    let found = templates.find(t => 
      t && (
        (t.shareToken && t.shareToken.toLowerCase() === search) || 
        (t.id && t.id.toLowerCase() === search)
      )
    );
    if (found) return found;

    // 2. Title slug match (e.g. 'sslc-state-topper-2026-poster')
    found = templates.find(t => t && generateSlug(t.title).toLowerCase() === search);
    if (found) return found;

    // 3. Fallback partial/prefix match (e.g. 'sslc' matches 'sslc-topper-2026' or 'sslc-10')
    found = templates.find(t => 
      t && (
        (t.shareToken && (t.shareToken.toLowerCase().startsWith(search) || search.startsWith(t.shareToken.toLowerCase()))) ||
        (t.id && t.id.toLowerCase().includes(search))
      )
    );

    return found || null;
  };

  // Record generation
  const recordPosterGeneration = (posterInfo) => {
    const newPoster = {
      id: `post_${Date.now()}`,
      date: new Date().toLocaleString(),
      downloads: 1,
      ...posterInfo,
      // Clean large base64 strings to prevent QuotaExceededError in localStorage
      previewUrl: posterInfo.previewUrl && posterInfo.previewUrl.startsWith('data:') && posterInfo.previewUrl.length > 50000 
        ? '' 
        : posterInfo.previewUrl
    };
    setGeneratedPosters(prev => [newPoster, ...prev.slice(0, 15)]);
    
    // update count on template
    setTemplates(prev => prev.map(t => {
      if (t.id === posterInfo.templateId) {
        return { ...t, generatedCount: (t.generatedCount || 0) + 1 };
      }
      return t;
    }));

    addToast('Poster generated successfully! High-res ready.');
    return newPoster;
  };

  const addCategory = (name, icon = 'Tag') => {
    const id = `cat_${name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now()}`;
    const newCat = {
      id,
      name,
      icon,
      count: 0,
      color: 'from-blue-600 to-indigo-600'
    };
    setCategories([...categories, newCat]);
    addToast(`Category "${name}" added`);
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id));
    addToast('Category deleted', 'warning');
  };

  return (
    <AppContext.Provider
      value={{
        templates,
        categories,
        generatedPosters,
        toasts,
        addToast,
        removeToast,
        saveTemplate,
        deleteTemplate,
        duplicateTemplate,
        getTemplateByToken,
        recordPosterGeneration,
        addCategory,
        deleteCategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
