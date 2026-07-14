import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';

export default function Contacts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({ type: 'IRO_OFFICE', name: '', title: '', email: '', phone: '', address: '', isActive: 'true' });

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
    setFormData({ type: 'IRO_OFFICE', name: '', title: '', email: '', phone: '', address: '', isActive: 'true' });
    setIsDialogOpen(true);
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
      isActive: item.isActive ? 'true' : 'false',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
      await apiClient.delete(`/contacts/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete contact');
    }
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData, isActive: formData.isActive === 'true' };
      if (!payload.name) delete payload.name;
      if (!payload.phone) delete payload.phone;
      if (!payload.address) delete payload.address;

      if (currentId) await apiClient.patch(`/contacts/${currentId}`, payload);
      else await apiClient.post('/contacts', payload);
      setIsDialogOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save contact');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contacts</h2>
        <Button onClick={openCreate}>Add Contact</Button>
      </div>

      <div className="bg-white border rounded-md shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Name / Title</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Active?</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} className="text-center py-4">Loading...</TableCell></TableRow> : data.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-4">No contacts found.</TableCell></TableRow> : data.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.type}</TableCell>
                  <TableCell className="font-medium">{item.name ? `${item.name} - ` : ''}{item.title}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.isActive ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(item)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{currentId ? 'Edit Contact' : 'New Contact'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2">
              <Label>Type</Label>
              <select className="w-full p-2 border rounded-md" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="CHAIRPERSON">Chairperson</option>
                <option value="IRO_OFFICE">IRO Office</option>
                <option value="MOBILITY">Mobility</option>
                <option value="ADMISSION">Admission</option>
              </select>
            </div>
            <div className="space-y-2"><Label>Title (Required)</Label><Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Head of Department" /></div>
            <div className="space-y-2"><Label>Name (Optional)</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Dr. Jane Smith" /></div>
            <div className="space-y-2"><Label>Email (Required)</Label><Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@iitdh.ac.in" /></div>
            <div className="space-y-2"><Label>Phone (Optional)</Label><Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91..." /></div>
            <div className="space-y-2"><Label>Address (Optional)</Label><textarea className="w-full p-2 border rounded-md" rows="2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
            <div className="space-y-2">
              <Label>Is Active</Label>
              <select className="w-full p-2 border rounded-md" value={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.value})}>
                <option value="true">Yes</option><option value="false">No</option>
              </select>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
