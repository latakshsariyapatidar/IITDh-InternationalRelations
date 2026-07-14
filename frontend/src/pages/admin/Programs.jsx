import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';

export default function Programs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 50;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', level: 'UNDERGRADUATE', redirectUrl: '', isActive: 'true' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/programs?page=${page}&limit=${limit}`);
      setData(res.data?.data?.programs || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      console.error(err);
      alert('Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const openCreate = () => {
    setCurrentId(null);
    setFormData({ name: '', level: 'UNDERGRADUATE', redirectUrl: '', isActive: 'true' });
    setIsDialogOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      name: item.name,
      level: item.level,
      redirectUrl: item.redirectUrl,
      isActive: item.isActive ? 'true' : 'false',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    try {
      await apiClient.delete(`/programs/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete program');
    }
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData, isActive: formData.isActive === 'true' };
      if (currentId) await apiClient.patch(`/programs/${currentId}`, payload);
      else await apiClient.post('/programs', payload);
      setIsDialogOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save program');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Programs</h2>
        <Button onClick={openCreate}>Add Program</Button>
      </div>

      <div className="bg-white border rounded-md shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Redirect URL</TableHead>
              <TableHead>Active?</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} className="text-center py-4">Loading...</TableCell></TableRow> : data.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-4">No programs found.</TableCell></TableRow> : data.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.level}</TableCell>
                  <TableCell><a href={item.redirectUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Link</a></TableCell>
                  <TableCell>{item.isActive ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(item)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
        <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{currentId ? 'Edit Program' : 'New Program'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Name</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="B.Tech in CS" /></div>
            <div className="space-y-2">
              <Label>Level</Label>
              <select className="w-full p-2 border rounded-md" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
                <option value="UNDERGRADUATE">Undergraduate</option>
                <option value="POSTGRADUATE">Postgraduate</option>
                <option value="PHD">PhD</option>
              </select>
            </div>
            <div className="space-y-2"><Label>Redirect URL</Label><Input type="url" value={formData.redirectUrl} onChange={e => setFormData({...formData, redirectUrl: e.target.value})} placeholder="https://..." /></div>
            <div className="space-y-2">
              <Label>Is Active</Label>
              <select className="w-full p-2 border rounded-md" value={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.value})}>
                <option value="true">Yes</option><option value="false">No</option>
              </select>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
