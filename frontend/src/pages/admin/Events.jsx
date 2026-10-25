import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AdminFormLayout from '../../components/admin/AdminFormLayout';
import { formatDay } from '../../utils/formatDay';
import { resolveMediaUrl } from '../../utils/media';
import { RiFilter3Line } from '@remixicon/react';

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

export default function Events() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  // 5.34 Type and upcoming filters
  const [typeFilter, setTypeFilter] = useState('');
  const [upcomingFilter, setUpcomingFilter] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [savedImageUrl, setSavedImageUrl] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    imageUrl: '',
    type: 'OTHER',
    isPublic: 'true',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        ...(typeFilter ? { type: typeFilter } : {}),
        ...(upcomingFilter !== '' ? { upcoming: upcomingFilter } : {}),
      };
      const res = await apiClient.get('/events', { params });
      setData(res.data?.data?.events || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      alert('Failed to load events: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, typeFilter, upcomingFilter]);

  // 1.6: Helper to discard newly uploaded image if form is cancelled
  const discardUnsavedImage = async (url) => {
    if (!url || url === savedImageUrl || !url.startsWith('/uploads')) return;
    try {
      await apiClient.delete(`/uploads?url=${encodeURIComponent(url)}`);
    } catch (err) {
      console.warn('Failed to delete unsaved image', err);
    }
  };

  const openCreate = () => {
    setCurrentId(null);
    setSavedImageUrl('');
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      imageUrl: '',
      type: 'OTHER',
      isPublic: 'true',
    });
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setSavedImageUrl(item.imageUrl || '');
    setFormData({
      title: item.title || '',
      description: item.description || '', // 5.32 default to empty string, never null
      startDate: toDateTimeLocal(item.startDate),
      endDate: toDateTimeLocal(item.endDate),
      location: item.location || '',
      imageUrl: item.imageUrl || '',
      type: item.type || 'OTHER',
      isPublic: item.isPublic !== false ? 'true' : 'false',
    });
    setIsFormOpen(true);
  };

  // 1.4: Catch error on delete and alert message
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await apiClient.delete(`/events/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete event');
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await apiClient.post('/uploads/image/events', fd);
      const newUrl = res.data?.data?.url;
      // Discard previous uncommitted image upload if present
      await discardUnsavedImage(formData.imageUrl);
      setFormData(prev => ({ ...prev, imageUrl: newUrl }));
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCancel = async () => {
    await discardUnsavedImage(formData.imageUrl);
    setIsFormOpen(false);
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      // 1.7 & 5.32: Clear optional fields with null/empty string
      const payload = {
        title: formData.title.trim(),
        description: formData.description ? formData.description.trim() : "",
        isPublic: formData.isPublic === 'true',
        type: formData.type,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        location: formData.location ? formData.location.trim() : null,
        imageUrl: formData.imageUrl ? formData.imageUrl : null,
      };

      if (currentId) {
        await apiClient.patch(`/events/${currentId}`, payload);
      } else {
        await apiClient.post('/events', payload);
      }

      // 1.6: Only delete old image after save succeeds
      if (savedImageUrl && savedImageUrl !== formData.imageUrl && savedImageUrl.startsWith('/uploads')) {
        try {
          await apiClient.delete(`/uploads?url=${encodeURIComponent(savedImageUrl)}`);
        } catch (e) {
          console.warn('Failed to cleanup old image', e);
        }
      }

      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setSaveLoading(false);
    }
  };

  if (isFormOpen) {
    return (
      <AdminFormLayout
        title={currentId ? 'Edit Event Details' : 'Create New Event'}
        subtitle="Provide all the necessary details, dates, and banner for this event."
        stepName="Event Info"
        onCancel={handleCancel}
        onSave={handleSave}
        loading={saveLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Event Title <span className="text-red-500">*</span></Label>
            <Input 
              className="border-gray-300 focus-visible:ring-brand-purple" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="Enter event title" 
              required
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Description</Label>
            {/* 5.32 Send empty string, not null */}
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-colors resize-none text-sm" 
              rows="3" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              placeholder="Enter event details..." 
            />
          </div>

          {/* 5.33 Datetime-local inputs */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Start Date & Time <span className="text-red-500">*</span></Label>
            <Input 
              type="datetime-local" 
              className="border-gray-300 focus-visible:ring-brand-purple" 
              value={formData.startDate} 
              onChange={e => setFormData({...formData, startDate: e.target.value})} 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">End Date & Time</Label>
            <Input 
              type="datetime-local" 
              className="border-gray-300 focus-visible:ring-brand-purple" 
              value={formData.endDate} 
              onChange={e => setFormData({...formData, endDate: e.target.value})} 
            />
            <p className="text-[11px] text-gray-400">Leave blank for single-session events.</p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Location / Venue</Label>
            <Input 
              className="border-gray-300 focus-visible:ring-brand-purple" 
              value={formData.location} 
              onChange={e => setFormData({...formData, location: e.target.value})} 
              placeholder="E.g. Senate Hall / Main Auditorium / Virtual" 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Event Type</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple" 
              value={formData.type} 
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="VISIT">VISIT (Delegation / Protocol)</option>
              <option value="CONFERENCE">CONFERENCE</option>
              <option value="WORKSHOP">WORKSHOP</option>
              <option value="EXCHANGE">EXCHANGE</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Visibility</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple" 
              value={formData.isPublic} 
              onChange={e => setFormData({...formData, isPublic: e.target.value})}
            >
              <option value="true">Public (Visible on Website)</option>
              <option value="false">Private (Hidden)</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Event Banner / Image</Label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <Input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp,image/gif" 
                  className="border-gray-300 focus-visible:ring-brand-purple cursor-pointer" 
                  onChange={e => handleImageUpload(e.target.files[0])} 
                />
              </div>
              {formData.imageUrl && (
                <div className="shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center relative group">
                  <img src={resolveMediaUrl(formData.imageUrl)} className="w-full h-full object-cover" alt="Event preview"/>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, imageUrl: '' }))}
                    className="absolute inset-0 bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminFormLayout>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Events Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage international academic events, delegations, and conferences.</p>
        </div>
        <Button onClick={openCreate} className="bg-brand-purple hover:bg-brand-purpleDark cursor-pointer self-start sm:self-auto">
          Add New Event
        </Button>
      </div>

      {/* 5.34 Type and Upcoming Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-gray-500 font-semibold uppercase text-xs">
          <RiFilter3Line size={16} /> Filters:
        </div>

        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs bg-white text-gray-700 focus:ring-2 focus:ring-brand-purple"
        >
          <option value="">All Event Types</option>
          <option value="VISIT">Visit</option>
          <option value="CONFERENCE">Conference</option>
          <option value="WORKSHOP">Workshop</option>
          <option value="EXCHANGE">Exchange</option>
          <option value="OTHER">Other</option>
        </select>

        <select
          value={upcomingFilter}
          onChange={(e) => { setUpcomingFilter(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs bg-white text-gray-700 focus:ring-2 focus:ring-brand-purple"
        >
          <option value="">All Timelines</option>
          <option value="true">Upcoming Only</option>
          <option value="false">Past Only</option>
        </select>

        {(typeFilter || upcomingFilter !== '') && (
          <button
            onClick={() => { setTypeFilter(''); setUpcomingFilter(''); setPage(1); }}
            className="text-xs text-brand-purple hover:underline font-semibold ml-auto cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* 5.34 Table with columns for visibility, location and end date */}
      <div className="bg-white border rounded-xl shadow-xs overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Event Title</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Location</TableHead>
              <TableHead className="font-semibold">Start Date</TableHead>
              <TableHead className="font-semibold">End Date</TableHead>
              <TableHead className="font-semibold">Visibility</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">Loading events...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">No events found matching current criteria.</TableCell></TableRow>
            ) : (
              data.map(item => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-gray-900 max-w-xs truncate">{item.title}</TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-purpleLight/20 text-brand-purple">
                      {item.type}
                    </span>
                  </TableCell>
                  {/* 5.34 Location column */}
                  <TableCell className="text-xs text-gray-600">{item.location || '—'}</TableCell>
                  {/* 5.34 Start and End date columns */}
                  <TableCell className="text-xs text-gray-600">{item.startDate ? formatDay(item.startDate, 'en-US') : '—'}</TableCell>
                  <TableCell className="text-xs text-gray-600">{item.endDate ? formatDay(item.endDate, 'en-US') : '—'}</TableCell>
                  {/* 5.34 Visibility column */}
                  <TableCell>
                    {item.isPublic ? (
                      <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-xs font-semibold border border-green-200">Public</span>
                    ) : (
                      <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium border border-gray-200">Hidden</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(item)} className="cursor-pointer">Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} className="cursor-pointer">Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="cursor-pointer">Previous</Button>
        <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="cursor-pointer">Next</Button>
      </div>
    </div>
  );
}
