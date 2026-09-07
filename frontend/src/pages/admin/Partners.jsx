import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AdminFormLayout from '../../components/admin/AdminFormLayout';

export default function Partners() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    type: 'UNIVERSITY',
    focus: '',
    website: '',
    logoUrl: '',
    isActive: 'true'
  });

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/partners?page=${page}&limit=${limit}`);
      setData(res.data?.data?.partners || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      console.error(err);
      alert('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [page]);

  const openCreate = () => {
    setCurrentId(null);
    setFormData({ name: '', country: '', type: 'UNIVERSITY', focus: '', website: '', logoUrl: '', isActive: 'true' });
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      name: item.name,
      country: item.country,
      type: item.type,
      focus: item.focus || '',
      website: item.website || '',
      logoUrl: item.logoUrl || '',
      isActive: item.isActive ? 'true' : 'false',
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;
    try {
      await apiClient.delete(`/partners/${id}`);
      fetchPartners();
    } catch (err) {
      console.error(err);
      alert('Failed to delete partner');
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await apiClient.post('/uploads/image/partners', fd);
      const newUrl = res.data?.data?.url;
      
      // If we are replacing an existing image, we should delete the old one
      if (formData.logoUrl && formData.logoUrl.startsWith('/uploads')) {
        try {
          await apiClient.delete(`/uploads?url=${encodeURIComponent(formData.logoUrl)}`);
        } catch(e) {
          console.error("Failed to delete old image", e);
        }
      }

      setFormData(prev => ({ ...prev, logoUrl: newUrl }));
    } catch (err) {
      console.error(err);
      alert('Failed to upload image. Max 5MB, JPEG/PNG/WEBP/GIF only.');
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const payload = {
        ...formData,
        isActive: formData.isActive === 'true'
      };
      
      if (!payload.focus) delete payload.focus;
      if (!payload.website) delete payload.website;
      if (!payload.logoUrl) delete payload.logoUrl;

      if (currentId) {
        await apiClient.patch(`/partners/${currentId}`, payload);
      } else {
        await apiClient.post('/partners', payload);
      }
      setIsFormOpen(false);
      fetchPartners();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save partner');
    } finally {
      setSaveLoading(false);
    }
  };

  if (isFormOpen) {
    return (
      <AdminFormLayout
        title={currentId ? 'Edit Partner Details' : 'Add New Partner'}
        subtitle="Manage the details of this partner."
        stepName="Partner Info"
        onCancel={() => setIsFormOpen(false)}
        onSave={handleSave}
        loading={saveLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Partner Name <span className="text-red-500">*</span></Label>
            <Input 
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="University or Org Name" 
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Country <span className="text-red-500">*</span></Label>
            <Input 
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.country} 
              onChange={e => setFormData({...formData, country: e.target.value})} 
              placeholder="e.g. Japan" 
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Type</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="UNIVERSITY">University</option>
              <option value="ORGANIZATION">Organization</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Focus / Scope (Optional)</Label>
            <Input 
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.focus} 
              onChange={e => setFormData({...formData, focus: e.target.value})} 
              placeholder="e.g. Student Exchange" 
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Website (Optional)</Label>
            <Input 
              type="url"
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.website} 
              onChange={e => setFormData({...formData, website: e.target.value})} 
              placeholder="https://..." 
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Logo Image</Label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <Input 
                  type="file" 
                  accept="image/*"
                  className="border-gray-300 focus-visible:ring-brand-purple cursor-pointer"
                  onChange={e => handleImageUpload(e.target.files[0])} 
                />
              </div>
              {formData.logoUrl && (
                <div className="shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center p-2">
                  <img src={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${formData.logoUrl}`} className="w-full h-full object-contain" alt="Logo preview"/>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Status</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple"
              value={formData.isActive}
              onChange={e => setFormData({...formData, isActive: e.target.value})}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </AdminFormLayout>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Partners Management</h2>
        <Button onClick={openCreate} className="bg-brand-purple hover:bg-brand-purpleDark">Add Partner</Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Country</TableHead>
              <TableHead className="font-semibold">Active</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">Loading partners...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No partners found.</TableCell></TableRow>
            ) : (
              data.map(item => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium flex items-center gap-3 text-gray-900">
                    <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-white flex items-center justify-center shrink-0">
                      {item.logoUrl ? (
                        <img 
                          src={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${item.logoUrl}`} 
                          alt="Logo" 
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {e.target.style.display='none'}}
                        />
                      ) : (
                        <span className="text-gray-400 font-bold text-xs">{item.name.charAt(0)}</span>
                      )}
                    </div>
                    {item.name}
                  </TableCell>
                  <TableCell>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-brand-purpleLight/20 text-brand-purple">
                      {item.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">{item.country}</TableCell>
                  <TableCell>
                    {item.isActive ? (
                      <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-medium border border-green-200">Yes</span>
                    ) : (
                      <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-md text-xs font-medium border border-gray-200">No</span>
                    )}
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

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
        <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>
    </div>
  );
}
