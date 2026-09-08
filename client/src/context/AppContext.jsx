import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
  { id: 'cat_sslc', name: 'SSLC / Academic', icon: 'GraduationCap', count: 0, color: 'from-blue-600 to-indigo-600' },
  { id: 'cat_security', name: 'Security & CCTV', icon: 'ShieldCheck', count: 0, color: 'from-cyan-600 to-blue-600' },
  { id: 'cat_sports', name: 'Sports & Awards', icon: 'Trophy', count: 0, color: 'from-amber-500 to-orange-600' },
  { id: 'cat_offers', name: 'Offers & Discounts', icon: 'Tag', count: 0, color: 'from-emerald-600 to-teal-600' },
  { id: 'cat_events', name: 'Events & Festivals', icon: 'Calendar', count: 0, color: 'from-purple-600 to-pink-600' },
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
        placeholderImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        zIndex: 4,
      },
      {
        id: 'pl_name_1',
        type: 'text',
        label: 'Student Full Name',
        text: 'ANANYA SANTHOSH',
        x: 100,
        y: 560,
        width: 600,
        height: 45,
        fontSize: 30,
        fontFamily: 'Outfit',
        fontWeight: 'bold',
        color: '#FFFFFF',
        align: 'center',
        zIndex: 5,
      },
      {
        id: 'pl_rank_1',
        type: 'badge',
        label: 'Rank Distinction Badge',
        text: 'FULL A+ (99.4%) - STATE RANK 1',
        x: 150,
        y: 620,
        width: 500,
        height: 44,
        fontSize: 18,
        fontFamily: 'Outfit',
        fontWeight: 'bold',
        color: '#FFFFFF',
        backgroundColor: '#C1121F',
        borderRadius: 22,
        align: 'center',
        zIndex: 6,
      },
      {
        id: 'pl_school_1',
        type: 'text',
        label: 'School & Location',
        text: 'St. Mary’s Higher Secondary School, Pala',
        x: 100,
        y: 680,
        width: 600,
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
        text: 'Powered by JK SocialSpark',
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
        placeholderImg: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://jksocialspark.com&color=c1121f',
        zIndex: 9,
      },
    ]
  }
];

