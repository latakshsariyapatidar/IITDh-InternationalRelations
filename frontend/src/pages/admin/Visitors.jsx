import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';

export default function Visitors() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  
  const [isVerified, setIsVerified] = useState(false);

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/visitors?page=${page}&limit=${limit}`);
      setData(res.data?.data?.visitors || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      console.error(err);
      alert('Failed to load visitors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [page]);

  const handleExport = async () => {
    try {
      const res = await apiClient.get('/visitors/export', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'visitors_export.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Export failed');
    }
  };

  const openReview = (visitor) => {
    setSelectedVisitor(visitor);
    setIsVerified(visitor.isVerified || false);
    setIsDialogOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await apiClient.patch(`/visitors/${selectedVisitor.id}`, {
        isVerified
      });
      setIsDialogOpen(false);
      fetchVisitors();
    } catch (err) {
      console.error(err);
      alert('Failed to update visitor');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this visitor record?')) return;
    try {
      await apiClient.delete(`/visitors/${id}`);
      fetchVisitors();
    } catch (err) {
      console.error(err);
      alert('Failed to delete visitor');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Visitors Register</h2>
        <Button onClick={handleExport} variant="outline" className="border-brand-purple text-brand-purple">
          Export to Excel
        </Button>
      </div>

      <div className="bg-white border rounded-md shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Visit Dates</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-4">Loading...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-4">No visitors found.</TableCell></TableRow>
            ) : (
              data.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.fullName || item.name}</TableCell>
                  <TableCell>{item.organisation || item.institution}</TableCell>
                  <TableCell>{item.country}</TableCell>
                  <TableCell>
                    {item.visitFrom ? new Date(item.visitFrom).toLocaleDateString() : (item.visitDateStart ? new Date(item.visitDateStart).toLocaleDateString() : '')}
                    {(item.visitTo || item.visitDateEnd) ? ` - ${new Date(item.visitTo || item.visitDateEnd).toLocaleDateString()}` : ''}
                  </TableCell>
                  <TableCell>
                    {item.isVerified ? (
                      <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-medium border border-green-200">Yes</span>
                    ) : (
                      <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-md text-xs font-medium border border-gray-200">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openReview(item)}>Review</Button>
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
        <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Review Visitor</DialogTitle>
          </DialogHeader>
          
          {selectedVisitor && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-semibold">Name:</span> {selectedVisitor.fullName || selectedVisitor.name}</div>
                <div><span className="font-semibold">Email:</span> {selectedVisitor.email}</div>
                <div><span className="font-semibold">Institution:</span> {selectedVisitor.organisation || selectedVisitor.institution}</div>
                <div><span className="font-semibold">Country:</span> {selectedVisitor.country}</div>
                <div><span className="font-semibold">Role/Title:</span> {selectedVisitor.designation || selectedVisitor.title || 'N/A'}</div>
                <div><span className="font-semibold">Phone:</span> {selectedVisitor.phone || 'N/A'}</div>
                <div><span className="font-semibold">Host / Dept:</span> {selectedVisitor.hostName || 'N/A'}</div>
                <div>
                  <span className="font-semibold">Visit Dates:</span>{' '}
                  {selectedVisitor.visitFrom ? new Date(selectedVisitor.visitFrom).toLocaleDateString() : (selectedVisitor.visitDateStart ? new Date(selectedVisitor.visitDateStart).toLocaleDateString() : '')}
                  {(selectedVisitor.visitTo || selectedVisitor.visitDateEnd) ? ` - ${new Date(selectedVisitor.visitTo || selectedVisitor.visitDateEnd).toLocaleDateString()}` : ''}
                </div>
              </div>

              {selectedVisitor.purposeOfVisit && (
                <div className="text-sm bg-gray-50 p-3 rounded-md border text-gray-800">
                  <span className="font-semibold block mb-1 text-gray-900">Purpose of Visit:</span>
                  <p className="whitespace-pre-wrap">{selectedVisitor.purposeOfVisit}</p>
                </div>
              )}

              <div className="border-t pt-4 space-y-2">
                <Label>Verified Visit</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={isVerified.toString()}
                  onChange={e => setIsVerified(e.target.value === 'true')}
                >
                  <option value="false">No (Pending)</option>
                  <option value="true">Yes (Verified)</option>
                </select>
                <p className="text-xs text-gray-500">Marking as verified confirms the visit occurred or is approved.</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Update Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
