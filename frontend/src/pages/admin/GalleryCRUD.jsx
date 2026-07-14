import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AdminFormLayout from '../../components/admin/AdminFormLayout';

export default function GalleryCRUD() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', imageUrl: '', caption: '', category: 'CAMPUS', takenAt: '', isPublic: 'true' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/gallery?page=${page}&limit=${limit}`);
      setData(res.data?.data?.images || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) { alert('Failed to load gallery'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [page]);

  const openCreate = () => {
    setCurrentId(null);
    setFormData({ title: '', imageUrl: '', caption: '', category: 'CAMPUS', takenAt: '', isPublic: 'true' });
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      title: item.title, imageUrl: item.imageUrl, caption: item.caption || '',
      category: item.category || 'CAMPUS', takenAt: item.takenAt ? item.takenAt.split('T')[0] : '', isPublic: item.isPublic ? 'true' : 'false',
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete image?')) return;
    try { await apiClient.delete(`/gallery/${id}`); fetchData(); } catch (err) {}
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await apiClient.post('/uploads/image/gallery', fd);
      const newUrl = res.data?.data?.url;
      if (formData.imageUrl && formData.imageUrl.startsWith('/uploads')) {
        try { await apiClient.delete(`/uploads?url=${encodeURIComponent(formData.imageUrl)}`); } catch(e){}
      }
      setFormData(prev => ({ ...prev, imageUrl: newUrl }));
    } catch (err) { alert('Upload failed'); }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const payload = { ...formData, isPublic: formData.isPublic === 'true' };
      if (!payload.caption) delete payload.caption;
      if (!payload.takenAt) delete payload.takenAt;
      else payload.takenAt = new Date(payload.takenAt).toISOString();
      if (!payload.imageUrl) {
        setSaveLoading(false);
        return alert("Image URL is required");
      }

      if (currentId) await apiClient.patch(`/gallery/${currentId}`, payload);
      else await apiClient.post('/gallery', payload);
      setIsFormOpen(false); fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Save failed'); } finally { setSaveLoading(false); }
  };

  if (isFormOpen) {
    return (
      <AdminFormLayout
        title={currentId ? 'Edit Image Details' : 'Upload New Image'}
        subtitle="Manage the details of this gallery image."
        stepName="Image Info"
        onCancel={() => setIsFormOpen(false)}
        onSave={handleSave}
        loading={saveLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Image Title <span className="text-red-500">*</span></Label>
            <Input className="border-gray-300 focus-visible:ring-brand-purple" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="E.g. Main Building" />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Category</Label>
            <select className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})}>
              <option value="CAMPUS">Campus</option>
              <option value="EVENTS">Events</option>
              <option value="STUDENT_LIFE">Student Life</option>
              <option value="COLLABORATIONS">Collaborations</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Visibility</Label>
            <select className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple" value={formData.isPublic} onChange={e=>setFormData({...formData, isPublic: e.target.value})}>
              <option value="true">Public (Visible)</option>
              <option value="false">Private (Hidden)</option>
            </select>
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Caption</Label>
            <textarea className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-colors resize-none" rows="2" value={formData.caption} onChange={e=>setFormData({...formData, caption: e.target.value})} placeholder="Optional description..." />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Image File <span className="text-red-500">*</span></Label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <Input type="file" accept="image/*" className="border-gray-300 focus-visible:ring-brand-purple cursor-pointer" onChange={e => handleImageUpload(e.target.files[0])} />
              </div>
              {formData.imageUrl && (
                <div className="shrink-0 w-32 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                  <img src={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${formData.imageUrl}`} className="w-full h-full object-cover" alt="Preview"/>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Date Taken</Label>
            <Input type="date" className="border-gray-300 focus-visible:ring-brand-purple" value={formData.takenAt} onChange={e=>setFormData({...formData, takenAt: e.target.value})} />
          </div>
        </div>
      </AdminFormLayout>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gallery Management</h2>
        <Button onClick={openCreate} className="bg-brand-purple hover:bg-brand-purpleDark">Add New Image</Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Image</TableHead>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Public</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">Loading gallery...</TableCell></TableRow> : data.map(item => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="w-16 h-12 rounded overflow-hidden border border-gray-200">
                      <img src={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${item.imageUrl}`} className="w-full h-full object-cover" alt="" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{item.title}</TableCell>
                  <TableCell>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-brand-purpleLight/20 text-brand-purple">
                      {item.category}
                    </span>
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
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No images found.</TableCell></TableRow>
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
