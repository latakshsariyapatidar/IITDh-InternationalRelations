import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AdminFormLayout from '../../components/admin/AdminFormLayout';
import { formatApiError } from '../../utils/formErrors';

export default function Faculty() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 50;
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', designation: '', department: '', photoUrl: '', email: '', redirectUrl: '', isPortalEnabled: 'true', isActive: 'true' });
  // The photo currently stored on the record being edited.
  const [savedPhotoUrl, setSavedPhotoUrl] = useState('');

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
    setFormData({ name: '', designation: '', department: '', photoUrl: '', email: '', redirectUrl: '', isPortalEnabled: 'true', isActive: 'true' });
    setSavedPhotoUrl('');
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      name: item.name || '',
      designation: item.designation || '',
      department: item.department || '',
      photoUrl: item.photoUrl || '',
      email: item.email || '',
      redirectUrl: item.redirectUrl || '',
      isPortalEnabled: item.isPortalEnabled !== false ? 'true' : 'false',
      isActive: item.isActive ? 'true' : 'false',
    });
    setSavedPhotoUrl(item.photoUrl || '');
    setIsFormOpen(true);
  };

  // A photo this form uploaded but hasn't saved is referenced by nothing, so it
  // can be deleted straight away. The saved photo is deleted only after Save
  // succeeds, so cancelling never leaves the record pointing at a missing file.
  const discardUnsavedPhoto = async (url) => {
    if (!url || url === savedPhotoUrl || !url.startsWith('/uploads')) return;
    try {
      await apiClient.delete(`/uploads?url=${encodeURIComponent(url)}`);
    } catch (err) {
      console.error('Failed to delete unsaved photo', err);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await apiClient.post('/uploads/image/faculty', fd);
      const newUrl = res.data?.data?.url;
      await discardUnsavedPhoto(formData.photoUrl);
      setFormData(prev => ({ ...prev, photoUrl: newUrl }));
    } catch (err) {
      console.error(err);
      alert('Photo upload failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRemovePhoto = async () => {
    await discardUnsavedPhoto(formData.photoUrl);
    setFormData(prev => ({ ...prev, photoUrl: '' }));
  };

  const handleCancel = async () => {
    await discardUnsavedPhoto(formData.photoUrl);
    setIsFormOpen(false);
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
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }
    if (!formData.redirectUrl.trim()) {
      alert('Profile URL is required');
      return;
    }
    if (formData.email && formData.email.trim() && !formData.email.trim().toLowerCase().endsWith('@iitdh.ac.in')) {
      alert('Faculty email must end with @iitdh.ac.in');
      return;
    }

    setSaveLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        designation: formData.designation.trim() || null,
        department: formData.department.trim() || null,
        photoUrl: formData.photoUrl || null,
        redirectUrl: formData.redirectUrl.trim(),
        isPortalEnabled: formData.isPortalEnabled === 'true',
        isActive: formData.isActive === 'true',
      };
      // 5.31: Omit email on create when empty so backend validation doesn't reject null
      if (formData.email && formData.email.trim()) {
        payload.email = formData.email.trim().toLowerCase();
      } else if (currentId) {
        payload.email = null;
      }

      if (currentId) await apiClient.patch(`/faculty/${currentId}`, payload);
      else await apiClient.post('/faculty', payload);
      if (savedPhotoUrl && savedPhotoUrl !== formData.photoUrl && savedPhotoUrl.startsWith('/uploads')) {
        try {
          await apiClient.delete(`/uploads?url=${encodeURIComponent(savedPhotoUrl)}`);
        } catch (err) {
          console.error('Failed to delete replaced photo', err);
        }
      }
      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(formatApiError(err, 'Failed to save faculty'));
    } finally {
      setSaveLoading(false);
    }
  };

  if (isFormOpen) {
    return (
      <AdminFormLayout
        title={currentId ? 'Edit Faculty Details' : 'Add New Faculty'}
        subtitle="Manage details and portal login permissions for this faculty member."
        stepName="Faculty Info"
        onCancel={handleCancel}
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
              placeholder="Prof. Jane Doe"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Designation</Label>
              <Input
                className="border-gray-300 focus-visible:ring-brand-purple"
                maxLength={200}
                value={formData.designation}
                onChange={e => setFormData({...formData, designation: e.target.value})}
                placeholder="Associate Professor"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Department</Label>
              <Input
                className="border-gray-300 focus-visible:ring-brand-purple"
                maxLength={200}
                value={formData.department}
                onChange={e => setFormData({...formData, department: e.target.value})}
                placeholder="Computer Science and Engineering"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">IITDH Email ID</Label>
            <Input 
              type="email" 
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              placeholder="prof.jane@iitdh.ac.in" 
            />
            <p className="text-xs text-gray-500">
              Doubles as the Faculty Portal allowlist. When this user logs in via Google with this @iitdh.ac.in account, they are assigned the <strong>faculty</strong> role.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Profile URL <span className="text-red-500">*</span></Label>
            <Input 
              type="url" 
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.redirectUrl} 
              onChange={e => setFormData({...formData, redirectUrl: e.target.value})} 
              placeholder="https://www.iitdh.ac.in/faculty/..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Photo</Label>
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-2">
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="border-gray-300 focus-visible:ring-brand-purple cursor-pointer"
                  onChange={e => handleImageUpload(e.target.files[0])}
                />
                <p className="text-xs text-gray-500">Shown on the faculty card on the public About page. JPEG, PNG, WEBP or GIF, up to 10 MB.</p>
              </div>
              {formData.photoUrl && (
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200 bg-white">
                    <img src={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${formData.photoUrl}`} className="w-full h-full object-cover" alt="Preview"/>
                  </div>
                  <button type="button" onClick={handleRemovePhoto} className="text-xs text-red-600 hover:underline">Remove photo</button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Faculty Portal Access</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple"
                value={formData.isPortalEnabled} 
                onChange={e => setFormData({...formData, isPortalEnabled: e.target.value})}
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
              <p className="text-xs text-gray-500">Allow logging into /faculty-portal</p>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Directory Status</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple"
                value={formData.isActive} 
                onChange={e => setFormData({...formData, isActive: e.target.value})}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <p className="text-xs text-gray-500">Visible on public About page</p>
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
          <h2 className="text-2xl font-bold text-gray-900">Faculty Management</h2>
          <p className="text-sm text-gray-500">Manage faculty directory entries and portal login allowlist.</p>
        </div>
        <Button onClick={openCreate} className="bg-brand-purple hover:bg-brand-purpleDark">Add Faculty</Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">IITDH Email / Allowlist</TableHead>
              <TableHead className="font-semibold">Profile URL</TableHead>
              <TableHead className="font-semibold">Portal Access</TableHead>
              <TableHead className="font-semibold">Active</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">Loading faculty...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No faculty found.</TableCell></TableRow>
            ) : data.map(item => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-gray-900">
                    <div className="flex items-center gap-3">
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
                      <div>
                        <div>{item.name}</div>
                        {(item.designation || item.department) && (
                          <div className="text-xs font-normal text-gray-500">
                            {[item.designation, item.department].filter(Boolean).join(' · ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.email ? (
                      <span className="text-xs font-mono bg-purple-50 text-brand-purpleDark px-2 py-1 rounded border border-purple-100">
                        {item.email}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 italic">No email linked</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <a href={item.redirectUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center gap-1 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      Visit Link
                    </a>
                  </TableCell>
                  <TableCell>
                    {item.isPortalEnabled !== false ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md text-xs font-medium border border-emerald-200">Enabled</span>
                    ) : (
                      <span className="text-rose-700 bg-rose-50 px-2 py-1 rounded-md text-xs font-medium border border-rose-200">Disabled</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.isActive ? (
                      <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-medium border border-green-200">Active</span>
                    ) : (
                      <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-md text-xs font-medium border border-gray-200">Inactive</span>
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
