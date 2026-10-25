import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AdminFormLayout from '../../components/admin/AdminFormLayout';
import { compressDocument, formatBytes } from '../../utils/fileCompressor';

export default function MOUs() {
  const [data, setData] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [partnerFilter, setPartnerFilter] = useState('');
  const [expiringFilter, setExpiringFilter] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    partnerId: '', title: '', signedDate: '', expiryDate: '', 
    status: 'ACTIVE', scope: '', isPublic: 'true'
  });
  const [hasDocument, setHasDocument] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = `/mous?page=${page}&limit=${limit}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (partnerFilter) url += `&partnerId=${partnerFilter}`;
      if (expiringFilter) url += `&expiringWithinDays=${expiringFilter}`;

      const res = await apiClient.get(url);
      setData(res.data?.data?.mous || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) { 
      alert('Failed to load MOUs: ' + (err.response?.data?.message || err.message)); 
    } finally { 
      setLoading(false); 
    }
  };

  const fetchPartners = async () => {
    try {
      const res = await apiClient.get('/partners?limit=100');
      setPartners(res.data?.data?.partners || []);
    } catch (err) {}
  };

  useEffect(() => {
    fetchData();
  }, [page, statusFilter, partnerFilter, expiringFilter]);

  useEffect(() => {
    fetchPartners();
  }, []);

  const openCreate = () => {
    setCurrentId(null);
    setFormData({
      partnerId: partners[0]?.id || '', title: '', 
      signedDate: new Date().toISOString().split('T')[0], 
      expiryDate: '', status: 'ACTIVE', scope: '', isPublic: 'true'
    });
    setHasDocument(false);
    setSelectedFile(null);
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      partnerId: item.partnerId || '', title: item.title, 
      signedDate: item.signedDate ? item.signedDate.split('T')[0] : '', 
      expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '', 
      status: item.status, scope: item.scope || '',
      isPublic: item.isPublic !== false ? 'true' : 'false',
    });
    setHasDocument(Boolean(item.hasDocument));
    setSelectedFile(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this MOU?')) return;
    try { 
      await apiClient.delete(`/mous/${id}`); 
      fetchData(); 
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete MOU');
    }
  };

  const handleDownloadDoc = async (id, title) => {
    try {
      const res = await apiClient.get(`/mous/${id}/document`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `MOU_${(title || id).replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to download MOU document: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const optimized = await compressDocument(file);
      setSelectedFile(optimized);

      // If already editing an existing MOU, upload immediately
      if (currentId) {
        const fd = new FormData();
        fd.append('file', optimized);
        await apiClient.post(`/mous/${currentId}/document`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setHasDocument(true);
        alert('Document uploaded and attached successfully.');
      }
    } catch (err) {
      alert('Document upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const payload = {
        partnerId: formData.partnerId,
        title: formData.title.trim(),
        signedDate: formData.signedDate,
        status: formData.status,
        scope: formData.scope?.trim() ? formData.scope.trim() : null,
        expiryDate: formData.expiryDate ? formData.expiryDate : null,
        isPublic: formData.isPublic === 'true',
      };

      let mouId = currentId;
      if (currentId) {
        await apiClient.patch(`/mous/${currentId}`, payload);
      } else {
        const res = await apiClient.post('/mous', payload);
        mouId = res.data?.data?.id;
      }

      // If creating a new MOU and a file was chosen, upload it now
      if (!currentId && selectedFile && mouId) {
        const fd = new FormData();
        fd.append('file', selectedFile);
        await apiClient.post(`/mous/${mouId}/document`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setIsFormOpen(false); 
      setSelectedFile(null);
      fetchData();
    } catch (err) { 
      alert(err.response?.data?.message || 'Save failed'); 
    } finally { 
      setSaveLoading(false); 
    }
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
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
        saveLoading={saveLoading || uploading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">MOU Title <span className="text-red-500">*</span></Label>
            <Input className="border-gray-300 focus-visible:ring-brand-purple" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="Enter MOU title" />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Partner Institution <span className="text-red-500">*</span></Label>
            <select className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple" value={formData.partnerId} onChange={e=>setFormData({...formData, partnerId: e.target.value})}>
              <option value="">Select Partner</option>
              {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Status</Label>
            <select className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple" value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})}>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="RENEWED">Renewed</option>
              <option value="TERMINATED">Terminated</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Signed Date <span className="text-red-500">*</span></Label>
            <Input type="date" className="border-gray-300 focus-visible:ring-brand-purple" value={formData.signedDate} onChange={e=>setFormData({...formData, signedDate: e.target.value})} />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Expiry Date (Optional)</Label>
            <Input type="date" className="border-gray-300 focus-visible:ring-brand-purple" value={formData.expiryDate} onChange={e=>setFormData({...formData, expiryDate: e.target.value})} />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Visibility</Label>
            <select className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple" value={formData.isPublic} onChange={e=>setFormData({...formData, isPublic: e.target.value})}>
              <option value="true">Public (Visible on Website)</option>
              <option value="false">Private (Campus Only)</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Scope of MOU (Optional)</Label>
            <textarea className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-colors resize-none" rows="3" value={formData.scope} onChange={e=>setFormData({...formData, scope: e.target.value})} placeholder="Describe the scope of collaboration..." />
          </div>

          <div className="space-y-2 md:col-span-2 border-t pt-4">
            <Label className="text-gray-700 font-semibold">Signed MOU Document (PDF)</Label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Input type="file" accept=".pdf" className="border-gray-300 focus-visible:ring-brand-purple cursor-pointer flex-1" onChange={handleFileChange} />
              {currentId && hasDocument && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDownloadDoc(currentId, formData.title)}
                  className="text-brand-purple border-brand-purple hover:bg-brand-purple/10 whitespace-nowrap"
                >
                  Download Attached PDF
                </Button>
              )}
            </div>
            {uploading && <p className="text-xs text-brand-purple animate-pulse mt-1">Compressing and uploading document...</p>}
            {selectedFile && (
              <p className="text-xs text-green-600 mt-1">
                ✓ Document ready: {selectedFile.name} ({formatBytes(selectedFile.size)})
              </p>
            )}
          </div>
        </div>
      </AdminFormLayout>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">MOUs Management</h2>
          <p className="text-sm text-gray-500">Track and manage Memorandums of Understanding</p>
        </div>
        <Button onClick={openCreate} className="bg-brand-purple hover:bg-brand-purpleDark">Add New MOU</Button>
      </div>

      {/* Filters (5.41) */}
      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm items-center">
        <div className="w-44">
          <Label className="text-xs font-semibold text-gray-500 mb-1 block">Status</Label>
          <select
            className="w-full text-sm border border-gray-300 rounded-md p-2"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
            <option value="RENEWED">Renewed</option>
            <option value="TERMINATED">Terminated</option>
          </select>
        </div>

        <div className="w-56">
          <Label className="text-xs font-semibold text-gray-500 mb-1 block">Partner</Label>
          <select
            className="w-full text-sm border border-gray-300 rounded-md p-2 truncate"
            value={partnerFilter}
            onChange={(e) => {
              setPartnerFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Partners</option>
            {partners.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="w-48">
          <Label className="text-xs font-semibold text-gray-500 mb-1 block">Expiring In</Label>
          <select
            className="w-full text-sm border border-gray-300 rounded-md p-2"
            value={expiringFilter}
            onChange={(e) => {
              setExpiringFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Any Time</option>
            <option value="30">Within 30 Days</option>
            <option value="60">Within 60 Days</option>
            <option value="90">Within 90 Days</option>
            <option value="180">Within 180 Days</option>
            <option value="365">Within 1 Year</option>
          </select>
        </div>

        {(statusFilter || partnerFilter || expiringFilter) && (
          <div className="self-end pb-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter('');
                setPartnerFilter('');
                setExpiringFilter('');
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Table (5.40: Show signed date, expiry date, and visibility) */}
      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Partner</TableHead>
              <TableHead className="font-semibold">Signed Date</TableHead>
              <TableHead className="font-semibold">Expiry Date</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Visibility</TableHead>
              <TableHead className="font-semibold">Document</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">Loading MOUs...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">No MOUs found.</TableCell></TableRow>
            ) : (
              data.map(item => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-gray-900 max-w-xs truncate" title={item.title}>
                    {item.title}
                  </TableCell>
                  <TableCell className="text-gray-600 max-w-xs truncate">{item.partner?.name || '—'}</TableCell>
                  <TableCell className="text-gray-600 text-sm whitespace-nowrap">
                    {formatDateDisplay(item.signedDate)}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm whitespace-nowrap">
                    {formatDateDisplay(item.expiryDate)}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-700'
                        : item.status === 'EXPIRED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-brand-purpleLight/20 text-brand-purple'
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {item.isPublic !== false ? (
                      <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs font-medium border border-blue-200">Public</span>
                    ) : (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-xs font-medium border border-amber-200">Campus Only</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.hasDocument ? (
                      <button 
                        onClick={() => handleDownloadDoc(item.id, item.title)} 
                        className="text-xs text-brand-purple font-medium hover:underline flex items-center gap-1 whitespace-nowrap"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        PDF
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2 whitespace-nowrap">
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
