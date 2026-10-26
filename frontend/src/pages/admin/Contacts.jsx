import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AdminFormLayout from '../../components/admin/AdminFormLayout';
import { optionalText } from '../../utils/formPayload';
import { formatApiError } from '../../utils/formErrors';
import { resolveMediaUrl } from '../../utils/media';

export default function Contacts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // The photo currently stored on the record being edited.
  const [savedPhotoUrl, setSavedPhotoUrl] = useState('');

  const [formData, setFormData] = useState({ type: 'IRO_OFFICE', name: '', title: '', email: '', phone: '', address: '', photoUrl: '', isActive: 'true' });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Contacts doesn't paginate according to docs
      const res = await apiClient.get(`/contacts`);
      setData(res.data?.data?.contacts || res.data?.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setCurrentId(null);
    setFormData({ type: 'IRO_OFFICE', name: '', title: '', email: '', phone: '', address: '', photoUrl: '', isActive: 'true' });
    setSavedPhotoUrl('');
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      type: item.type,
      name: item.name || '',
      title: item.title,
      email: item.email,
      phone: item.phone || '',
      address: item.address || '',
      photoUrl: item.photoUrl || '',
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
      const res = await apiClient.post('/uploads/image/contacts', fd);
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
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
      await apiClient.delete(`/contacts/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete contact');
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      // name, phone and address are optional strings: "" clears one on an
      // edit, and null is rejected.
      const isEdit = Boolean(currentId);
      const payload = {
        type: formData.type,
        title: formData.title.trim(),
        email: formData.email.trim(),
        name: optionalText(formData.name, isEdit),
        phone: optionalText(formData.phone, isEdit),
        address: optionalText(formData.address, isEdit),
        photoUrl: formData.photoUrl || null,
        isActive: formData.isActive === 'true'
      };

      if (currentId) await apiClient.patch(`/contacts/${currentId}`, payload);
      else await apiClient.post('/contacts', payload);
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
      alert(formatApiError(err, 'Failed to save contact'));
    } finally {
      setSaveLoading(false);
    }
  };

  if (isFormOpen) {
    return (
      <AdminFormLayout
        title={currentId ? 'Edit Contact' : 'New Contact'}
        subtitle="Manage the details of this contact."
        stepName="Contact Info"
        onCancel={handleCancel}
        onSave={handleSave}
        loading={saveLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Type</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple"
              value={formData.type} 
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="CHAIRPERSON">Chairperson</option>
              <option value="IRO_OFFICE">IRO Office</option>
              <option value="MOBILITY">Mobility</option>
              <option value="ADMISSION">Admission</option>
              <option value="ADVISOR">Advisor</option>
              <option value="ASSISTANT_REGISTRAR">Assistant Registrar</option>
            </select>
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
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Title <span className="text-red-500">*</span></Label>
            <Input 
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="e.g. Head of Department" 
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Name (Optional)</Label>
            <Input 
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="e.g. Dr. Jane Smith" 
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Email <span className="text-red-500">*</span></Label>
            <Input 
              type="email" 
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              placeholder="email@iitdh.ac.in" 
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Phone (Optional)</Label>
            <Input 
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})} 
              placeholder="+91..." 
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Photo (Optional)</Label>
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-2">
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="border-gray-300 focus-visible:ring-brand-purple cursor-pointer"
                  onChange={e => handleImageUpload(e.target.files[0])}
                />
                <p className="text-xs text-gray-500">Shown on the public Contact Us page. Without one, the card shows the name's initial. JPEG, PNG, WEBP or GIF.</p>
              </div>
              {formData.photoUrl && (
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200 bg-white">
                    <img src={resolveMediaUrl(formData.photoUrl)} className="w-full h-full object-cover" alt="Preview"/>
                  </div>
                  <button type="button" onClick={handleRemovePhoto} className="text-xs text-red-600 hover:underline">Remove photo</button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Address (Optional)</Label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-colors resize-none" 
              rows="2" 
              value={formData.address} 
              onChange={e => setFormData({...formData, address: e.target.value})} 
              placeholder="Enter physical address..."
            />
          </div>
        </div>
      </AdminFormLayout>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Contacts Management</h2>
        <Button onClick={openCreate} className="bg-brand-purple hover:bg-brand-purpleDark">Add Contact</Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Name / Title</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Active</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">Loading contacts...</TableCell></TableRow> : data.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No contacts found.</TableCell></TableRow> : data.map(item => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-brand-purpleLight/20 text-brand-purple">
                      {item.type}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-white flex items-center justify-center shrink-0">
                        {item.photoUrl ? (
                          <img
                            src={resolveMediaUrl(item.photoUrl)}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {e.target.style.display='none'}}
                          />
                        ) : (
                          <span className="text-gray-400 font-bold text-xs">{(item.name || item.title).charAt(0)}</span>
                        )}
                      </div>
                      <span>{item.name ? `${item.name} - ` : ''}{item.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-blue-600 hover:underline"><a href={`mailto:${item.email}`}>{item.email}</a></TableCell>
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
    </div>
  );
}
