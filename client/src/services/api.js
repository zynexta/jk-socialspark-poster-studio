/**
 * Centralized API Service for JK SocialSpark
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Generic fetch wrapper with automatic JWT header injection & JSON handling
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('jk_poster_token') || localStorage.getItem('jk_auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'API request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const apiService = {
  // Healthcheck
  checkHealth: () => request('/health'),

  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => request('/auth/me'),

  // Templates
  getTemplates: () => request('/templates'),
  getTemplateByToken: (token) => request(`/templates/share/${token}`),
  createTemplate: (templateData) => request('/templates', { method: 'POST', body: JSON.stringify(templateData) }),
  deleteTemplate: (id) => request(`/templates/${id}`, { method: 'DELETE' }),

  // Posters
  generatePoster: (posterData) => request('/posters/generate', { method: 'POST', body: JSON.stringify(posterData) }),
  getPosterHistory: () => request('/posters/history'),

  // Categories
  getCategories: () => request('/categories'),
  createCategory: (categoryData) => request('/categories', { method: 'POST', body: JSON.stringify(categoryData) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),

  // Share Links
  getShareLinks: () => request('/sharelinks'),
  createShareLink: (linkData) => request('/sharelinks', { method: 'POST', body: JSON.stringify(linkData) }),

  // Analytics
  getAnalytics: () => request('/analytics'),

  // Upload (Cloudinary / Storage)
  uploadImage: (imageData, folder = 'jk-socialspark/templates') =>
    request('/uploads', { method: 'POST', body: JSON.stringify({ image: imageData, folder }) }),
};

export default apiService;