export const AppProvider = ({ children }) => {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [generatedPosters, setGeneratedPosters] = useState([]);
  const [shareLinks, setShareLinks] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);

  const addToast = useCallback((message, type = 'success') => {
    setToasts(prev => {
      if (prev.some(t => t.message === message)) return prev;
      const id = Date.now() + Math.random();
      setTimeout(() => {
        removeToast(id);
      }, 3500);
      return [...prev, { id, message, type }];
    });
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // 1. Fetch Categories Live from MongoDB Atlas
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      if (res.ok) {
        const data = await res.json();
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories.map(c => ({
            ...c,
            id: c.id || c._id,
          })));
        }
      }
    } catch (err) {
      console.warn('MongoDB Atlas categories sync info:', err.message);
    }
  }, []);

  // 2. Fetch Templates Live from MongoDB Atlas
  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/templates`);
      if (res.ok) {
        const data = await res.json();
        const cloudList = data.templates || [];

        if (cloudList.length > 0) {
          setTemplates(cloudList);
          try {
            localStorage.setItem('jk_poster_templates', JSON.stringify(cloudList));
          } catch (e) {
            // ignore
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
      console.warn('MongoDB Atlas templates sync info:', err.message);
    }
  }, []);

  // 3. Fetch Generated Posters History Live from MongoDB Atlas
  const fetchGeneratedPosters = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/posters/history`);
      if (res.ok) {
        const data = await res.json();
        if (data.posters) {
          setGeneratedPosters(data.posters);
        }
      }
    } catch (err) {
      console.warn('MongoDB Atlas poster history fetch info:', err.message);
    }
  }, []);

  // 4. Fetch Share Links Live from MongoDB Atlas
  const fetchShareLinks = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/sharelinks`);
      if (res.ok) {
        const data = await res.json();
        if (data.shareLinks) {
          setShareLinks(data.shareLinks);
        }
      }
    } catch (err) {
      console.warn('MongoDB Atlas share links fetch info:', err.message);
    }
  }, []);

  // Load all live MongoDB Atlas data on mount
  useEffect(() => {
    fetchCategories();
    fetchTemplates();
    fetchGeneratedPosters();
    fetchShareLinks();
  }, [fetchCategories, fetchTemplates, fetchGeneratedPosters, fetchShareLinks]);

  // Category Actions
  const addCategory = async (name) => {
    if (!name || !name.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.category) {
        addToast(`Category "${data.category.name}" created!`);
        fetchCategories();
        return data.category;
      } else {
        addToast(data.message || 'Failed to create category', 'error');
      }
    } catch (err) {
      addToast('Network error creating category', 'error');
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        addToast('Category deleted from database!', 'warning');
        setCategories(prev => prev.filter(c => c.id !== id && c._id !== id));
        fetchCategories();
      } else {
        const data = await res.json().catch(() => ({}));
        addToast(data.message || 'Failed to delete category', 'error');
      }
    } catch (err) {
      addToast('Network error deleting category', 'error');
    }
  };

  // Template CRUD with Live MongoDB Atlas Sync
  const saveTemplate = async (templateData, options = { showToast: true }) => {
    let baseSlug = templateData.shareToken && !templateData.shareToken.startsWith('token-')
      ? templateData.shareToken
      : generateSlug(templateData.title);

    let uniqueSlug = baseSlug;
    const isDuplicateSlug = templates.some(t => t.id !== templateData.id && t.shareToken === uniqueSlug);
    if (isDuplicateSlug) {
      uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const finalTmpl = {
      ...templateData,
      id: templateData.id || `tmpl_${Date.now()}`,
      shareToken: uniqueSlug,
      isPublic: templateData.isPublic !== undefined ? templateData.isPublic : true,
      expirationDate: templateData.expirationDate || '2026-12-31',
      updatedAt: new Date().toISOString(),
    };

    // Save to MongoDB Atlas Cloud Database instantly
    try {
      const res = await fetch(`${API_BASE_URL}/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalTmpl),
      });

      if (res.ok) {
        if (options?.showToast !== false) {
          addToast('Poster template saved in MongoDB Atlas!');
        }
        fetchTemplates();
        fetchCategories();
      } else {
        const data = await res.json().catch(() => ({}));
        addToast(data.message || 'Failed to save template', 'error');
      }
    } catch (err) {
      addToast('Network error saving template', 'error');
    }
    return finalTmpl;
  };

  const deleteTemplate = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/templates/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        addToast('Template deleted successfully!', 'warning');
        setTemplates(prev => prev.filter(t => t.id !== id && t._id !== id));
        fetchTemplates();
        fetchCategories();
      } else {
        const data = await res.json().catch(() => ({}));
        addToast(data.message || 'Failed to delete template', 'error');
      }
    } catch (err) {
      addToast('Network error deleting template', 'error');
    }
  };

  const duplicateTemplate = async (id) => {
    const found = templates.find(t => t.id === id || t._id === id);
    if (!found) return;
    const duplicated = {
      ...found,
      id: `tmpl_${Date.now()}`,
      shareToken: generateSlug(`${found.title}-copy`),
      title: `${found.title} (Copy)`,
      createdAt: new Date().toISOString(),
      generatedCount: 0,
    };
    saveTemplate(duplicated);
  };

  // Share Link Action
  const createShareLink = async (linkData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/sharelinks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(linkData),
      });
      const data = await res.json();
      if (res.ok && data.shareLink) {
        fetchShareLinks();
        return data.shareLink;
      } else {
        console.warn('Share link creation error:', data.message);
      }
    } catch (err) {
      console.warn('Share link network error:', err.message);
    }
  };

  // Universal Share Link Resolver (MongoDB Atlas + Local Memory)
  const getTemplateByToken = (token, strictOnly = false) => {
    if (!token) return null;

    if (token === 'sslc-topper-2026' || token === 'demo') {
      return templates.find(t => t.shareToken === 'sslc-topper-2026') || INITIAL_TEMPLATES[0];
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

    let found = templates.find(t => 
      t && (
        (t.shareToken && t.shareToken.toLowerCase().trim() === cleanSearch) || 
        (t.id && t.id.toLowerCase().trim() === cleanSearch)
      )
    );
    if (found) return found;

    found = templates.find(t => {
      if (!t) return false;
      const normToken = (t.shareToken || '').toLowerCase().replace(/[\s_-]+/g, '');
      const normId = (t.id || '').toLowerCase().replace(/[\s_-]+/g, '');
      return normToken === normalizedSearch || normId === normalizedSearch;
    });
    if (found) return found;

    found = templates.find(t => {
      if (!t) return false;
      const normTitle = (t.title || '').toLowerCase().replace(/[\s_-]+/g, '');
      return normTitle === normalizedSearch;
    });

    if (found) return found;
    return strictOnly ? null : (templates[0] || null);
  };

  // Record Poster Generation in MongoDB Atlas
  const recordPosterGeneration = async (posterData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/posters/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(posterData),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.poster) {
          setGeneratedPosters(prev => [data.poster, ...prev]);
        }
        fetchGeneratedPosters();
        fetchTemplates();
      } else {
        const errData = await res.json().catch(() => ({}));
        addToast(errData.message || 'Failed to record poster generation in database', 'error');
      }
    } catch (err) {
      console.warn('MongoDB Atlas poster generation log info:', err.message);
      addToast('Network warning while logging poster generation', 'error');
    }
  };

  return (
    <AppContext.Provider
      value={{
        categories,
        templates,
        generatedPosters,
        shareLinks,
        toasts,
        loading,
        fetchCategories,
        fetchTemplates,
        fetchGeneratedPosters,
        fetchShareLinks,
        addCategory,
        deleteCategory,
        saveTemplate,
        deleteTemplate,
        duplicateTemplate,
        createShareLink,
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
