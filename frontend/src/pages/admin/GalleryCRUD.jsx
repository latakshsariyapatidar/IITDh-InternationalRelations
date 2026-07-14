import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';

export default function GalleryCRUD() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
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
    setIsDialogOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      title: item.title, imageUrl: item.imageUrl, caption: item.caption || '',
      category: item.category || 'CAMPUS', takenAt: item.takenAt ? item.takenAt.split('T')[0] : '', isPublic: item.isPublic ? 'true' : 'false',
    });
    setIsDialogOpen(true);
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
    try {
      const payload = { ...formData, isPublic: formData.isPublic === 'true' };
      if (!payload.caption) delete payload.caption;
      if (!payload.takenAt) delete payload.takenAt;
      else payload.takenAt = new Date(payload.takenAt).toISOString();
      if (!payload.imageUrl) return alert("Image URL is required");

      if (currentId) await apiClient.patch(`/gallery/${currentId}`, payload);
      else await apiClient.post('/gallery', payload);
      setIsDialogOpen(false); fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Save failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h2 className="text-2xl font-bold">Gallery</h2><Button onClick={openCreate}>Add Image</Button></div>
      <div className="bg-white border rounded-md shadow-sm">
        <Table>
          <TableHeader><TableRow><TableHead>Image</TableHead><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Public</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} className="text-center py-4">Loading...</TableCell></TableRow> : data.map(item => (
                <TableRow key={item.id}>
                  <TableCell><img src={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${item.imageUrl}`} className="w-16 h-12 object-cover rounded" alt="" /></TableCell>
                  <TableCell>{item.title}</TableCell><TableCell>{item.category}</TableCell><TableCell>{item.isPublic ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-right space-x-2"><Button variant="outline" size="sm" onClick={() => openEdit(item)}>Edit</Button><Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button></TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between"><Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button><Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button></div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{currentId ? 'Edit' : 'New'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2"><Label>Title</Label><Input value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} /></div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select className="w-full p-2 border rounded-md" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})}>
                <option value="CAMPUS">Campus</option><option value="EVENTS">Events</option><option value="VISITS">Visits</option><option value="OTHER">Other</option>
              </select>
            </div>
            <div className="space-y-2"><Label>Image</Label><Input type="file" accept="image/*" onChange={e => handleImageUpload(e.target.files[0])} /></div>
            <div className="space-y-2"><Label>Caption</Label><textarea className="w-full p-2 border rounded-md" rows="2" value={formData.caption} onChange={e=>setFormData({...formData, caption: e.target.value})} /></div>
            <div className="space-y-2"><Label>Date Taken</Label><Input type="date" value={formData.takenAt} onChange={e=>setFormData({...formData, takenAt: e.target.value})} /></div>
            <div className="space-y-2"><Label>Public</Label><select className="w-full p-2 border rounded-md" value={formData.isPublic} onChange={e=>setFormData({...formData, isPublic: e.target.value})}><option value="true">Yes</option><option value="false">No</option></select></div>
          </div>
          <DialogFooter><Button onClick={handleSave}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
