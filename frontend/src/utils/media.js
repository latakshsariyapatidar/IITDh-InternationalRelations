import apiClient from '../api/client';

export const resolveMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const backendOrigin = (apiClient.defaults?.baseURL || '').replace('/api/v1', '');
  return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const resolveLogoUrl = resolveMediaUrl;
