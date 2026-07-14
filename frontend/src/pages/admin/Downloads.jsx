import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AdminFormLayout from '../../components/admin/AdminFormLayout';

export default function Downloads() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', fileUrl: '', fileType: 'PDF', category: 'FORM', isPublic: 'true' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/downloads?page=${page}&limit=${limit}`);
      setData(res.data?.data?.downloads || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) { alert('Failed to load downloads'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [page]);

  const openCreate = () => {
    setCurrentId(null);
    setFormData({ title: '', description: '', fileUrl: '', fileType: 'PDF', category: 'FORM', isPublic: 'true' });
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      title: item.title, description: item.description || '', fileUrl: item.fileUrl,
      fileType: item.fileType || 'PDF', category: item.category || 'FORM', isPublic: item.isPublic ? 'true' : 'false',
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete file?')) return;
    try { await apiClient.delete(`/downloads/${id}`); fetchData(); } catch (err) {}
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await apiClient.post('/uploads/document/downloads', fd);
      const newUrl = res.data?.data?.url;
      if (formData.fileUrl && formData.fileUrl.startsWith('/uploads')) {
        try { await apiClient.delete(`/uploads?url=${encodeURIComponent(formData.fileUrl)}`); } catch(e){}
      }
      setFormData(prev => ({ ...prev, fileUrl: newUrl }));
    } catch (err) { alert('Upload failed'); }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const payload = { ...formData, isPublic: formData.isPublic === 'true' };
      if (!payload.description) delete payload.description;
      if (!payload.fileUrl) {
        setSaveLoading(false);
        return alert("File upload is required");
      }

      if (currentId) await apiClient.patch(`/downloads/${currentId}`, payload);
      else await apiClient.post('/downloads', payload);
      setIsFormOpen(false); 
      fetchData();
    } catch (err) { 
      alert(err.response?.data?.message || 'Save failed'); 
    } finally {
      setSaveLoading(false);
    }
  };

  if (isFormOpen) {
    return (
      <AdminFormLayout
        title={currentId ? 'Edit File Details' : 'Upload New File'}
        subtitle="Manage the details of this downloadable file."
        stepName="File Info"
        onCancel={() => setIsFormOpen(false)}
        onSave={handleSave}
        loading={saveLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Document Title <span className="text-red-500">*</span></Label>
            <Input className="border-gray-300 focus-visible:ring-brand-purple" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="E.g. Exchange Program Form" />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Description</Label>
            <textarea className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-colors resize-none" rows="2" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} placeholder="Brief description of the document..." />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Category</Label>
            <select className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})}>
              <option value="FORM">Form</option>
              <option value="BROCHURE">Brochure</option>
              <option value="POLICY">Policy</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">File Type</Label>
            <select className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple" value={formData.fileType} onChange={e=>setFormData({...formData, fileType: e.target.value})}>
              <option value="PDF">PDF</option>
              <option value="DOC">DOC</option>
              <option value="IMAGE">IMAGE</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">File Upload <span className="text-red-500">*</span></Label>
            <div className="flex items-center gap-4">
              <Input type="file" accept=".pdf,.doc,.docx,image/*" className="border-gray-300 focus-visible:ring-brand-purple cursor-pointer flex-1" onChange={e => handleFileUpload(e.target.files[0])} />
              {formData.fileUrl && <span className="text-xs text-brand-purple font-medium truncate w-32">File uploaded</span>}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Visibility</Label>
            <select className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple" value={formData.isPublic} onChange={e=>setFormData({...formData, isPublic: e.target.value})}>
              <option value="true">Public (Visible)</option>
              <option value="false">Private (Hidden)</option>
            </select>
          </div>
        </div>
      </AdminFormLayout>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Downloads Management</h2>
        <Button onClick={openCreate} className="bg-brand-purple hover:bg-brand-purpleDark">Add New File</Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">File</TableHead>
              <TableHead className="font-semibold">Public</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">Loading downloads...</TableCell></TableRow> : data.map(item => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-gray-900">{item.title}</TableCell>
                  <TableCell>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-brand-purpleLight/20 text-brand-purple">
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <a href={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${item.fileUrl}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      {item.fileType}
                    </a>
                  </TableCell>
                  <TableCell>
                    {item.isPublic ? (
                      <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-medium border border-green-200">Yes</span>
                    ) : (
                      <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-md text-xs font-medium border border-gray-200">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(item)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
            ))}
            {!loading && data.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No files found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
        <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>
    </div>
  );
}
