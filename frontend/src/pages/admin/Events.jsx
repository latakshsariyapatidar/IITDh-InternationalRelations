import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';

export default function Events() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', startDate: '', endDate: '', location: '', imageUrl: '', type: 'UPCOMING', isPublic: 'true' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/events?page=${page}&limit=${limit}`);
      setData(res.data?.data?.events || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) { alert('Failed to load events'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [page]);

  const openCreate = () => {
    setCurrentId(null);
    setFormData({ title: '', description: '', startDate: '', endDate: '', location: '', imageUrl: '', type: 'UPCOMING', isPublic: 'true' });
    setIsDialogOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      title: item.title, description: item.description, 
      startDate: item.startDate ? item.startDate.split('T')[0] : '', 
      endDate: item.endDate ? item.endDate.split('T')[0] : '', 
      location: item.location || '', imageUrl: item.imageUrl || '', 
      type: item.type || 'UPCOMING', isPublic: item.isPublic ? 'true' : 'false',
    });
    setIsDialogOpen(true);
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
    } catch (err) { alert('Upload failed'); }
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData, isPublic: formData.isPublic === 'true' };
      if (!payload.location) delete payload.location;
      if (!payload.imageUrl) delete payload.imageUrl;
      if (payload.startDate) payload.startDate = new Date(payload.startDate).toISOString();
      if (payload.endDate) payload.endDate = new Date(payload.endDate).toISOString();
      else delete payload.endDate;

      if (currentId) await apiClient.patch(`/events/${currentId}`, payload);
      else await apiClient.post('/events', payload);
      setIsDialogOpen(false); fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Save failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h2 className="text-2xl font-bold">Events</h2><Button onClick={openCreate}>Add Event</Button></div>
      <div className="bg-white border rounded-md shadow-sm">
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={4} className="text-center py-4">Loading...</TableCell></TableRow> : data.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell><TableCell>{item.type}</TableCell><TableCell>{new Date(item.startDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2"><Button variant="outline" size="sm" onClick={() => openEdit(item)}>Edit</Button><Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button></TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between"><Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button><Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button></div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{currentId ? 'Edit Event' : 'New Event'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2"><Label>Title</Label><Input value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} /></div>
            <div className="space-y-2"><Label>Description</Label><textarea className="w-full p-2 border rounded-md" rows="3" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={formData.startDate} onChange={e=>setFormData({...formData, startDate: e.target.value})} /></div>
              <div className="space-y-2"><Label>End Date</Label><Input type="date" value={formData.endDate} onChange={e=>setFormData({...formData, endDate: e.target.value})} /></div>
            </div>
            <div className="space-y-2"><Label>Location</Label><Input value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} /></div>
            <div className="space-y-2"><Label>Type</Label>
              <select className="w-full p-2 border rounded-md" value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})}>
                <option value="UPCOMING">UPCOMING</option><option value="PAST">PAST</option>
              </select>
            </div>
            <div className="space-y-2"><Label>Image</Label><Input type="file" accept="image/*" onChange={e => handleImageUpload(e.target.files[0])} />{formData.imageUrl && <img src={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${formData.imageUrl}`} className="w-16 mt-2" alt=""/>}</div>
            <div className="space-y-2"><Label>Public</Label><select className="w-full p-2 border rounded-md" value={formData.isPublic} onChange={e=>setFormData({...formData, isPublic: e.target.value})}><option value="true">Yes</option><option value="false">No</option></select></div>
          </div>
          <DialogFooter><Button onClick={handleSave}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
