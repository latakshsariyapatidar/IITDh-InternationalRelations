import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';

export default function Downloads() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', fileUrl: '', fileType: 'PDF', category: 'FORM', isPublic: 'true' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/downloads?page=${page}&limit=${limit}`);
      setData(res.data?.data?.downloads || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) { alert('Failed to load downloads'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [page]);

  const openCreate = () => {
    setCurrentId(null);
    setFormData({ title: '', description: '', fileUrl: '', fileType: 'PDF', category: 'FORM', isPublic: 'true' });
    setIsDialogOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      title: item.title, description: item.description || '', fileUrl: item.fileUrl,
      fileType: item.fileType || 'PDF', category: item.category || 'FORM', isPublic: item.isPublic ? 'true' : 'false',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete file?')) return;
    try { await apiClient.delete(`/downloads/${id}`); fetchData(); } catch (err) {}
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await apiClient.post('/uploads/document/downloads', fd);
      const newUrl = res.data?.data?.url;
      if (formData.fileUrl && formData.fileUrl.startsWith('/uploads')) {
        try { await apiClient.delete(`/uploads?url=${encodeURIComponent(formData.fileUrl)}`); } catch(e){}
      }
      setFormData(prev => ({ ...prev, fileUrl: newUrl }));
    } catch (err) { alert('Upload failed'); }
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData, isPublic: formData.isPublic === 'true' };
      if (!payload.description) delete payload.description;
      if (!payload.fileUrl) return alert("File upload is required");

      if (currentId) await apiClient.patch(`/downloads/${currentId}`, payload);
      else await apiClient.post('/downloads', payload);
      setIsDialogOpen(false); fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Save failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h2 className="text-2xl font-bold">Downloads</h2><Button onClick={openCreate}>Add File</Button></div>
      <div className="bg-white border rounded-md shadow-sm">
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>File</TableHead><TableHead>Public</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} className="text-center py-4">Loading...</TableCell></TableRow> : data.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell><TableCell>{item.category}</TableCell>
                  <TableCell><a href={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${item.fileUrl}`} target="_blank" rel="noreferrer" className="text-blue-500">View {item.fileType}</a></TableCell>
                  <TableCell>{item.isPublic ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-right space-x-2"><Button variant="outline" size="sm" onClick={() => openEdit(item)}>Edit</Button><Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button></TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between"><Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button><Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button></div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{currentId ? 'Edit' : 'New'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2"><Label>Title</Label><Input value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} /></div>
            <div className="space-y-2"><Label>Description</Label><textarea className="w-full p-2 border rounded-md" rows="2" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Category</Label><select className="w-full p-2 border rounded-md" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})}><option value="FORM">Form</option><option value="BROCHURE">Brochure</option><option value="POLICY">Policy</option><option value="OTHER">Other</option></select></div>
              <div className="space-y-2"><Label>File Type</Label><select className="w-full p-2 border rounded-md" value={formData.fileType} onChange={e=>setFormData({...formData, fileType: e.target.value})}><option value="PDF">PDF</option><option value="DOC">DOC</option><option value="IMAGE">IMAGE</option><option value="OTHER">OTHER</option></select></div>
            </div>
            <div className="space-y-2"><Label>File Upload (PDF/DOC)</Label><Input type="file" accept=".pdf,.doc,.docx" onChange={e => handleFileUpload(e.target.files[0])} />{formData.fileUrl && <p className="text-xs">Current: {formData.fileUrl}</p>}</div>
            <div className="space-y-2"><Label>Public</Label><select className="w-full p-2 border rounded-md" value={formData.isPublic} onChange={e=>setFormData({...formData, isPublic: e.target.value})}><option value="true">Yes</option><option value="false">No</option></select></div>
          </div>
          <DialogFooter><Button onClick={handleSave}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
