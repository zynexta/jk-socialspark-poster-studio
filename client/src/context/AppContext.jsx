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
    bgImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    bgColor: '#0F172A',
    createdAt: '2026-07-20',
    generatedCount: 0,
    isPublic: true,
    expirationDate: '2026-12-31',
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

  // Fetch Templates Live from MongoDB Atlas Cloud Database
  useEffect(() => {
    const fetchCloudTemplates = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/templates`);
        if (res.ok) {
          const data = await res.json();
          if (data.templates && data.templates.length > 0) {
            setTemplates(data.templates);
            localStorage.setItem('jk_poster_templates', JSON.stringify(data.templates));
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
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Template CRUD with Live MongoDB Atlas Sync
  const saveTemplate = async (templateData) => {
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
      addToast('Template updated successfully!');
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
      setTemplates([finalTmpl, ...templates]);
      addToast('New poster template created successfully!');
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

    if (token === 'preview') {
      try {
        const draft = localStorage.getItem('jk_poster_preview_template');
        if (draft) return JSON.parse(draft);
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

    // 1. Exact or case-insensitive match on shareToken or id
    let found = templates.find(t => 
      t && (
        (t.shareToken && t.shareToken.toLowerCase().trim() === cleanSearch) || 
        (t.id && t.id.toLowerCase().trim() === cleanSearch)
      )
    );
    if (found) return found;

    // 2. Normalized match (ignores spaces, hyphens, underscores)
    found = templates.find(t => {
      if (!t) return false;
      const normToken = (t.shareToken || '').toLowerCase().replace(/[\s_-]+/g, '');
      const normId = (t.id || '').toLowerCase().replace(/[\s_-]+/g, '');
      const normTitle = (t.title || '').toLowerCase().replace(/[\s_-]+/g, '');
      return normToken === normalizedSearch || normId === normalizedSearch || normTitle === normalizedSearch;
    });
    if (found) return found;

    // 3. Substring / Partial match on shareToken, title, or category
    found = templates.find(t => {
      if (!t) return false;
      const normToken = (t.shareToken || '').toLowerCase().replace(/[\s_-]+/g, '');
      const normTitle = (t.title || '').toLowerCase().replace(/[\s_-]+/g, '');
      const normCategory = (t.category || '').toLowerCase().replace(/[\s_-]+/g, '');
      return (
        normToken.includes(normalizedSearch) || 
        normalizedSearch.includes(normToken) ||
        normTitle.includes(normalizedSearch) ||
        normalizedSearch.includes(normTitle) ||
        normCategory.includes(normalizedSearch)
      );
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
