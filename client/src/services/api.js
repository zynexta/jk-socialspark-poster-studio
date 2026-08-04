/**
 * Centralized API Service for JK Smart Poster Generator
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Generic fetch wrapper with automatic JWT header injection & JSON handling
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('jk_auth_token');
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

  // Posters
  generatePoster: (posterData) => request('/posters/generate', { method: 'POST', body: JSON.stringify(posterData) }),
  getPosterHistory: () => request('/posters/history'),

  // Categories
  getCategories: () => request('/categories'),

  // Upload (Cloudinary / Storage)
  uploadImage: (imageData, folder = 'jk-posters') =>
    request('/upload', { method: 'POST', body: JSON.stringify({ image: imageData, folder }) }),
};

export default apiService;
