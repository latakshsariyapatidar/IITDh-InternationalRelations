import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';

export default function Partners() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
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
    setIsDialogOpen(true);
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
    setIsDialogOpen(true);
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
      setIsDialogOpen(false);
      fetchPartners();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save partner');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Partners</h2>
        <Button onClick={openCreate}>Add Partner</Button>
      </div>

      <div className="bg-white border rounded-md shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Active?</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-4">Loading...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-4">No partners found.</TableCell></TableRow>
            ) : (
              data.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium flex items-center gap-3">
                    {item.logoUrl && (
                      <img 
                        src={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${item.logoUrl}`} 
                        alt="Logo" 
                        className="w-8 h-8 object-contain bg-gray-50 rounded"
                        onError={(e) => {e.target.style.display='none'}}
                      />
                    )}
                    {item.name}
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.country}</TableCell>
                  <TableCell>{item.isActive ? 'Yes' : 'No'}</TableCell>
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
        <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentId ? 'Edit Partner' : 'New Partner'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="University or Org Name" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Country</Label>
                <Input 
                  value={formData.country} 
                  onChange={e => setFormData({...formData, country: e.target.value})} 
                  placeholder="e.g. Japan" 
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="UNIVERSITY">University</option>
                  <option value="ORGANIZATION">Organization</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Focus / Scope (Optional)</Label>
              <Input 
                value={formData.focus} 
                onChange={e => setFormData({...formData, focus: e.target.value})} 
                placeholder="e.g. Student Exchange" 
              />
            </div>
            <div className="space-y-2">
              <Label>Website (Optional)</Label>
              <Input 
                type="url"
                value={formData.website} 
                onChange={e => setFormData({...formData, website: e.target.value})} 
                placeholder="https://..." 
              />
            </div>
            <div className="space-y-2">
              <Label>Logo Image</Label>
              {formData.logoUrl && <p className="text-xs text-gray-500 mb-2 truncate">Current: {formData.logoUrl}</p>}
              <Input 
                type="file" 
                accept="image/*"
                onChange={e => handleImageUpload(e.target.files[0])} 
              />
            </div>
            <div className="space-y-2">
              <Label>Is Active</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={formData.isActive}
                onChange={e => setFormData({...formData, isActive: e.target.value})}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
