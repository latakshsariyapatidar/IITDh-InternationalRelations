import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';

export default function Testimonials() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ name: '', country: '', program: '', text: '', photoUrl: '', isActive: 'true' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/testimonials?page=${page}&limit=${limit}`);
      setData(res.data?.data?.testimonials || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) { alert('Failed to load testimonials'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [page]);

  const openCreate = () => {
    setCurrentId(null);
    setFormData({ name: '', country: '', program: '', text: '', photoUrl: '', isActive: 'true' });
    setIsDialogOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      name: item.name, country: item.country || '', program: item.program || '',
      text: item.text, photoUrl: item.photoUrl || '', isActive: item.isActive ? 'true' : 'false',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete testimonial?')) return;
    try { await apiClient.delete(`/testimonials/${id}`); fetchData(); } catch (err) {}
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await apiClient.post('/uploads/image/testimonials', fd);
      const newUrl = res.data?.data?.url;
      if (formData.photoUrl && formData.photoUrl.startsWith('/uploads')) {
        try { await apiClient.delete(`/uploads?url=${encodeURIComponent(formData.photoUrl)}`); } catch(e){}
      }
      setFormData(prev => ({ ...prev, photoUrl: newUrl }));
    } catch (err) { alert('Upload failed'); }
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData, isActive: formData.isActive === 'true' };
      if (!payload.country) delete payload.country;
      if (!payload.program) delete payload.program;
      if (!payload.photoUrl) delete payload.photoUrl;

      if (currentId) await apiClient.patch(`/testimonials/${currentId}`, payload);
      else await apiClient.post('/testimonials', payload);
      setIsDialogOpen(false); fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Save failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h2 className="text-2xl font-bold">Testimonials</h2><Button onClick={openCreate}>Add Testimonial</Button></div>
      <div className="bg-white border rounded-md shadow-sm">
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Country</TableHead><TableHead>Program</TableHead><TableHead>Active</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} className="text-center py-4">Loading...</TableCell></TableRow> : data.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {item.photoUrl && <img src={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${item.photoUrl}`} alt="" className="w-8 h-8 rounded-full object-cover" />}
                    {item.name}
                  </TableCell>
                  <TableCell>{item.country}</TableCell><TableCell>{item.program}</TableCell><TableCell>{item.isActive ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-right space-x-2"><Button variant="outline" size="sm" onClick={() => openEdit(item)}>Edit</Button><Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button></TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{currentId ? 'Edit' : 'New'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2"><Label>Name</Label><Input value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} /></div>
            <div className="space-y-2"><Label>Country</Label><Input value={formData.country} onChange={e=>setFormData({...formData, country: e.target.value})} /></div>
            <div className="space-y-2"><Label>Program</Label><Input value={formData.program} onChange={e=>setFormData({...formData, program: e.target.value})} /></div>
            <div className="space-y-2"><Label>Testimonial Text</Label><textarea className="w-full p-2 border rounded-md" rows="4" value={formData.text} onChange={e=>setFormData({...formData, text: e.target.value})} /></div>
            <div className="space-y-2"><Label>Photo</Label><Input type="file" accept="image/*" onChange={e => handleImageUpload(e.target.files[0])} /></div>
            <div className="space-y-2"><Label>Active</Label><select className="w-full p-2 border rounded-md" value={formData.isActive} onChange={e=>setFormData({...formData, isActive: e.target.value})}><option value="true">Yes</option><option value="false">No</option></select></div>
          </div>
          <DialogFooter><Button onClick={handleSave}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
