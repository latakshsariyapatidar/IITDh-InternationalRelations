import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';

export default function InboundExchange() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  
  // Status update state
  const [status, setStatus] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');

  // Record update state
  const [visaStatus, setVisaStatus] = useState('');
  const [frroStatus, setFrroStatus] = useState('');
  const [advisorName, setAdvisorName] = useState('');

  const fetchExchange = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/inbound-exchange?page=${page}&limit=${limit}`);
      setData(res.data?.data?.applications || res.data?.data || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      console.error(err);
      alert('Failed to load inbound exchange applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchange();
  }, [page]);

  const handleExport = async () => {
    try {
      const res = await apiClient.get('/inbound-exchange/export', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'inbound_exchange_export.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Export failed');
    }
  };

  const openReview = (app) => {
    setSelectedApp(app);
    setStatus(app.status || 'SUBMITTED');
    setReviewNotes(app.reviewNotes || '');
    setVisaStatus(app.visaStatus || '');
    setFrroStatus(app.frroStatus || '');
    setAdvisorName(app.advisorName || '');
    setIsDialogOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await apiClient.patch(`/inbound-exchange/${selectedApp.id}`, {
        status,
        reviewNotes
      });
      // Optionally update record if fields changed
      await apiClient.patch(`/inbound-exchange/${selectedApp.id}/record`, {
        visaStatus,
        frroStatus,
        advisorName
      });
      setIsDialogOpen(false);
      fetchExchange();
    } catch (err) {
      console.error(err);
      alert('Failed to update record');
    }
  };

  const downloadDocument = async (appId, field) => {
    try {
      const res = await apiClient.get(`/inbound-exchange/${appId}/documents/${field}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = res.headers['content-disposition'];
      let fileName = `${field}-${appId}`;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length === 2) fileName = fileNameMatch[1];
      }
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download document', err);
      alert('Failed to download document. It may not exist.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Inbound Exchange Register</h2>
        <Button onClick={handleExport} variant="outline" className="border-brand-purple text-brand-purple">
          Export to Excel
        </Button>
      </div>

      <div className="bg-white border rounded-md shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant Name</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-4">Loading...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-4">No records found.</TableCell></TableRow>
            ) : (
              data.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.firstName} {item.lastName}</TableCell>
                  <TableCell>{item.homeInstitution}</TableCell>
                  <TableCell>{item.nationality}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${item.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 
                        item.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openReview(item)}>Review</Button>
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
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Exchange Application</DialogTitle>
          </DialogHeader>
          
          {selectedApp && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-semibold">Name:</span> {selectedApp.firstName} {selectedApp.lastName}</div>
                <div><span className="font-semibold">Email:</span> {selectedApp.email}</div>
                <div><span className="font-semibold">Nationality:</span> {selectedApp.nationality}</div>
                <div><span className="font-semibold">Home Inst:</span> {selectedApp.homeInstitution}</div>
                <div><span className="font-semibold">Program:</span> {selectedApp.programType}</div>
                <div><span className="font-semibold">Duration:</span> {selectedApp.duration}</div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Documents</h4>
                <div className="flex flex-wrap gap-2">
                  {['passportCopy', 'photo', 'academicTranscripts', 'recommendationLetter', 'noc', 'cv'].map(field => (
                    <Button 
                      key={field} 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => downloadDocument(selectedApp.id, field)}
                    >
                      Download {field.replace(/([A-Z])/g, ' $1').trim()}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                    >
                      <option value="SUBMITTED">Submitted</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="ACCEPTED">Accepted</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Advisor Name</Label>
                    <Input 
                      value={advisorName}
                      onChange={e => setAdvisorName(e.target.value)}
                      placeholder="e.g. Dr. John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Visa Status</Label>
                    <Input 
                      value={visaStatus}
                      onChange={e => setVisaStatus(e.target.value)}
                      placeholder="e.g. Pending, Approved"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>FRRO Status</Label>
                    <Input 
                      value={frroStatus}
                      onChange={e => setFrroStatus(e.target.value)}
                      placeholder="e.g. Registered"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Review Notes (Internal)</Label>
                  <textarea 
                    className="w-full p-2 border rounded-md" 
                    rows="3"
                    value={reviewNotes} 
                    onChange={e => setReviewNotes(e.target.value)} 
                    placeholder="Add private notes..."
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Update Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
