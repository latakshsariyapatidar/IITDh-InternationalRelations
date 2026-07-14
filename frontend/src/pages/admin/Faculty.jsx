import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AdminFormLayout from '../../components/admin/AdminFormLayout';

export default function Faculty() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 50;
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', redirectUrl: '', isActive: 'true' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/faculty?page=${page}&limit=${limit}`);
      setData(res.data?.data?.faculty || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      console.error(err);
      alert('Failed to load faculty');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const openCreate = () => {
    setCurrentId(null);
    setFormData({ name: '', redirectUrl: '', isActive: 'true' });
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      name: item.name,
      redirectUrl: item.redirectUrl,
      isActive: item.isActive ? 'true' : 'false',
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this faculty member?')) return;
    try {
      await apiClient.delete(`/faculty/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete faculty');
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const payload = { ...formData, isActive: formData.isActive === 'true' };
      if (currentId) await apiClient.patch(`/faculty/${currentId}`, payload);
      else await apiClient.post('/faculty', payload);
      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save faculty');
    } finally {
      setSaveLoading(false);
    }
  };

  if (isFormOpen) {
    return (
      <AdminFormLayout
        title={currentId ? 'Edit Faculty Details' : 'Add New Faculty'}
        subtitle="Manage the details of this faculty member."
        stepName="Faculty Info"
        onCancel={() => setIsFormOpen(false)}
        onSave={handleSave}
        loading={saveLoading}
      >
        <div className="space-y-5 max-w-2xl">
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Name <span className="text-red-500">*</span></Label>
            <Input 
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="Prof. John Doe" 
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Profile URL <span className="text-red-500">*</span></Label>
            <Input 
              type="url" 
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.redirectUrl} 
              onChange={e => setFormData({...formData, redirectUrl: e.target.value})} 
              placeholder="https://iitdh.ac.in/..." 
            />
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
        <h2 className="text-2xl font-bold text-gray-900">Faculty Management</h2>
        <Button onClick={openCreate} className="bg-brand-purple hover:bg-brand-purpleDark">Add Faculty</Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Redirect URL</TableHead>
              <TableHead className="font-semibold">Active</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-500">Loading faculty...</TableCell></TableRow> : data.length === 0 ? <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-500">No faculty found.</TableCell></TableRow> : data.map(item => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-gray-900">{item.name}</TableCell>
                  <TableCell>
                    <a href={item.redirectUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      Visit Link
                    </a>
                  </TableCell>
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
