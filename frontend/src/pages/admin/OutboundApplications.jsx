import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { RiDownloadCloud2Line, RiFilter3Line } from '@remixicon/react';

export default function OutboundApplications() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  // 5.23: Status and partner filters
  const [statusFilter, setStatusFilter] = useState('');
  const [partnerFilter, setPartnerFilter] = useState('');
  const [partnersList, setPartnersList] = useState([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailLoadFailed, setDetailLoadFailed] = useState(false);
  
  // Status update state
  const [status, setStatus] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await apiClient.get('/partners?type=UNIVERSITY&limit=100');
        setPartnersList(res.data?.data?.partners || []);
      } catch (err) {
        console.warn('Failed to load partners for filter', err);
      }
    };
    fetchPartners();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(partnerFilter ? { partnerId: partnerFilter } : {}),
      };
      const res = await apiClient.get('/outbound-applications', { params });
      setData(res.data?.data?.applications || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      console.error(err);
      alert('Failed to load outbound applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, statusFilter, partnerFilter]);

  // 5.21: Fetch full record with GET /outbound-applications/:id before enabling save
  const openReview = async (app) => {
    setSelectedApp(app);
    setStatus(app.status || 'SUBMITTED');
    setReviewNotes('');
    setLoadingDetail(true);
    setDetailLoadFailed(false);
    setIsDialogOpen(true);

    try {
      const res = await apiClient.get(`/outbound-applications/${app.id}`);
      const fullDetail = res.data?.data || app;
      setSelectedApp(fullDetail);
      setStatus(fullDetail.status || 'SUBMITTED');
      setReviewNotes(fullDetail.reviewNotes || '');
    } catch (err) {
      console.error('Failed to load full application record:', err);
      setDetailLoadFailed(true);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await apiClient.patch(`/outbound-applications/${selectedApp.id}`, {
        status,
        reviewNotes
      });
      setIsDialogOpen(false);
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update application');
    }
  };

  const downloadDocument = async (appId, field) => {
    try {
      const res = await apiClient.get(`/outbound-applications/${appId}/documents/${field}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = res.headers['content-disposition'];
      let fileName = `${field}-${appId}.pdf`;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?([^";]+)"?/);
        if (fileNameMatch && fileNameMatch[1]) fileName = fileNameMatch[1];
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
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Outbound Applications</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage student international exchange applications and nominations.</p>
        </div>
      </div>

      {/* 5.23 Status and Partner Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap items-center gap-4 text-sm shadow-xs">
        <div className="flex items-center gap-1.5 text-gray-500 font-semibold uppercase text-xs">
          <RiFilter3Line size={16} /> Filters:
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 text-xs focus:ring-2 focus:ring-brand-purple"
        >
          <option value="">All Statuses</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="NOMINATED">Nominated</option>
          <option value="ACCEPTED_BY_PARTNER">Accepted by Partner</option>
          <option value="REJECTED">Rejected</option>
          <option value="WITHDRAWN">Withdrawn</option>
        </select>

        <select
          value={partnerFilter}
          onChange={(e) => { setPartnerFilter(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 text-xs focus:ring-2 focus:ring-brand-purple max-w-xs"
        >
          <option value="">All Partner Universities</option>
          {partnersList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.country})
            </option>
          ))}
        </select>

        {(statusFilter || partnerFilter) && (
          <button
            onClick={() => { setStatusFilter(''); setPartnerFilter(''); setPage(1); }}
            className="text-xs text-brand-purple hover:underline font-semibold ml-auto cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="bg-white border rounded-xl shadow-xs overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Partner University</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">Loading applications...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No outbound applications found.</TableCell></TableRow>
            ) : (
              data.map(item => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium">
                    <p className="font-semibold text-gray-900">{item.student?.name || 'Applicant'}</p>
                    <span className="text-xs text-gray-500 font-mono">{item.rollNumber || item.referenceId}</span>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-800">{item.programType?.replace('_', ' ')}</p>
                    <span className="text-xs text-gray-500">{item.intendedSemester}</span>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-800">{item.partner?.name || 'Unknown Partner'}</p>
                    <span className="text-xs text-gray-500">{item.partner?.country}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                      ${item.status === 'ACCEPTED_BY_PARTNER' ? 'bg-green-100 text-green-800' : 
                        item.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                        item.status === 'NOMINATED' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {item.status?.replace(/_/g, ' ') || 'SUBMITTED'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openReview(item)} className="cursor-pointer">
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="cursor-pointer">Previous</Button>
        <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="cursor-pointer">Next</Button>
      </div>

      {/* Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Outbound Application</DialogTitle>
          </DialogHeader>
          
          {loadingDetail && (
            <div className="py-12 text-center text-sm text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-purple border-t-transparent mb-2" />
              <p>Fetching full applicant record from server...</p>
            </div>
          )}

          {detailLoadFailed && (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
              Could not retrieve the complete application record from the server. Saving has been disabled to prevent accidental overwrite of review notes.
            </div>
          )}

          {selectedApp && !loadingDetail && (
            <div className="space-y-6 py-4">
              {/* 5.22: Show CGPA, current year, student email, partner, etc. */}
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div><span className="font-semibold text-gray-700">Student Name:</span> {selectedApp.student?.name || '—'}</div>
                <div><span className="font-semibold text-gray-700">Email:</span> {selectedApp.student?.email || '—'}</div>
                <div><span className="font-semibold text-gray-700">Roll Number:</span> {selectedApp.rollNumber || '—'}</div>
                <div><span className="font-semibold text-gray-700">Branch:</span> {selectedApp.branch || '—'}</div>
                <div><span className="font-semibold text-gray-700">Current Year:</span> {selectedApp.currentYear || '—'}</div>
                <div><span className="font-semibold text-gray-700">CGPA:</span> {selectedApp.cgpa || '—'}</div>
                <div><span className="font-semibold text-gray-700">Program:</span> {selectedApp.programType?.replace('_', ' ')}</div>
                <div><span className="font-semibold text-gray-700">Partner Univ:</span> {selectedApp.partner?.name} ({selectedApp.partner?.country})</div>
                <div><span className="font-semibold text-gray-700">Intended Term:</span> {selectedApp.intendedSemester}</div>
                <div><span className="font-semibold text-gray-700">Submitted On:</span> {selectedApp.submittedAt ? new Date(selectedApp.submittedAt).toLocaleDateString() : '—'}</div>
              </div>

              {/* 5.22: Statement of purpose text */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-2">Statement of Purpose / Motivation</h4>
                <div className="bg-white p-4 rounded-xl text-sm whitespace-pre-wrap border border-gray-200 max-h-48 overflow-y-auto leading-relaxed">
                  {selectedApp.statementOfPurposeText || selectedApp.motivation || 'No statement of purpose text submitted.'}
                </div>
              </div>

              {/* 5.22: Documents download (only documents that were submitted) */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Submitted Documents</h4>
                <div className="flex flex-wrap gap-2.5">
                  {/* The record stores each upload as `<field>Path` (null when not sent) */}
                  {selectedApp.transcriptPath && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => downloadDocument(selectedApp.id, 'transcript')}
                      className="flex items-center gap-1.5 text-brand-purple border-brand-purpleLight cursor-pointer"
                    >
                      <RiDownloadCloud2Line size={15} /> Academic Transcript
                    </Button>
                  )}

                  {selectedApp.statementOfPurposePath && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => downloadDocument(selectedApp.id, 'statementOfPurpose')}
                      className="flex items-center gap-1.5 text-brand-purple border-brand-purpleLight cursor-pointer"
                    >
                      <RiDownloadCloud2Line size={15} /> Statement of Purpose (PDF)
                    </Button>
                  )}

                  {selectedApp.recommendationLetterPath && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => downloadDocument(selectedApp.id, 'recommendationLetter')}
                      className="flex items-center gap-1.5 text-brand-purple border-brand-purpleLight cursor-pointer"
                    >
                      <RiDownloadCloud2Line size={15} /> Recommendation Letter
                    </Button>
                  )}

                  {!selectedApp.transcriptPath &&
                   !selectedApp.statementOfPurposePath &&
                   !selectedApp.recommendationLetterPath && (
                    <p className="text-xs text-gray-400">No downloadable PDF documents attached to this record.</p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Application Status</Label>
                  <select 
                    className="w-full p-2.5 border rounded-lg bg-white text-sm focus:ring-2 focus:ring-brand-purple"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    <option value="SUBMITTED">Submitted</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="NOMINATED">Nominated to Host Institution</option>
                    <option value="ACCEPTED_BY_PARTNER">Accepted by Partner</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="WITHDRAWN">Withdrawn</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Review Notes (Internal & Student Feedback)</Label>
                  <textarea 
                    className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-brand-purple" 
                    rows="3"
                    value={reviewNotes} 
                    onChange={e => setReviewNotes(e.target.value)} 
                    placeholder="Add internal remarks, nomination details, or instructions..."
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="cursor-pointer">Cancel</Button>
            <Button 
              onClick={handleUpdate} 
              disabled={loadingDetail || detailLoadFailed}
              className="bg-brand-purple hover:bg-brand-purpleDark cursor-pointer disabled:opacity-50"
            >
              Update Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
