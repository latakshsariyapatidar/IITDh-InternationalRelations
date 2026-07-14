import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';

export default function Team() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 50;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '', year: '', photoUrl: '', isActive: 'true' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/team?page=${page}&limit=${limit}`);
      setData(res.data?.data?.team || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      console.error(err);
      alert('Failed to load team');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const openCreate = () => {
    setCurrentId(null);
    setFormData({ name: '', role: '', year: '', photoUrl: '', isActive: 'true' });
    setIsDialogOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      name: item.name,
      role: item.role,
      year: item.year || '',
      photoUrl: item.photoUrl || '',
      isActive: item.isActive ? 'true' : 'false',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    try {
      await apiClient.delete(`/team/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete team member');
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await apiClient.post('/uploads/image/team', fd);
      const newUrl = res.data?.data?.url;
      if (formData.photoUrl && formData.photoUrl.startsWith('/uploads')) {
        try { await apiClient.delete(`/uploads?url=${encodeURIComponent(formData.photoUrl)}`); } catch(e){}
      }
      setFormData(prev => ({ ...prev, photoUrl: newUrl }));
    } catch (err) { alert('Image upload failed'); }
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData, isActive: formData.isActive === 'true' };
      if (!payload.year) delete payload.year;
      if (!payload.photoUrl) delete payload.photoUrl;

      if (currentId) await apiClient.patch(`/team/${currentId}`, payload);
      else await apiClient.post('/team', payload);
      setIsDialogOpen(false);
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Save failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h2 className="text-2xl font-bold">Team</h2><Button onClick={openCreate}>Add Member</Button></div>
      <div className="bg-white border rounded-md shadow-sm">
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Year</TableHead><TableHead>Active?</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} className="text-center py-4">Loading...</TableCell></TableRow> : data.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {item.photoUrl && <img src={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${item.photoUrl}`} alt="" className="w-8 h-8 rounded-full object-cover" />}
                    {item.name}
                  </TableCell>
                  <TableCell>{item.role}</TableCell><TableCell>{item.year}</TableCell><TableCell>{item.isActive ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-right space-x-2"><Button variant="outline" size="sm" onClick={() => openEdit(item)}>Edit</Button><Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button></TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{currentId ? 'Edit' : 'New'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Name</Label><Input value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} /></div>
            <div className="space-y-2"><Label>Role</Label><Input value={formData.role} onChange={e=>setFormData({...formData, role: e.target.value})} /></div>
            <div className="space-y-2"><Label>Year (Optional)</Label><Input value={formData.year} onChange={e=>setFormData({...formData, year: e.target.value})} placeholder="e.g. 2023-2024" /></div>
            <div className="space-y-2"><Label>Photo</Label><Input type="file" accept="image/*" onChange={e => handleImageUpload(e.target.files[0])} />{formData.photoUrl && <p className="text-xs mt-1">Uploaded</p>}</div>
            <div className="space-y-2"><Label>Active</Label><select className="w-full p-2 border rounded-md" value={formData.isActive} onChange={e=>setFormData({...formData, isActive: e.target.value})}><option value="true">Yes</option><option value="false">No</option></select></div>
          </div>
          <DialogFooter><Button onClick={handleSave}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
