import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AdminFormLayout from '../../components/admin/AdminFormLayout';
import { resolveMediaUrl } from '../../utils/media';

export default function Opportunities() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Filters (5.47)
  const [audienceFilter, setAudienceFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    externalUrl: '',
    attachmentUrl: '',
    category: 'SCHOLARSHIP',
    audience: 'STUDENT',
    publishedAt: '',
    visibleUntil: '',
    applicationDeadline: '',
    organisation: '',
    country: '',
    countryCode: '',
    isActive: true
  });

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      let url = `/opportunities?page=${page}&limit=${limit}&includeExpired=true`;
      if (audienceFilter) url += `&audience=${audienceFilter}`;
      if (categoryFilter) url += `&category=${categoryFilter}`;

      const res = await apiClient.get(url);
      setData(res.data?.data?.opportunities || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      console.error(err);
      alert('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [page, audienceFilter, categoryFilter]);

  const toInputDateTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      // Return YYYY-MM-DDTHH:mm format in local time
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch (e) {
      return '';
    }
  };

  const openCreate = () => {
    setCurrentId(null);
    setFormData({ 
      title: '', description: '', externalUrl: '', attachmentUrl: '',
      category: 'SCHOLARSHIP', audience: 'STUDENT', 
      publishedAt: '', visibleUntil: '', applicationDeadline: '',
      organisation: '', country: '', countryCode: '', isActive: true
    });
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      externalUrl: item.externalUrl || item.url || '',
      attachmentUrl: item.attachmentUrl || '',
      category: item.category || 'SCHOLARSHIP',
      audience: item.audience || 'STUDENT',
      publishedAt: toInputDateTime(item.publishedAt),
      visibleUntil: toInputDateTime(item.visibleUntil),
      applicationDeadline: toInputDateTime(item.applicationDeadline),
      organisation: item.organisation || '',
      country: item.country || '',
      countryCode: item.countryCode || '',
      isActive: item.isActive !== false
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;
    try {
      await apiClient.delete(`/opportunities/${id}`);
      fetchOpportunities();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || 'Failed to delete opportunity');
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    try {
      setUploadingDoc(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await apiClient.post('/uploads/document/opportunities', fd);
      const url = res.data?.data?.url;
      setFormData(prev => ({ ...prev, attachmentUrl: url }));
    } catch (err) {
      console.error(err);
      alert('Failed to upload document: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      let formattedUrl = formData.externalUrl?.trim();
      if (formattedUrl && !/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        audience: formData.audience,
        externalUrl: formattedUrl || null,
        url: formattedUrl || null,
        attachmentUrl: formData.attachmentUrl || null,
        publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null,
        visibleUntil: formData.visibleUntil ? new Date(formData.visibleUntil).toISOString() : null,
        applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline).toISOString() : null,
        organisation: formData.organisation.trim() || null,
        country: formData.country.trim() || null,
        countryCode: formData.countryCode?.trim() ? formData.countryCode.trim().toUpperCase() : null,
        isActive: Boolean(formData.isActive)
      };

      if (currentId) {
        await apiClient.patch(`/opportunities/${currentId}`, payload);
      } else {
        await apiClient.post('/opportunities', payload);
      }
      setIsFormOpen(false);
      fetchOpportunities();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || 'Failed to save opportunity');
    } finally {
      setSaveLoading(false);
    }
  };

  const getComputedStatus = (item) => {
    if (item.isActive === false) return { label: 'Hidden', color: 'bg-gray-100 text-gray-700 border-gray-300' };
    const now = new Date();
    if (item.publishedAt && new Date(item.publishedAt) > now) {
      return { label: 'Scheduled', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
    if (item.visibleUntil && new Date(item.visibleUntil) < now) {
      return { label: 'Expired', color: 'bg-red-50 text-red-700 border-red-200' };
    }
    return { label: 'Live', color: 'bg-green-50 text-green-700 border-green-200' };
  };

  if (isFormOpen) {
    return (
      <AdminFormLayout
        title={currentId ? 'Edit Opportunity' : 'New Opportunity'}
        subtitle="Manage the details of this opportunity."
        stepName="Opportunity Info"
        onCancel={() => setIsFormOpen(false)}
        onSave={handleSave}
        loading={saveLoading || uploadingDoc}
      >
        <div className="space-y-5 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-gray-700 font-semibold">Title <span className="text-red-500">*</span></Label>
              <Input 
                className="border-gray-300 focus-visible:ring-brand-purple"
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                placeholder="Enter title"
                maxLength={255}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-gray-700 font-semibold">Description <span className="text-red-500">*</span></Label>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-colors resize-none" 
                rows="4"
                maxLength={5000}
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="Opportunity details..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Category</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="SCHOLARSHIP">Scholarship</option>
                <option value="EXCHANGE">Exchange</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="RESEARCH">Research</option>
                <option value="FELLOWSHIP">Fellowship</option>
                <option value="CONFERENCE">Conference</option>
                <option value="GRANT">Grant</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Audience</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple"
                value={formData.audience}
                onChange={e => setFormData({...formData, audience: e.target.value})}
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
                <option value="BOTH">Both</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Organisation / University (Optional)</Label>
              <Input 
                className="border-gray-300 focus-visible:ring-brand-purple"
                value={formData.organisation} 
                onChange={e => setFormData({...formData, organisation: e.target.value})} 
                placeholder="e.g. DAAD, European Commission"
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Country (Optional)</Label>
              <Input 
                className="border-gray-300 focus-visible:ring-brand-purple"
                value={formData.country} 
                onChange={e => setFormData({...formData, country: e.target.value})} 
                placeholder="e.g. Germany"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Country Code (ISO 2-letter, Optional)</Label>
              <Input 
                maxLength={2}
                className="border-gray-300 focus-visible:ring-brand-purple uppercase"
                value={formData.countryCode} 
                onChange={e => setFormData({...formData, countryCode: e.target.value.toUpperCase()})} 
                placeholder="e.g. DE, JP, US"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Active / Hidden Status</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple"
                value={formData.isActive ? 'true' : 'false'}
                onChange={e => setFormData({...formData, isActive: e.target.value === 'true'})}
              >
                <option value="true">Active (Visible)</option>
                <option value="false">Hidden (Draft / Inactive)</option>
              </select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label className="text-gray-700 font-semibold">External Website / Application Link</Label>
              <Input 
                className="border-gray-300 focus-visible:ring-brand-purple"
                value={formData.externalUrl} 
                onChange={e => setFormData({...formData, externalUrl: e.target.value})} 
                placeholder="https://example.com/apply"
                maxLength={2048}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-gray-700 font-semibold">PDF Attachment (5.44)</Label>
              <div className="flex items-center gap-4">
                <Input 
                  type="file"
                  accept=".pdf"
                  className="border-gray-300 focus-visible:ring-brand-purple cursor-pointer flex-1"
                  onChange={e => handleFileUpload(e.target.files[0])}
                />
                {formData.attachmentUrl && (
                  <div className="flex items-center gap-2">
                    <a 
                      href={resolveMediaUrl(formData.attachmentUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-brand-purple hover:underline font-semibold"
                    >
                      View PDF ↗
                    </a>
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, attachmentUrl: '' }))}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              {uploadingDoc && <p className="text-xs text-brand-purple animate-pulse mt-1">Uploading document...</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Application Deadline (Optional)</Label>
              <Input 
                type="datetime-local"
                className="border-gray-300 focus-visible:ring-brand-purple"
                value={formData.applicationDeadline} 
                onChange={e => setFormData({...formData, applicationDeadline: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Publish Date (Optional, defaults to now)</Label>
              <Input 
                type="datetime-local"
                className="border-gray-300 focus-visible:ring-brand-purple"
                value={formData.publishedAt} 
                onChange={e => setFormData({...formData, publishedAt: e.target.value})} 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-gray-700 font-semibold">Visible Until (Optional, auto-ends)</Label>
              <Input 
                type="datetime-local"
                className="border-gray-300 focus-visible:ring-brand-purple"
                value={formData.visibleUntil} 
                onChange={e => setFormData({...formData, visibleUntil: e.target.value})} 
              />
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
          <h2 className="text-2xl font-bold text-gray-900">Opportunities Management</h2>
          <p className="text-sm text-gray-500">Manage scholarships, exchange calls, internships, and grants</p>
        </div>
        <Button onClick={openCreate} className="bg-brand-purple hover:bg-brand-purpleDark">Add Opportunity</Button>
      </div>

      {/* Filters (5.47) */}
      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm items-center">
        <div className="w-48">
          <Label className="text-xs font-semibold text-gray-500 mb-1 block">Filter by Audience</Label>
          <select
            className="w-full text-sm border border-gray-300 rounded-md p-2"
            value={audienceFilter}
            onChange={(e) => {
              setAudienceFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Audiences</option>
            <option value="STUDENT">Student</option>
            <option value="FACULTY">Faculty</option>
            <option value="BOTH">Both</option>
          </select>
        </div>

        <div className="w-48">
          <Label className="text-xs font-semibold text-gray-500 mb-1 block">Filter by Category</Label>
          <select
            className="w-full text-sm border border-gray-300 rounded-md p-2"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Categories</option>
            <option value="SCHOLARSHIP">Scholarship</option>
            <option value="EXCHANGE">Exchange</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="RESEARCH">Research</option>
            <option value="FELLOWSHIP">Fellowship</option>
            <option value="CONFERENCE">Conference</option>
            <option value="GRANT">Grant</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {(audienceFilter || categoryFilter) && (
          <div className="self-end pb-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAudienceFilter('');
                setCategoryFilter('');
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Audience</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Links</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">Loading opportunities...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No opportunities found.</TableCell></TableRow>
            ) : (
              data.map(item => {
                const status = getComputedStatus(item);
                return (
                  <TableRow key={item.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium text-gray-900 max-w-xs truncate" title={item.title}>
                      <div>{item.title}</div>
                      {item.organisation && <div className="text-xs text-gray-400 font-normal">{item.organisation}</div>}
                    </TableCell>
                    <TableCell>
                      <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-xs font-medium border border-blue-200">
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-md text-xs font-medium border border-gray-200">
                        {item.audience}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${status.color}`}>
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex flex-col gap-1">
                        {item.externalUrl || item.url ? (
                          <a 
                            href={item.externalUrl || item.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-xs text-brand-purple hover:underline font-semibold inline-flex items-center gap-1"
                          >
                            Web Link ↗
                          </a>
                        ) : null}
                        {item.attachmentUrl && (
                          <a 
                            href={resolveMediaUrl(item.attachmentUrl)} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-xs text-brand-purpleDark hover:underline font-semibold inline-flex items-center gap-1"
                          >
                            PDF Document ↗
                          </a>
                        )}
                        {!item.externalUrl && !item.url && !item.attachmentUrl && (
                          <span className="text-xs text-gray-400">None</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                      <Button variant="outline" size="sm" onClick={() => openEdit(item)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
        <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>
    </div>
  );
}
