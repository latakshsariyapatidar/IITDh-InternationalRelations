import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AdminFormLayout from '../../components/admin/AdminFormLayout';
import { formatDay } from '../../utils/formatDay';

const toDateTimeLocal = (isoStr) => {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  const YYYY = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const DD = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
};

export default function Announcements() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // 5.6: Default new announcements to Public
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublic: 'true',
    publishedAt: '',
    visibleUntil: '',
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
    setFormData({
      title: '',
      content: '',
      isPublic: 'true',
      publishedAt: '',
      visibleUntil: '',
    });
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      title: item.title || '',
      content: item.content || '',
      isPublic: item.isPublic !== false ? 'true' : 'false',
      publishedAt: toDateTimeLocal(item.publishedAt),
      visibleUntil: toDateTimeLocal(item.visibleUntil),
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
      // 1.7 & 5.4: Send null when fields are cleared
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        isPublic: formData.isPublic === 'true',
        publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null,
        visibleUntil: formData.visibleUntil ? new Date(formData.visibleUntil).toISOString() : null,
      };

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

  // 5.5: Compute status: Live, Scheduled, Ended or Hidden
  const getAnnouncementStatus = (item) => {
    if (item.isPublic === false) {
      return { label: 'Hidden', className: 'text-gray-600 bg-gray-100 border border-gray-200' };
    }
    const now = new Date();
    if (item.publishedAt && new Date(item.publishedAt) > now) {
      return { label: 'Scheduled', className: 'text-blue-700 bg-blue-50 border border-blue-200' };
    }
    if (item.visibleUntil && new Date(item.visibleUntil) < now) {
      return { label: 'Ended', className: 'text-amber-800 bg-amber-50 border border-amber-200' };
    }
    return { label: 'Live', className: 'text-green-700 bg-green-50 border border-green-200 font-semibold' };
  };

  if (isFormOpen) {
    return (
      <AdminFormLayout
        title={currentId ? 'Edit Announcement' : 'New Announcement'}
        subtitle="Manage the details, visibility, and schedule of this announcement."
        stepName="Announcement Info"
        onCancel={() => setIsFormOpen(false)}
        onSave={handleSave}
        loading={saveLoading}
      >
        <div className="space-y-5 max-w-3xl">
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">
              Title <span className="text-red-500">*</span>
              <span className="text-xs text-gray-400 font-normal ml-2">({formData.title.length}/300 characters)</span>
            </Label>
            {/* 5.8: 300 character title limit */}
            <Input 
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="Enter announcement title"
              maxLength={300}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Content <span className="text-red-500">*</span></Label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-colors resize-none" 
              rows="5"
              maxLength={5000}
              value={formData.content} 
              onChange={e => setFormData({...formData, content: e.target.value})} 
              placeholder="Announcement details..."
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Visibility</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple"
                value={formData.isPublic}
                onChange={e => setFormData({...formData, isPublic: e.target.value})}
              >
                <option value="true">Public (Live)</option>
                <option value="false">Private (Hidden)</option>
              </select>
            </div>
            
            {/* 5.7: Datetime-local inputs */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Publish Date & Time</Label>
              <Input 
                type="datetime-local"
                className="border-gray-300 focus-visible:ring-brand-purple"
                value={formData.publishedAt} 
                onChange={e => setFormData({...formData, publishedAt: e.target.value})} 
              />
              <p className="text-[11px] text-gray-400">Leave blank to make live immediately.</p>
            </div>

            {/* 5.4: Visible until field */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Visible Until Date & Time</Label>
              <Input 
                type="datetime-local"
                className="border-gray-300 focus-visible:ring-brand-purple"
                value={formData.visibleUntil} 
                onChange={e => setFormData({...formData, visibleUntil: e.target.value})} 
              />
              <p className="text-[11px] text-gray-400">Leave blank to keep live indefinitely.</p>
            </div>
          </div>
        </div>
      </AdminFormLayout>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Announcements Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">Publish bulletins, updates, and notices to the campus marquee.</p>
        </div>
        <Button onClick={openCreate} className="bg-brand-purple hover:bg-brand-purpleDark cursor-pointer">
          Add Announcement
        </Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Title</TableHead>
              {/* 5.5: Status column */}
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Published At</TableHead>
              <TableHead className="font-semibold">Visible Until</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">Loading announcements...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No announcements found.</TableCell></TableRow>
            ) : (
              data.map(item => {
                const status = getAnnouncementStatus(item);
                return (
                  <TableRow key={item.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium text-gray-900 max-w-sm truncate">{item.title}</TableCell>
                    {/* 5.5 Status badge */}
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </TableCell>
                    {/* 5.5 Empty publish date means "Live Now" */}
                    <TableCell className="text-xs text-gray-600">
                      {item.publishedAt ? formatDay(item.publishedAt, 'en-US') : (
                        <span className="text-green-600 font-semibold">Live Now</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {item.visibleUntil ? formatDay(item.visibleUntil, 'en-US') : 'Indefinite'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(item)} className="cursor-pointer">Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} className="cursor-pointer">Delete</Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="cursor-pointer">Previous</Button>
        <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="cursor-pointer">Next</Button>
      </div>
    </div>
  );
}
