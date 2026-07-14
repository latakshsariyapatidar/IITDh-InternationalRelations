import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AdminFormLayout from '../../components/admin/AdminFormLayout';

export default function Events() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', startDate: '', endDate: '', location: '', imageUrl: '', type: 'OTHER', isPublic: 'true' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/events?page=${page}&limit=${limit}`);
      setData(res.data?.data?.events || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) { alert('Failed to load events: ' + (err.response?.data?.message || err.message)); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [page]);

  const openCreate = () => {
    setCurrentId(null);
    setFormData({ title: '', description: '', startDate: '', endDate: '', location: '', imageUrl: '', type: 'OTHER', isPublic: 'true' });
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      title: item.title, description: item.description, 
      startDate: item.startDate ? item.startDate.split('T')[0] : '', 
      endDate: item.endDate ? item.endDate.split('T')[0] : '', 
      location: item.location || '', imageUrl: item.imageUrl || '', 
      type: item.type || 'OTHER', isPublic: item.isPublic ? 'true' : 'false',
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete event?')) return;
    try { await apiClient.delete(`/events/${id}`); fetchData(); } catch (err) {}
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await apiClient.post('/uploads/image/events', fd);
      const newUrl = res.data?.data?.url;
      if (formData.imageUrl && formData.imageUrl.startsWith('/uploads')) {
        try { await apiClient.delete(`/uploads?url=${encodeURIComponent(formData.imageUrl)}`); } catch(e){}
      }
      setFormData(prev => ({ ...prev, imageUrl: newUrl }));
    } catch (err) { alert('Upload failed: ' + (err.response?.data?.message || err.message)); }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const payload = { ...formData, isPublic: formData.isPublic === 'true' };
      if (!payload.location) delete payload.location;
      if (!payload.imageUrl) delete payload.imageUrl;
      if (payload.startDate) payload.startDate = new Date(payload.startDate).toISOString();
      if (payload.endDate) payload.endDate = new Date(payload.endDate).toISOString();
      else delete payload.endDate;

      if (currentId) await apiClient.patch(`/events/${currentId}`, payload);
      else await apiClient.post('/events', payload);
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
        title={currentId ? 'Edit Event Details' : 'Create New Event'}
        subtitle="Provide all the necessary details for this event below."
        stepName="Event Info"
        onCancel={() => setIsFormOpen(false)}
        onSave={handleSave}
        loading={saveLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Event Title <span className="text-red-500">*</span></Label>
            <Input className="border-gray-300 focus-visible:ring-brand-purple" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="Enter event title" />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Description</Label>
            <textarea className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-colors resize-none" rows="3" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} placeholder="Enter event details..." />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Start Date <span className="text-red-500">*</span></Label>
            <Input type="date" className="border-gray-300 focus-visible:ring-brand-purple" value={formData.startDate} onChange={e=>setFormData({...formData, startDate: e.target.value})} />
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">End Date</Label>
            <Input type="date" className="border-gray-300 focus-visible:ring-brand-purple" value={formData.endDate} onChange={e=>setFormData({...formData, endDate: e.target.value})} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Location</Label>
            <Input className="border-gray-300 focus-visible:ring-brand-purple" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} placeholder="E.g. Main Auditorium" />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Event Type</Label>
            <select className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple" value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})}>
              <option value="VISIT">VISIT</option>
              <option value="CONFERENCE">CONFERENCE</option>
              <option value="WORKSHOP">WORKSHOP</option>
              <option value="EXCHANGE">EXCHANGE</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Visibility</Label>
            <select className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple" value={formData.isPublic} onChange={e=>setFormData({...formData, isPublic: e.target.value})}>
              <option value="true">Public (Visible on Website)</option>
              <option value="false">Private (Hidden)</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Event Banner/Image</Label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <Input type="file" accept="image/*" className="border-gray-300 focus-visible:ring-brand-purple cursor-pointer" onChange={e => handleImageUpload(e.target.files[0])} />
              </div>
              {formData.imageUrl && (
                <div className="shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                  <img src={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${formData.imageUrl}`} className="w-full h-full object-cover" alt="Event preview"/>
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminFormLayout>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Events Management</h2>
        <Button onClick={openCreate} className="bg-brand-purple hover:bg-brand-purpleDark">Add New Event</Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-500">Loading events...</TableCell></TableRow> : data.map(item => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-gray-900">{item.title}</TableCell>
                  <TableCell>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-brand-purpleLight/20 text-brand-purple">
                      {item.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">{new Date(item.startDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(item)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
            ))}
            {!loading && data.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-500">No events found.</TableCell></TableRow>
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
