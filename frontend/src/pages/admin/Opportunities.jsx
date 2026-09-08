import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AdminFormLayout from '../../components/admin/AdminFormLayout';

export default function Opportunities() {
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
    description: '',
    externalUrl: '',
    category: 'SCHOLARSHIP',
    audience: 'STUDENT',
    publishedAt: '',
    visibleUntil: '',
    applicationDeadline: '',
    organisation: '',
    country: ''
  });

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/opportunities?page=${page}&limit=${limit}`);
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
  }, [page]);

  const openCreate = () => {
    setCurrentId(null);
    setFormData({ 
      title: '', description: '', externalUrl: '', 
      category: 'SCHOLARSHIP', audience: 'STUDENT', 
      publishedAt: '', visibleUntil: '', applicationDeadline: '',
      organisation: '', country: '' 
    });
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      externalUrl: item.externalUrl || item.url || '',
      category: item.category || 'SCHOLARSHIP',
      audience: item.audience || 'STUDENT',
      publishedAt: item.publishedAt ? item.publishedAt.split('T')[0] : '',
      visibleUntil: item.visibleUntil ? item.visibleUntil.split('T')[0] : '',
      applicationDeadline: item.applicationDeadline ? item.applicationDeadline.split('T')[0] : '',
      organisation: item.organisation || '',
      country: item.country || ''
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

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      let formattedUrl = formData.externalUrl.trim();
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
        publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null,
        visibleUntil: formData.visibleUntil ? new Date(formData.visibleUntil).toISOString() : null,
        applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline).toISOString() : null,
        organisation: formData.organisation.trim() || null,
        country: formData.country.trim() || null
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

  if (isFormOpen) {
    return (
      <AdminFormLayout
        title={currentId ? 'Edit Opportunity' : 'New Opportunity'}
        subtitle="Manage the details of this opportunity."
        stepName="Opportunity Info"
        onCancel={() => setIsFormOpen(false)}
        onSave={handleSave}
        loading={saveLoading}
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
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-gray-700 font-semibold">Description</Label>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-colors resize-none" 
                rows="4"
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="Opportunity details..."
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label className="text-gray-700 font-semibold">External Website / Application Link</Label>
              <Input 
                className="border-gray-300 focus-visible:ring-brand-purple"
                value={formData.externalUrl} 
                onChange={e => setFormData({...formData, externalUrl: e.target.value})} 
                placeholder="https://example.com/apply" 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Application Deadline</Label>
              <Input 
                type="date"
                className="border-gray-300 focus-visible:ring-brand-purple"
                value={formData.applicationDeadline} 
                onChange={e => setFormData({...formData, applicationDeadline: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Organisation / University</Label>
              <Input 
                className="border-gray-300 focus-visible:ring-brand-purple"
                value={formData.organisation} 
                onChange={e => setFormData({...formData, organisation: e.target.value})} 
                placeholder="e.g. DAAD, European Commission" 
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
              <Label className="text-gray-700 font-semibold">Publish Date</Label>
              <Input 
                type="date"
                className="border-gray-300 focus-visible:ring-brand-purple"
                value={formData.publishedAt} 
                onChange={e => setFormData({...formData, publishedAt: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Visible Until</Label>
              <Input 
                type="date"
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Opportunities Management</h2>
        <Button onClick={openCreate} className="bg-brand-purple hover:bg-brand-purpleDark">Add Opportunity</Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Audience</TableHead>
              <TableHead className="font-semibold">External Link</TableHead>
              <TableHead className="font-semibold">Visible</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">Loading opportunities...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No opportunities found.</TableCell></TableRow>
            ) : (
              data.map(item => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-gray-900">{item.title}</TableCell>
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
                    {item.externalUrl || item.url ? (
                      <a 
                        href={item.externalUrl || item.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-xs text-brand-purple hover:underline font-semibold inline-flex items-center gap-1"
                      >
                        Visit Link ↗
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'Draft'}
                    {item.visibleUntil ? ` - ${new Date(item.visibleUntil).toLocaleDateString()}` : ''}
                  </TableCell>
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

      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
        <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>
    </div>
  );
}
