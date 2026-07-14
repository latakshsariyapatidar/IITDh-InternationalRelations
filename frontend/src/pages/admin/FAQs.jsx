import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';

export default function FAQs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 50;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({ question: '', answer: '', order: '0', isActive: 'true' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/faqs?page=${page}&limit=${limit}`);
      setData(res.data?.data?.faqs || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      console.error(err);
      alert('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const openCreate = () => {
    setCurrentId(null);
    setFormData({ question: '', answer: '', order: '0', isActive: 'true' });
    setIsDialogOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      question: item.question,
      answer: item.answer,
      order: String(item.order),
      isActive: item.isActive ? 'true' : 'false',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await apiClient.delete(`/faqs/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete FAQ');
    }
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData, order: parseInt(formData.order) || 0, isActive: formData.isActive === 'true' };
      if (currentId) await apiClient.patch(`/faqs/${currentId}`, payload);
      else await apiClient.post('/faqs', payload);
      setIsDialogOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save FAQ');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">FAQs</h2>
        <Button onClick={openCreate}>Add FAQ</Button>
      </div>

      <div className="bg-white border rounded-md shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Active?</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={4} className="text-center py-4">Loading...</TableCell></TableRow> : data.length === 0 ? <TableRow><TableCell colSpan={4} className="text-center py-4">No FAQs found.</TableCell></TableRow> : data.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.order}</TableCell>
                  <TableCell className="font-medium max-w-md truncate">{item.question}</TableCell>
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
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>{currentId ? 'Edit FAQ' : 'New FAQ'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Order</Label><Input type="number" value={formData.order} onChange={e => setFormData({...formData, order: e.target.value})} /></div>
            <div className="space-y-2"><Label>Question</Label><Input value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} placeholder="What is the process?" /></div>
            <div className="space-y-2"><Label>Answer</Label><textarea className="w-full p-2 border rounded-md" rows="4" value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} /></div>
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
