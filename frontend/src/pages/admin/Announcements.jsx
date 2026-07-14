import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';

export default function Announcements() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublic: 'false',
    publishedAt: ''
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/announcements?page=${page}&limit=${limit}`);
      setData(res.data?.data?.announcements || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      console.error(err);
      alert('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [page]);

  const openCreate = () => {
    setCurrentId(null);
    setFormData({ title: '', content: '', isPublic: 'false', publishedAt: '' });
    setIsDialogOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      title: item.title,
      content: item.content,
      // Handle the strict boolean string requirement from the checklist
      isPublic: item.isPublic ? 'true' : 'false',
      publishedAt: item.publishedAt ? item.publishedAt.split('T')[0] : ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await apiClient.delete(`/announcements/${id}`);
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || 'Failed to delete announcement');
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        // Convert the string "true"/"false" back to boolean for backend if needed,
        // but checklist says some endpoints want strict string. We'll send standard JSON here
        // actually since this is a JSON post, not multipart. Wait, only multipart requires literal string.
        isPublic: formData.isPublic === 'true'
      };
      
      // If publishedAt is empty, remove it
      if (!payload.publishedAt) delete payload.publishedAt;
      else payload.publishedAt = new Date(payload.publishedAt).toISOString();

      if (currentId) {
        await apiClient.patch(`/announcements/${currentId}`, payload);
      } else {
        await apiClient.post('/announcements', payload);
      }
      setIsDialogOpen(false);
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save announcement');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Announcements</h2>
        <Button onClick={openCreate}>Add Announcement</Button>
      </div>

      <div className="bg-white border rounded-md shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Public?</TableHead>
              <TableHead>Published Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-4">Loading...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-4">No announcements found.</TableCell></TableRow>
            ) : (
              data.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.isPublic ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(item)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
        <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentId ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                placeholder="Enter title" 
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <textarea 
                className="w-full p-2 border rounded-md" 
                rows="4"
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})} 
                placeholder="Announcement details..."
              />
            </div>
            <div className="space-y-2">
              <Label>Is Public</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={formData.isPublic}
                onChange={e => setFormData({...formData, isPublic: e.target.value})}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Publish Date</Label>
              <Input 
                type="date"
                value={formData.publishedAt} 
                onChange={e => setFormData({...formData, publishedAt: e.target.value})} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
