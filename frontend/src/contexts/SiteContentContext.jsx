import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const SiteContentContext = createContext();

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await apiClient.get('/site-content');
        const data = res.data?.data || [];
        
        // Transform array of { key, value, type } into an object mapping key to value
        const contentMap = {};
        data.forEach(item => {
          contentMap[item.key] = item.value;
        });
        
        setContent(contentMap);
      } catch (err) {
        console.error('Failed to load site content', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const getContent = (key, fallback = '') => {
    return content[key] !== undefined ? content[key] : fallback;
  };

  return (
    <SiteContentContext.Provider value={{ content, loading, getContent }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (context === undefined) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
}
