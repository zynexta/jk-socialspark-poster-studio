/**
 * Centralized Application Public URL Utility for JK SocialSpark
 */

export const getPublicAppUrl = () => {
  const envUrl = import.meta.env.VITE_PUBLIC_APP_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // In local development environment, use window.location.origin
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return window.location.origin;
    }
  }
  return 'https://www.jksocialspark.in';
};

export const getTemplateShareUrl = (templateIdOrToken) => {
  if (!templateIdOrToken) return `${getPublicAppUrl()}/template/demo`;
  const baseUrl = getPublicAppUrl();
  const cleanToken = templateIdOrToken.toString().trim();
  return `${baseUrl}/template/${cleanToken}`;
};
