import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';

export default function Applications() {
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

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/applications?page=${page}&limit=${limit}`);
      setData(res.data?.data?.applications || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      console.error(err);
      alert('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page]);

  const openReview = (app) => {
    setSelectedApp(app);
    setStatus(app.status || 'SUBMITTED');
    setReviewNotes(app.reviewNotes || '');
    setIsDialogOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await apiClient.patch(`/applications/${selectedApp.id}`, {
        status,
        reviewNotes
      });
      setIsDialogOpen(false);
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert('Failed to update application');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to completely delete this application and all its uploaded documents? This cannot be undone.')) return;
    try {
      await apiClient.delete(`/applications/${id}`);
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert('Failed to delete application');
    }
  };

  // Checklist Item 8: Secure Document Fetching
  const downloadDocument = async (appId, field) => {
    try {
      // We must fetch with Authorization header, we cannot just open a new tab to the URL
      const res = await apiClient.get(`/applications/${appId}/documents/${field}`, {
        responseType: 'blob' // Important to handle the binary stream
      });
      
      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Extract filename from content-disposition if possible, else generic
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
        <h2 className="text-2xl font-bold">Inbound Applications</h2>
      </div>

      <div className="bg-white border rounded-md shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant Name</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-4">Loading...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-4">No applications found.</TableCell></TableRow>
            ) : (
              data.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.firstName} {item.lastName}</TableCell>
                  <TableCell>{item.programLevel} - {item.programAppliedFor}</TableCell>
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

      {/* Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
          </DialogHeader>
          
          {selectedApp && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-semibold">Name:</span> {selectedApp.firstName} {selectedApp.lastName}</div>
                <div><span className="font-semibold">Email:</span> {selectedApp.email}</div>
                <div><span className="font-semibold">Nationality:</span> {selectedApp.nationality}</div>
                <div><span className="font-semibold">Program:</span> {selectedApp.programAppliedFor}</div>
                <div><span className="font-semibold">Intended Intake:</span> {selectedApp.intendedIntake}</div>
                <div><span className="font-semibold">Requires Visa:</span> {selectedApp.requiresVisaSponsorship ? 'Yes' : 'No'}</div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Documents</h4>
                <div className="flex flex-wrap gap-2">
                  {['passportCopy', 'photo', 'academicTranscripts', 'englishTestScoreCard', 'statementOfPurpose', 'financialProof', 'recommendationLetter'].map(field => (
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
                <p className="text-xs text-gray-500 mt-2">Note: If a document wasn't uploaded, the download request will fail.</p>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    <option value="SUBMITTED">Submitted</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="DOCUMENTS_REQUESTED">Documents Requested</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="WAITLISTED">Waitlisted</option>
                    <option value="WITHDRAWN">Withdrawn</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Review Notes (Internal)</Label>
                  <textarea 
                    className="w-full p-2 border rounded-md" 
                    rows="3"
                    value={reviewNotes} 
                    onChange={e => setReviewNotes(e.target.value)} 
                    placeholder="Add private notes regarding this application..."
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
