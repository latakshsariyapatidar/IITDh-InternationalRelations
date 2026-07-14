import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AdminFormLayout from '../../components/admin/AdminFormLayout';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function Team() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 50;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', year: '', photoUrl: '', email: '', responsibilities: '', isActive: 'true' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/team?page=${page}&limit=${limit}`);
      setData(res.data?.data?.team || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      console.error(err);
      alert('Failed to load team');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const openCreate = () => {
    setCurrentId(null);
    setFormData({ name: '', role: '', year: '', photoUrl: '', email: '', responsibilities: '', isActive: 'true' });
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      name: item.name,
      role: item.role,
      year: item.year || '',
      photoUrl: item.photoUrl || '',
      email: item.email || '',
      responsibilities: item.responsibilities || '',
      isActive: item.isActive ? 'true' : 'false',
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    try {
      await apiClient.delete(`/team/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete team member');
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await apiClient.post('/uploads/image/team', fd);
      const newUrl = res.data?.data?.url;
      if (formData.photoUrl && formData.photoUrl.startsWith('/uploads')) {
        try { await apiClient.delete(`/uploads?url=${encodeURIComponent(formData.photoUrl)}`); } catch(e){}
      }
      setFormData(prev => ({ ...prev, photoUrl: newUrl }));
    } catch (err) { alert('Image upload failed: ' + (err.response?.data?.message || err.message)); }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const payload = { ...formData, isActive: formData.isActive === 'true' };
      if (!payload.photoUrl) delete payload.photoUrl;
      if (!payload.email) delete payload.email;
      if (!payload.responsibilities || payload.responsibilities === '<p><br></p>') delete payload.responsibilities;

      if (currentId) await apiClient.patch(`/team/${currentId}`, payload);
      else await apiClient.post('/team', payload);
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
        title={currentId ? 'Edit Team Member' : 'Add New Member'}
        subtitle="Provide the details for this team member."
        stepName="Member Info"
        onCancel={() => setIsFormOpen(false)}
        onSave={handleSave}
        loading={saveLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Name <span className="text-red-500">*</span></Label>
            <Input 
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.name} 
              onChange={e=>setFormData({...formData, name: e.target.value})} 
              placeholder="e.g. Dr. Jane Smith"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Role <span className="text-red-500">*</span></Label>
            <Input 
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.role} 
              onChange={e=>setFormData({...formData, role: e.target.value})} 
              placeholder="e.g. Chairperson"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Year <span className="text-red-500">*</span></Label>
            <Input 
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.year} 
              onChange={e=>setFormData({...formData, year: e.target.value})} 
              placeholder="e.g. 2023-2024" 
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Email (Optional)</Label>
            <Input 
              type="email"
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.email} 
              onChange={e=>setFormData({...formData, email: e.target.value})} 
              placeholder="e.g. jane@iitdh.ac.in" 
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Responsibilities (Optional)</Label>
            <div className="bg-white">
              <ReactQuill 
                theme="snow"
                value={formData.responsibilities} 
                onChange={(value) => setFormData({...formData, responsibilities: value})} 
                placeholder="e.g. Managing international agreements and student mobility..."
                className="h-32 mb-10"
              />
            </div>
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Profile Photo</Label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <Input 
                  type="file" 
                  accept="image/*" 
                  className="border-gray-300 focus-visible:ring-brand-purple cursor-pointer"
                  onChange={e => handleImageUpload(e.target.files[0])} 
                />
              </div>
              {formData.photoUrl && (
                <div className="shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center p-2">
                  <img src={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${formData.photoUrl}`} className="w-full h-full object-cover rounded-md" alt="Preview"/>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Status</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple"
              value={formData.isActive} 
              onChange={e=>setFormData({...formData, isActive: e.target.value})}
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
        <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
        <Button onClick={openCreate} className="bg-brand-purple hover:bg-brand-purpleDark">Add Member</Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Year</TableHead>
              <TableHead className="font-semibold">Active</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">Loading team...</TableCell></TableRow> : data.map(item => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium flex items-center gap-3 text-gray-900">
                    <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-white flex items-center justify-center shrink-0">
                      {item.photoUrl ? (
                        <img 
                          src={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${item.photoUrl}`} 
                          alt="" 
                          className="w-full h-full object-cover"
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
                      {item.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">{item.email || '-'}</TableCell>
                  <TableCell className="text-gray-600">{item.year || '-'}</TableCell>
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
            ))}
            {!loading && data.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No team members found.</TableCell></TableRow>
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
