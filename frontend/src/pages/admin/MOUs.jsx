import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AdminFormLayout from '../../components/admin/AdminFormLayout';

export default function MOUs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState({ partnerId: '', title: '', signedDate: '', expiryDate: '', status: 'ACTIVE', scope: '', documentPath: '', isPublic: 'true' });
  const [partners, setPartners] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/mous?page=${page}&limit=${limit}`);
      setData(res.data?.data?.mous || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);

      if (partners.length === 0) {
        const pRes = await apiClient.get('/partners?limit=100');
        setPartners(pRes.data?.data?.partners || []);
      }
    } catch (err) { alert('Failed to load MOUs'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [page]);

  const openCreate = () => {
    setCurrentId(null);
    setFormData({ partnerId: partners[0]?.id || '', title: '', signedDate: '', expiryDate: '', status: 'ACTIVE', scope: '', documentPath: '', isPublic: 'true' });
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      partnerId: item.partnerId, title: item.title, 
      signedDate: item.signedDate ? item.signedDate.split('T')[0] : '', 
      expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '', 
      status: item.status, scope: item.scope || '', documentPath: item.documentPath || '',
      isPublic: item.isPublic !== false ? 'true' : 'false',
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete MOU?')) return;
    try { await apiClient.delete(`/mous/${id}`); fetchData(); } catch (err) {}
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await apiClient.post('/uploads/document/mous', fd);
      const newUrl = res.data?.data?.url;
      if (formData.documentPath && formData.documentPath.startsWith('/uploads')) {
        try { await apiClient.delete(`/uploads?url=${encodeURIComponent(formData.documentPath)}`); } catch(e){}
      }
      setFormData(prev => ({ ...prev, documentPath: newUrl }));
    } catch (err) { alert('Upload failed'); }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const payload = { ...formData, isPublic: formData.isPublic === 'true' };
      if (!payload.scope) delete payload.scope;
      if (!payload.documentPath) delete payload.documentPath;
      if (payload.signedDate) payload.signedDate = new Date(payload.signedDate).toISOString();
      if (payload.expiryDate) payload.expiryDate = new Date(payload.expiryDate).toISOString();
      else delete payload.expiryDate;

      if (currentId) await apiClient.patch(`/mous/${currentId}`, payload);
      else await apiClient.post('/mous', payload);
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
        title={currentId ? 'Edit MOU Details' : 'Create New MOU'}
        subtitle="Manage the details of this Memorandum of Understanding."
        stepName="MOU Details"
        onCancel={() => setIsFormOpen(false)}
        onSave={handleSave}
        loading={saveLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">MOU Title <span className="text-red-500">*</span></Label>
            <Input className="border-gray-300 focus-visible:ring-brand-purple" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="Enter MOU title" />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Partner Institution <span className="text-red-500">*</span></Label>
            <select className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple" value={formData.partnerId} onChange={e=>setFormData({...formData, partnerId: e.target.value})}>
              {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Signed Date <span className="text-red-500">*</span></Label>
            <Input type="date" className="border-gray-300 focus-visible:ring-brand-purple" value={formData.signedDate} onChange={e=>setFormData({...formData, signedDate: e.target.value})} />
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Expiry Date</Label>
            <Input type="date" className="border-gray-300 focus-visible:ring-brand-purple" value={formData.expiryDate} onChange={e=>setFormData({...formData, expiryDate: e.target.value})} />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Status</Label>
            <select className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple" value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="EXPIRED">EXPIRED</option>
              <option value="RENEWED">RENEWED</option>
              <option value="TERMINATED">TERMINATED</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Visibility</Label>
            <select className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple" value={formData.isPublic} onChange={e=>setFormData({...formData, isPublic: e.target.value})}>
              <option value="true">Public (Visible on Website)</option>
              <option value="false">Private (Hidden)</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Scope of MOU</Label>
            <textarea className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-colors resize-none" rows="3" value={formData.scope} onChange={e=>setFormData({...formData, scope: e.target.value})} placeholder="Describe the scope of collaboration..." />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">MOU Document (PDF)</Label>
            <div className="flex items-center gap-4">
              <Input type="file" accept=".pdf" className="border-gray-300 focus-visible:ring-brand-purple cursor-pointer flex-1" onChange={e => handleFileUpload(e.target.files[0])} />
              {formData.documentPath && <span className="text-xs text-brand-purple font-medium truncate w-32">File uploaded</span>}
            </div>
          </div>
        </div>
      </AdminFormLayout>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">MOUs Management</h2>
        <Button onClick={openCreate} className="bg-brand-purple hover:bg-brand-purpleDark">Add New MOU</Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Partner</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-500">Loading MOUs...</TableCell></TableRow> : data.map(item => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-gray-900">{item.title}</TableCell>
                  <TableCell className="text-gray-600">{item.partner?.name}</TableCell>
                  <TableCell>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-brand-purpleLight/20 text-brand-purple">
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(item)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
            ))}
            {!loading && data.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-500">No MOUs found.</TableCell></TableRow>
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
