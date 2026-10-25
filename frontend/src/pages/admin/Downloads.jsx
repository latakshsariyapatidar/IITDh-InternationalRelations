import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AdminFormLayout from '../../components/admin/AdminFormLayout';
import { optionalText } from '../../utils/formPayload';
import { formatApiError } from '../../utils/formErrors';
import { RiFilter3Line } from '@remixicon/react';

// 5.35 Backend accepted categories
const CATEGORIES = [
  { value: 'ADMISSION_FORM', label: 'Admission Form' },
  { value: 'VISA_GUIDE', label: 'Visa Guide' },
  { value: 'MOU_DOCUMENT', label: 'MOU Document' },
  { value: 'BROCHURE', label: 'Brochure' },
  { value: 'OTHER', label: 'Other' },
];

export default function Downloads() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  // 5.48 Category list filter
  const [categoryFilter, setCategoryFilter] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [savedFileUrl, setSavedFileUrl] = useState('');

  // 5.35 & 5.36: Default category ADMISSION_FORM, fileType PDF
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileUrl: '',
    fileType: 'PDF',
    category: 'ADMISSION_FORM',
    isPublic: 'true',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        ...(categoryFilter ? { category: categoryFilter } : {}),
      };
      const res = await apiClient.get('/downloads', { params });
      setData(res.data?.data?.downloads || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      alert('Failed to load downloads: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, categoryFilter]);

  // 1.6 Helper to clean up newly uploaded file if form is cancelled
  const discardUnsavedFile = async (url) => {
    if (!url || url === savedFileUrl || !url.startsWith('/uploads')) return;
    try {
      await apiClient.delete(`/uploads?url=${encodeURIComponent(url)}`);
    } catch (err) {
      console.warn('Failed to delete unsaved download file', err);
    }
  };

  const openCreate = () => {
    setCurrentId(null);
    setSavedFileUrl('');
    setFormData({
      title: '',
      description: '',
      fileUrl: '',
      fileType: 'PDF',
      category: 'ADMISSION_FORM',
      isPublic: 'true',
    });
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setSavedFileUrl(item.fileUrl || '');
    setFormData({
      title: item.title || '',
      description: item.description || '',
      fileUrl: item.fileUrl || '',
      fileType: 'PDF',
      category: item.category || 'ADMISSION_FORM',
      isPublic: item.isPublic !== false ? 'true' : 'false',
    });
    setIsFormOpen(true);
  };

  // 1.4: Catch error on delete and alert message
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await apiClient.delete(`/downloads/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete download document');
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await apiClient.post('/uploads/document/downloads', fd);
      const newUrl = res.data?.data?.url;
      await discardUnsavedFile(formData.fileUrl);
      setFormData(prev => ({ ...prev, fileUrl: newUrl }));
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCancel = async () => {
    await discardUnsavedFile(formData.fileUrl);
    setIsFormOpen(false);
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      // 1.7: Clear optional description if empty ("" on an edit; the backend
      // rejects null here)
      const payload = {
        title: formData.title.trim(),
        description: optionalText(formData.description, Boolean(currentId)),
        fileUrl: formData.fileUrl,
        fileType: 'PDF',
        category: formData.category,
        isPublic: formData.isPublic === 'true',
      };

      if (!payload.fileUrl) {
        setSaveLoading(false);
        return alert("File upload is required");
      }

      if (currentId) {
        await apiClient.patch(`/downloads/${currentId}`, payload);
      } else {
        await apiClient.post('/downloads', payload);
      }

      // 1.6: Only delete old file after save succeeds
      if (savedFileUrl && savedFileUrl !== formData.fileUrl && savedFileUrl.startsWith('/uploads')) {
        try {
          await apiClient.delete(`/uploads?url=${encodeURIComponent(savedFileUrl)}`);
        } catch (e) {
          console.warn('Failed to cleanup old file', e);
        }
      }

      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      alert(formatApiError(err, 'Save failed'));
    } finally {
      setSaveLoading(false);
    }
  };

  if (isFormOpen) {
    return (
      <AdminFormLayout
        title={currentId ? 'Edit File Details' : 'Upload New File'}
        subtitle="Manage the details of this downloadable PDF resource."
        stepName="File Info"
        onCancel={handleCancel}
        onSave={handleSave}
        loading={saveLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Document Title <span className="text-red-500">*</span></Label>
            <Input 
              className="border-gray-300 focus-visible:ring-brand-purple" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="E.g. International Student Visa Guide" 
              required
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Description</Label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-colors resize-none text-sm" 
              rows="2" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              placeholder="Brief description of the document..." 
            />
          </div>

          {/* 5.35 Correct category options */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Category <span className="text-red-500">*</span></Label>
            <select 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple" 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          
          {/* 5.36 PDF uploads only */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">File Type</Label>
            <Input value="PDF Document (.pdf)" disabled className="bg-gray-50 border-gray-300 text-gray-500" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">PDF File Upload <span className="text-red-500">*</span></Label>
            <div className="flex items-center gap-4">
              <Input 
                type="file" 
                accept="application/pdf" 
                className="border-gray-300 focus-visible:ring-brand-purple cursor-pointer flex-1" 
                onChange={e => handleFileUpload(e.target.files[0])} 
              />
              {formData.fileUrl && (
                <span className="text-xs text-brand-purple font-semibold bg-purple-50 border border-purple-200 px-3 py-2 rounded-lg truncate max-w-xs">
                  ✓ PDF attached
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-400">Accepts PDF documents up to 50 MB.</p>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Visibility</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple" 
              value={formData.isPublic} 
              onChange={e => setFormData({...formData, isPublic: e.target.value})}
            >
              <option value="true">Public (Visible on Downloads page)</option>
              <option value="false">Private (Hidden)</option>
            </select>
          </div>
        </div>
      </AdminFormLayout>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Downloads & Resources Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage downloadable forms, guides, brochures, and bilateral kits.</p>
        </div>
        <Button onClick={openCreate} className="bg-brand-purple hover:bg-brand-purpleDark cursor-pointer self-start sm:self-auto">
          Upload New File
        </Button>
      </div>

      {/* 5.48 Category list filter */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-gray-500 font-semibold uppercase text-xs">
          <RiFilter3Line size={16} /> Filter by Category:
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs bg-white text-gray-700 focus:ring-2 focus:ring-brand-purple"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        {categoryFilter && (
          <button
            onClick={() => { setCategoryFilter(''); setPage(1); }}
            className="text-xs text-brand-purple hover:underline font-semibold ml-auto cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      <div className="bg-white border rounded-xl shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Document Title</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Visibility</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">Loading downloads...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No downloadable files found.</TableCell></TableRow>
            ) : (
              data.map(item => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-gray-900 max-w-sm truncate">{item.title}</TableCell>
                  <TableCell>
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-brand-purpleLight/20 text-brand-purple">
                      {CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 font-mono">PDF</TableCell>
                  <TableCell>
                    {item.isPublic ? (
                      <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-xs font-semibold border border-green-200">Public</span>
                    ) : (
                      <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium border border-gray-200">Hidden</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(item)} className="cursor-pointer">Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} className="cursor-pointer">Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="cursor-pointer">Previous</Button>
        <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="cursor-pointer">Next</Button>
      </div>
    </div>
  );
}
