import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AdminFormLayout from '../../components/admin/AdminFormLayout';

export default function Announcements() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  
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
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      title: item.title,
      content: item.content,
      isPublic: item.isPublic ? 'true' : 'false',
      publishedAt: item.publishedAt ? item.publishedAt.split('T')[0] : ''
    });
    setIsFormOpen(true);
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
    setSaveLoading(true);
    try {
      const payload = {
        ...formData,
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
      setIsFormOpen(false);
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save announcement');
    } finally {
      setSaveLoading(false);
    }
  };

  if (isFormOpen) {
    return (
      <AdminFormLayout
        title={currentId ? 'Edit Announcement' : 'New Announcement'}
        subtitle="Manage the details of this announcement."
        stepName="Announcement Info"
        onCancel={() => setIsFormOpen(false)}
        onSave={handleSave}
        loading={saveLoading}
      >
        <div className="space-y-5 max-w-3xl">
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Title <span className="text-red-500">*</span></Label>
            <Input 
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="Enter title" 
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Content <span className="text-red-500">*</span></Label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-colors resize-none" 
              rows="5"
              value={formData.content} 
              onChange={e => setFormData({...formData, content: e.target.value})} 
              placeholder="Announcement details..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Visibility</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple"
                value={formData.isPublic}
                onChange={e => setFormData({...formData, isPublic: e.target.value})}
              >
                <option value="true">Public (Visible)</option>
                <option value="false">Private (Hidden)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Publish Date</Label>
              <Input 
                type="date"
                className="border-gray-300 focus-visible:ring-brand-purple"
                value={formData.publishedAt} 
                onChange={e => setFormData({...formData, publishedAt: e.target.value})} 
              />
            </div>
          </div>
        </div>
      </AdminFormLayout>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Announcements Management</h2>
        <Button onClick={openCreate} className="bg-brand-purple hover:bg-brand-purpleDark">Add Announcement</Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Visibility</TableHead>
              <TableHead className="font-semibold">Published Date</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-500">Loading announcements...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-500">No announcements found.</TableCell></TableRow>
            ) : (
              data.map(item => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-gray-900">{item.title}</TableCell>
                  <TableCell>
                    {item.isPublic ? (
                      <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-medium border border-green-200">Public</span>
                    ) : (
                      <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-md text-xs font-medium border border-gray-200">Private</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600">{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'N/A'}</TableCell>
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
        <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>
    </div>
  );
}
