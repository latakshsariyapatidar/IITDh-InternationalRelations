import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';

export default function Faculty() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 50;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', redirectUrl: '', isActive: 'true' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/faculty?page=${page}&limit=${limit}`);
      setData(res.data?.data?.faculty || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      console.error(err);
      alert('Failed to load faculty');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const openCreate = () => {
    setCurrentId(null);
    setFormData({ name: '', redirectUrl: '', isActive: 'true' });
    setIsDialogOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      name: item.name,
      redirectUrl: item.redirectUrl,
      isActive: item.isActive ? 'true' : 'false',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this faculty member?')) return;
    try {
      await apiClient.delete(`/faculty/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete faculty');
    }
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData, isActive: formData.isActive === 'true' };
      if (currentId) await apiClient.patch(`/faculty/${currentId}`, payload);
      else await apiClient.post('/faculty', payload);
      setIsDialogOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save faculty');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Faculty</h2>
        <Button onClick={openCreate}>Add Faculty</Button>
      </div>

      <div className="bg-white border rounded-md shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Redirect URL</TableHead>
              <TableHead>Active?</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={4} className="text-center py-4">Loading...</TableCell></TableRow> : data.length === 0 ? <TableRow><TableCell colSpan={4} className="text-center py-4">No faculty found.</TableCell></TableRow> : data.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
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
          <DialogHeader><DialogTitle>{currentId ? 'Edit Faculty' : 'New Faculty'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Name</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Prof. John Doe" /></div>
            <div className="space-y-2"><Label>Profile URL</Label><Input type="url" value={formData.redirectUrl} onChange={e => setFormData({...formData, redirectUrl: e.target.value})} placeholder="https://iitdh.ac.in/..." /></div>
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
