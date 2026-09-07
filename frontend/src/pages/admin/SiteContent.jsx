import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

// Helper to format key 'home.hero.title' -> 'Hero Title'
const formatKeyName = (key) => {
  const parts = key.split('.');
  if (parts.length > 1) {
    parts.shift(); // Remove the group name prefix
  }
  return parts.join(' ')
    .split(/[-_]/)
    .join(' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

export default function SiteContent() {
  const [contentFields, setContentFields] = useState([]);
  const [originalFields, setOriginalFields] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [activeTab, setActiveTab] = useState('');
  const [orphanedImages, setOrphanedImages] = useState([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const res = await apiClient.get('/site-content');
      const data = res.data?.data || [];
      setContentFields(data);
      
      const orig = {};
      data.forEach(item => {
        orig[item.key] = item.value;
      });
      setOriginalFields(orig);

      // Set active tab to the first group if none is selected
      const firstGroup = data[0]?.key.split('.')[0] || 'other';
      setActiveTab(firstGroup);
    } catch (err) {
      setError('Failed to load site content.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (key, newValue) => {
    setContentFields(prev => prev.map(item => 
      item.key === key ? { ...item, value: newValue } : item
    ));
    setSuccess(false);
  };

  const handleImageUpload = async (key, file, oldValue) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await apiClient.post('/uploads/image/site-content', formData);
      const newUrl = res.data?.data?.url;
      
      if (newUrl) {
        handleValueChange(key, newUrl);
        if (oldValue && oldValue.startsWith('/uploads')) {
          setOrphanedImages(prev => [...prev, oldValue]);
        }
      }
    } catch (err) {
      console.error('Image upload failed', err);
      alert('Failed to upload image. Max 5MB, JPEG/PNG/WEBP/GIF only.');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updates = contentFields.filter(item => item.value !== originalFields[item.key]).map(item => ({
        key: item.key,
        value: item.value
      }));

      if (updates.length === 0) {
        setSuccess(true);
        setSaving(false);
        return;
      }

      await apiClient.patch('/site-content/bulk', { updates });

      for (const oldUrl of orphanedImages) {
        try {
          await apiClient.delete(`/uploads?url=${encodeURIComponent(oldUrl)}`);
        } catch (e) {
          console.error(`Failed to cleanup old image ${oldUrl}`, e);
        }
      }
      setOrphanedImages([]);
      
      const newOrig = { ...originalFields };
      updates.forEach(u => { newOrig[u.key] = u.value; });
      setOriginalFields(newOrig);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save changes.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const groupedFields = contentFields.reduce((acc, item) => {
    const prefix = item.key.split('.')[0] || 'other';
    if (!acc[prefix]) acc[prefix] = [];
    acc[prefix].push(item);
    return acc;
  }, {});

  const hasChanges = contentFields.some(item => item.value !== originalFields[item.key]);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-500">
      <div className="animate-pulse flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-300 rounded-full" />
        <div className="w-4 h-4 bg-gray-300 rounded-full animation-delay-200" />
        <div className="w-4 h-4 bg-gray-300 rounded-full animation-delay-400" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 relative">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Site Content</h2>
        <p className="text-muted-foreground mt-2">
          Manage static text, numbers, and images across the website. Grouped by page section.
        </p>
      </div>

      {error && <div className="text-red-600 font-medium bg-red-50 p-4 rounded-md border border-red-200">{error}</div>}
      {success && <div className="text-green-700 font-medium bg-green-50 p-4 rounded-md border border-green-200 transition-opacity">Changes saved successfully!</div>}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Vertical Tabs Sidebar */}
        <div className="w-full md:w-56 shrink-0 flex flex-col space-y-1">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Sections</div>
          {Object.keys(groupedFields).map(group => (
            <button
              key={group}
              onClick={() => setActiveTab(group)}
              className={`text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === group 
                  ? 'bg-brand-purple text-white shadow-md' 
                  : 'text-gray-600 hover:bg-brand-purpleLight/40 hover:text-brand-purpleDark'
              }`}
            >
              <span className="capitalize">{group}</span>
            </button>
          ))}
        </div>

        {/* Fields Area */}
        <div className="flex-1 max-w-4xl">
          {activeTab && groupedFields[activeTab] && (
            <div className="bg-white rounded-xl border shadow-sm p-6 md:p-8 space-y-8">
              <div className="border-b pb-4 mb-6">
                <h3 className="text-2xl font-bold capitalize text-brand-purpleDark">{activeTab} Settings</h3>
                <p className="text-sm text-gray-500 mt-1">Update the content shown in the {activeTab} section of the website.</p>
              </div>
              
              {groupedFields[activeTab].map((field) => (
                <div key={field.key} className="space-y-3 bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <Label className="text-base font-semibold text-gray-800">{formatKeyName(field.key)}</Label>
                      <p className="text-[11px] text-gray-400 font-mono mt-0.5">{field.key}</p>
                    </div>
                  </div>
                  
                  {field.type === 'TEXT' && (
                    <Input 
                      className="bg-white"
                      value={field.value || ''} 
                      onChange={(e) => handleValueChange(field.key, e.target.value)} 
                    />
                  )}

                  {field.type === 'NUMBER' && (
                    <Input 
                      type="number"
                      className="bg-white w-32"
                      value={field.value || ''} 
                      onChange={(e) => handleValueChange(field.key, e.target.value)} 
                    />
                  )}

                  {field.type === 'RICH_TEXT' && (
                    <div>
                      <textarea 
                        className="w-full min-h-[150px] p-3 border rounded-md focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all bg-white text-sm"
                        value={field.value || ''}
                        onChange={(e) => handleValueChange(field.key, e.target.value)}
                        placeholder="Enter text here..."
                      />
                      <p className="text-xs text-gray-400 mt-1">Use double newlines to separate paragraphs.</p>
                    </div>
                  )}

                  {field.type === 'IMAGE' && (
                    <div className="flex items-start gap-6 bg-white p-4 rounded border">
                      {field.value ? (
                        <img 
                          src={field.value.startsWith('http') ? field.value : `${apiClient.defaults.baseURL.replace('/api/v1', '')}${field.value}`} 
                          alt={field.key} 
                          className="w-32 h-32 object-cover border rounded-md bg-gray-100 shadow-sm"
                          onError={(e) => { e.target.src = 'https://placehold.co/400?text=Not+Found' }}
                        />
                      ) : (
                        <div className="w-32 h-32 border rounded-md bg-gray-50 flex items-center justify-center text-xs text-gray-400 text-center p-2">
                          No Image Uploaded
                        </div>
                      )}
                      <div className="space-y-2 flex-1">
                        <Label className="text-sm">Upload New Image</Label>
                        <Input 
                          type="file" 
                          accept="image/*"
                          className="cursor-pointer"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageUpload(field.key, e.target.files[0], field.value);
                            }
                          }}
                        />
                        <p className="text-xs text-gray-400 mt-2 break-all">Path: {field.value || 'None'}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Save Bar */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 md:right-12 z-50 bg-white border shadow-2xl rounded-xl px-6 py-4 flex items-center gap-6 animate-in slide-in-from-bottom-5">
          <span className="font-medium text-amber-600 flex items-center gap-2">
             <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
             Unsaved changes
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={fetchContent} disabled={saving} className="text-gray-500 hover:text-gray-900 hover:bg-gray-100">
              Discard
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-brand-purple hover:bg-brand-purpleDark shadow-md px-6 text-white">
              {saving ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
