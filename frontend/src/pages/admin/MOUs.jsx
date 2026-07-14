import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';

export default function MOUs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ partnerId: '', title: '', signedDate: '', expiryDate: '', status: 'ACTIVE', scope: '', documentPath: '' });
  const [partners, setPartners] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/mous?page=${page}&limit=${limit}`);
      setData(res.data?.data?.mous || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);

      // Fetch partners for the dropdown if not loaded
      if (partners.length === 0) {
        const pRes = await apiClient.get('/partners?limit=100');
        setPartners(pRes.data?.data?.partners || []);
      }
    } catch (err) { alert('Failed to load MOUs'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [page]);

  const openCreate = () => {
    setCurrentId(null);
    setFormData({ partnerId: partners[0]?.id || '', title: '', signedDate: '', expiryDate: '', status: 'ACTIVE', scope: '', documentPath: '' });
    setIsDialogOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      partnerId: item.partnerId, title: item.title, 
      signedDate: item.signedDate ? item.signedDate.split('T')[0] : '', 
      expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '', 
      status: item.status, scope: item.scope || '', documentPath: item.documentPath || '',
    });
    setIsDialogOpen(true);
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
    try {
      const payload = { ...formData };
      if (!payload.scope) delete payload.scope;
      if (!payload.documentPath) delete payload.documentPath;
      if (payload.signedDate) payload.signedDate = new Date(payload.signedDate).toISOString();
      if (payload.expiryDate) payload.expiryDate = new Date(payload.expiryDate).toISOString();

      if (currentId) await apiClient.patch(`/mous/${currentId}`, payload);
      else await apiClient.post('/mous', payload);
      setIsDialogOpen(false); fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Save failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h2 className="text-2xl font-bold">MOUs</h2><Button onClick={openCreate}>Add MOU</Button></div>
      <div className="bg-white border rounded-md shadow-sm">
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Partner</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={4} className="text-center py-4">Loading...</TableCell></TableRow> : data.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell><TableCell>{item.partner?.name}</TableCell><TableCell>{item.status}</TableCell>
                  <TableCell className="text-right space-x-2"><Button variant="outline" size="sm" onClick={() => openEdit(item)}>Edit</Button><Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button></TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between"><Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button><Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button></div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{currentId ? 'Edit MOU' : 'New MOU'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2"><Label>Title</Label><Input value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} /></div>
            <div className="space-y-2"><Label>Partner</Label>
              <select className="w-full p-2 border rounded-md" value={formData.partnerId} onChange={e=>setFormData({...formData, partnerId: e.target.value})}>
                {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Signed Date</Label><Input type="date" value={formData.signedDate} onChange={e=>setFormData({...formData, signedDate: e.target.value})} /></div>
              <div className="space-y-2"><Label>Expiry Date</Label><Input type="date" value={formData.expiryDate} onChange={e=>setFormData({...formData, expiryDate: e.target.value})} /></div>
            </div>
            <div className="space-y-2"><Label>Status</Label>
              <select className="w-full p-2 border rounded-md" value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})}>
                <option value="ACTIVE">ACTIVE</option><option value="EXPIRED">EXPIRED</option><option value="PENDING">PENDING</option>
              </select>
            </div>
            <div className="space-y-2"><Label>Scope</Label><textarea className="w-full p-2 border rounded-md" rows="2" value={formData.scope} onChange={e=>setFormData({...formData, scope: e.target.value})} /></div>
            <div className="space-y-2"><Label>Document (PDF)</Label><Input type="file" accept=".pdf" onChange={e => handleFileUpload(e.target.files[0])} />{formData.documentPath && <p className="text-xs">Current: {formData.documentPath}</p>}</div>
          </div>
          <DialogFooter><Button onClick={handleSave}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
