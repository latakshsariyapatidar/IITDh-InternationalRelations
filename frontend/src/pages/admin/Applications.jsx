import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';

const INITIAL_RECORD_STATE = {
  rollNumber: '',
  instituteEmail: '',
  sponsoringAgency: '',
  yearOfJoining: '',
  dateOfJoining: '',
  exitDate: '',
  facultyAdvisor: '',
  citizenshipNo: '',
  passportIssueDate: '',
  passportPlaceOfIssue: '',
  visaDetails: '',
  visaIssueDate: '',
  visaExpiryDate: '',
  visaPlaceOfIssue: '',
  sForm: '',
  cForm: '',
  officeRemarks: '',
};

export default function Applications() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  // 5.13 Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState('');
  const [programLevelFilter, setProgramLevelFilter] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailLoadFailed, setDetailLoadFailed] = useState(false);
  
  // Status update state
  const [status, setStatus] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [recordData, setRecordData] = useState(INITIAL_RECORD_STATE);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (statusFilter) params.append('status', statusFilter);
      if (nationalityFilter.trim()) params.append('nationality', nationalityFilter.trim());
      if (programLevelFilter) params.append('programLevel', programLevelFilter);
      if (searchFilter.trim()) params.append('search', searchFilter.trim());

      const res = await apiClient.get(`/applications?${params.toString()}`);
      setData(res.data?.data?.applications || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      console.error(err);
      alert('Failed to load applications: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, statusFilter, nationalityFilter, programLevelFilter, searchFilter]);

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (nationalityFilter.trim()) params.append('nationality', nationalityFilter.trim());
      if (programLevelFilter) params.append('programLevel', programLevelFilter);
      if (searchFilter.trim()) params.append('search', searchFilter.trim());

      const queryStr = params.toString() ? `?${params.toString()}` : '';
      const res = await apiClient.get(`/applications/export${queryStr}`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `applications_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Export failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const openReview = async (app) => {
    setSelectedApp(app);
    setStatus(app.status || 'SUBMITTED');
    setReviewNotes(app.reviewNotes || '');
    setRecordData({
      rollNumber: app.rollNumber || '',
      instituteEmail: '',
      sponsoringAgency: '',
      yearOfJoining: '',
      dateOfJoining: '',
      exitDate: app.exitDate ? app.exitDate.slice(0, 10) : '',
      facultyAdvisor: app.facultyAdvisor || '',
      citizenshipNo: '',
      passportIssueDate: '',
      passportPlaceOfIssue: '',
      visaDetails: '',
      visaIssueDate: '',
      visaExpiryDate: app.visaExpiryDate ? app.visaExpiryDate.slice(0, 10) : '',
      visaPlaceOfIssue: '',
      sForm: '',
      cForm: '',
      officeRemarks: '',
    });
    setIsDialogOpen(true);
    setLoadingDetail(true);
    setDetailLoadFailed(false);

    try {
      const res = await apiClient.get(`/applications/${app.id}`);
      const full = res.data?.data || app;
      setSelectedApp(full);
      setStatus(full.status || 'SUBMITTED');
      setReviewNotes(full.reviewNotes || '');
      setRecordData({
        rollNumber: full.rollNumber || '',
        instituteEmail: full.instituteEmail || '',
        sponsoringAgency: full.sponsoringAgency || '',
        yearOfJoining: full.yearOfJoining || '',
        dateOfJoining: full.dateOfJoining ? full.dateOfJoining.slice(0, 10) : '',
        exitDate: full.exitDate ? full.exitDate.slice(0, 10) : '',
        facultyAdvisor: full.facultyAdvisor || '',
        citizenshipNo: full.citizenshipNo || '',
        passportIssueDate: full.passportIssueDate ? full.passportIssueDate.slice(0, 10) : '',
        passportPlaceOfIssue: full.passportPlaceOfIssue || '',
        visaDetails: full.visaDetails || '',
        visaIssueDate: full.visaIssueDate ? full.visaIssueDate.slice(0, 10) : '',
        visaExpiryDate: full.visaExpiryDate ? full.visaExpiryDate.slice(0, 10) : '',
        visaPlaceOfIssue: full.visaPlaceOfIssue || '',
        sForm: full.sForm || '',
        cForm: full.cForm || '',
        officeRemarks: full.officeRemarks || '',
      });
      setLoadingDetail(false);
    } catch (e) {
      console.error('Failed to load full application details', e);
      setDetailLoadFailed(true);
      setLoadingDetail(false);
      alert('Failed to load full application details. Editing has been disabled to prevent data loss.');
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      // 1. Update status & reviewNotes
      await apiClient.patch(`/applications/${selectedApp.id}`, {
        status,
        reviewNotes
      });

      // 2. Update office record fields (all 17 sanitized fields)
      const recordPayload = {
        rollNumber: recordData.rollNumber?.trim() || null,
        instituteEmail: recordData.instituteEmail?.trim() || null,
        sponsoringAgency: recordData.sponsoringAgency?.trim() || null,
        yearOfJoining: recordData.yearOfJoining?.trim() || null,
        dateOfJoining: recordData.dateOfJoining ? new Date(recordData.dateOfJoining).toISOString() : null,
        exitDate: recordData.exitDate ? new Date(recordData.exitDate).toISOString() : null,
        facultyAdvisor: recordData.facultyAdvisor?.trim() || null,
        citizenshipNo: recordData.citizenshipNo?.trim() || null,
        passportIssueDate: recordData.passportIssueDate ? new Date(recordData.passportIssueDate).toISOString() : null,
        passportPlaceOfIssue: recordData.passportPlaceOfIssue?.trim() || null,
        visaDetails: recordData.visaDetails?.trim() || null,
        visaIssueDate: recordData.visaIssueDate ? new Date(recordData.visaIssueDate).toISOString() : null,
        visaExpiryDate: recordData.visaExpiryDate ? new Date(recordData.visaExpiryDate).toISOString() : null,
        visaPlaceOfIssue: recordData.visaPlaceOfIssue?.trim() || null,
        sForm: recordData.sForm?.trim() || null,
        cForm: recordData.cForm?.trim() || null,
        officeRemarks: recordData.officeRemarks?.trim() || null,
      };

      await apiClient.patch(`/applications/${selectedApp.id}/record`, recordPayload);

      setIsDialogOpen(false);
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert('Failed to update application: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
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

  const downloadDocument = async (appId, field) => {
    try {
      const res = await apiClient.get(`/applications/${appId}/documents/${field}`, {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inbound Degree Applications</h2>
          <p className="text-sm text-gray-500">Manage, review and export applications for full-time degree programs.</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="border-gray-300 hover:bg-gray-50 self-start sm:self-auto">
          Export Excel
        </Button>
      </div>

      {/* 5.13 Filters */}
      <div className="bg-white p-4 border rounded-md shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div>
          <Label className="text-xs text-gray-600 mb-1 block">Status</Label>
          <select
            className="w-full p-2 border rounded-md bg-white text-sm"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="DOCUMENTS_REQUESTED">Documents Requested</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="WAITLISTED">Waitlisted</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>
        </div>

        <div>
          <Label className="text-xs text-gray-600 mb-1 block">Program Level</Label>
          <select
            className="w-full p-2 border rounded-md bg-white text-sm"
            value={programLevelFilter}
            onChange={(e) => { setProgramLevelFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Levels</option>
            <option value="UNDERGRADUATE">Undergraduate</option>
            <option value="POSTGRADUATE">Postgraduate</option>
            <option value="PHD">PhD</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <Label className="text-xs text-gray-600 mb-1 block">Nationality</Label>
          <Input
            placeholder="e.g. German, French"
            value={nationalityFilter}
            onChange={(e) => { setNationalityFilter(e.target.value); setPage(1); }}
            className="h-9 text-sm"
          />
        </div>

        <div>
          <Label className="text-xs text-gray-600 mb-1 block">Search</Label>
          <Input
            placeholder="Name, email, roll no..."
            value={searchFilter}
            onChange={(e) => { setSearchFilter(e.target.value); setPage(1); }}
            className="h-9 text-sm"
          />
        </div>
      </div>

      <div className="bg-white border rounded-md shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant Name</TableHead>
              <TableHead>Level / Program</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Roll Number</TableHead>
              <TableHead>Faculty Advisor</TableHead>
              <TableHead>Visa Expiry</TableHead>
              <TableHead>Exit Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={10} className="text-center py-4">Loading...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={10} className="text-center py-4">No applications found.</TableCell></TableRow>
            ) : (
              data.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium whitespace-nowrap">{item.firstName} {item.lastName}</TableCell>
                  <TableCell className="text-xs">
                    <span className="font-semibold text-gray-700">
                      {item.programLevel === 'OTHER' ? (item.programLevelOther || 'Other') : item.programLevel}
                    </span>
                    <span className="text-gray-500 block truncate max-w-[180px]">{item.programAppliedFor}</span>
                  </TableCell>
                  <TableCell>{item.nationality}</TableCell>
                  <TableCell className="text-xs text-gray-600 whitespace-nowrap">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap
                      ${item.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 
                        item.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                        item.status === 'DOCUMENTS_REQUESTED' ? 'bg-orange-100 text-orange-800' :
                        item.status === 'WAITLISTED' ? 'bg-purple-100 text-purple-800' :
                        item.status === 'WITHDRAWN' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">{item.rollNumber || '—'}</TableCell>
                  <TableCell className="text-xs text-gray-600">{item.facultyAdvisor || '—'}</TableCell>
                  <TableCell className="text-xs text-gray-600 whitespace-nowrap">{item.visaExpiryDate ? item.visaExpiryDate.slice(0, 10) : '—'}</TableCell>
                  <TableCell className="text-xs text-gray-600 whitespace-nowrap">{item.exitDate ? item.exitDate.slice(0, 10) : '—'}</TableCell>
                  <TableCell className="text-right space-x-2 whitespace-nowrap">
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
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-4xl">
          <DialogHeader>
            <DialogTitle>Review Inbound Degree Application</DialogTitle>
          </DialogHeader>
          
          {selectedApp && (
            <div className="space-y-6 py-4">
              {loadingDetail && (
                <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-md text-xs">
                  Loading full applicant record and office details... Save is temporarily disabled until complete.
                </div>
              )}
              {detailLoadFailed && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-xs">
                  Could not load full application record. Saving has been disabled to prevent accidental data loss.
                </div>
              )}

              {/* 5.10 Comprehensive Applicant Overview */}
              <div className="bg-gray-50 p-4 rounded-lg border text-sm space-y-4">
                <h4 className="font-semibold text-gray-800 text-base border-b pb-2">Applicant Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div><span className="text-xs text-gray-500 block">Full Name</span> <p className="font-medium">{selectedApp.firstName} {selectedApp.lastName}</p></div>
                  <div><span className="text-xs text-gray-500 block">Date of Birth</span> <p className="font-medium">{selectedApp.dateOfBirth ? selectedApp.dateOfBirth.slice(0, 10) : '—'}</p></div>
                  <div><span className="text-xs text-gray-500 block">Gender</span> <p className="font-medium">{selectedApp.gender || '—'}</p></div>
                  <div><span className="text-xs text-gray-500 block">Email</span> <p className="font-medium">{selectedApp.email}</p></div>
                  <div><span className="text-xs text-gray-500 block">Phone</span> <p className="font-medium">{selectedApp.phone || '—'}</p></div>
                  <div><span className="text-xs text-gray-500 block">Nationality</span> <p className="font-medium">{selectedApp.nationality}</p></div>
                  <div><span className="text-xs text-gray-500 block">Country of Residence</span> <p className="font-medium">{selectedApp.countryOfResidence || '—'}</p></div>
                  <div><span className="text-xs text-gray-500 block">Passport Number</span> <p className="font-medium">{selectedApp.passportNumber || '—'}</p></div>
                  <div><span className="text-xs text-gray-500 block">Passport Expiry</span> <p className="font-medium">{selectedApp.passportExpiryDate ? selectedApp.passportExpiryDate.slice(0, 10) : '—'}</p></div>
                  <div className="sm:col-span-2"><span className="text-xs text-gray-500 block">Current Address</span> <p className="font-medium">{selectedApp.currentAddress || '—'}</p></div>
                  <div><span className="text-xs text-gray-500 block">Emergency Contact</span> <p className="font-medium">{selectedApp.emergencyContactName || '—'} ({selectedApp.emergencyContactPhone || '—'}) {selectedApp.emergencyContactRelation ? `· ${selectedApp.emergencyContactRelation}` : ''}</p></div>
                </div>

                <h4 className="font-semibold text-gray-800 text-base border-b pb-2 pt-2">Academic & Visa Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-xs text-gray-500 block">Program Level</span>
                    <p className="font-medium">{selectedApp.programLevel === 'OTHER' ? `Other (${selectedApp.programLevelOther || ''})` : selectedApp.programLevel}</p>
                  </div>
                  <div><span className="text-xs text-gray-500 block">Program Applied For</span> <p className="font-medium">{selectedApp.programAppliedFor}</p></div>
                  <div><span className="text-xs text-gray-500 block">Intended Intake</span> <p className="font-medium">{selectedApp.intendedIntake}</p></div>
                  <div><span className="text-xs text-gray-500 block">Highest Qualification</span> <p className="font-medium">{selectedApp.highestQualification || '—'}</p></div>
                  <div><span className="text-xs text-gray-500 block">Previous Institution</span> <p className="font-medium">{selectedApp.previousInstitution || '—'}</p></div>
                  <div><span className="text-xs text-gray-500 block">Previous Grade / GPA</span> <p className="font-medium">{selectedApp.previousGradeOrGPA || '—'}</p></div>
                  <div><span className="text-xs text-gray-500 block">English Test</span> <p className="font-medium">{selectedApp.englishTestType || 'N/A'}</p></div>
                  <div><span className="text-xs text-gray-500 block">English Test Score</span> <p className="font-medium">{selectedApp.englishTestScore || '—'}</p></div>
                  <div><span className="text-xs text-gray-500 block">Visa Category</span> <p className="font-medium">{selectedApp.visaCategory || '—'}</p></div>
                  <div><span className="text-xs text-gray-500 block">Requires Visa Sponsorship</span> <p className="font-medium">{selectedApp.requiresVisaSponsorship ? 'Yes' : 'No'}</p></div>
                </div>
              </div>

              {/* 5.11 Uploaded Documents (only show submitted ones) */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Applicant Documents</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { field: 'passportCopy', label: 'Passport Copy' },
                    { field: 'photo', label: 'Photo' },
                    { field: 'academicTranscripts', label: 'Academic Transcripts' },
                    { field: 'englishTestScoreCard', label: 'English Test Score Card' },
                    { statementOfPurpose: 'statementOfPurpose', field: 'statementOfPurpose', label: 'Statement of Purpose' },
                    { field: 'financialProof', label: 'Financial Proof' },
                    { field: 'recommendationLetter', label: 'Recommendation Letter' },
                  ]
                    .filter(doc => Boolean(selectedApp[doc.field]))
                    .map(doc => (
                      <Button 
                        key={doc.field} 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => downloadDocument(selectedApp.id, doc.field)}
                      >
                        Download {doc.label}
                      </Button>
                    ))}
                  {![
                    'passportCopy', 'photo', 'academicTranscripts', 'englishTestScoreCard', 'statementOfPurpose', 'financialProof', 'recommendationLetter'
                  ].some(field => Boolean(selectedApp[field])) && (
                    <span className="text-xs text-gray-500 italic">No document attachments were uploaded.</span>
                  )}
                </div>
              </div>

              {/* Status and Review Notes */}
              <div className="border-t pt-4 space-y-4">
                <h4 className="font-semibold text-gray-800">Application Decision</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Application Status</Label>
                    <select 
                      className="w-full p-2 border rounded-md text-sm"
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
                      className="w-full p-2 border rounded-md text-sm" 
                      rows="2"
                      value={reviewNotes} 
                      onChange={e => setReviewNotes(e.target.value)} 
                      placeholder="Private notes regarding this application..."
                    />
                  </div>
                </div>
              </div>

              {/* Office Record Section (17 schema fields) */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-brand-purpleDark text-base">Office Record (IRO Internal)</h4>
                  <span className="text-xs text-gray-500">Maintained post-admission</span>
                </div>

                {/* Academic & Enrollment */}
                <div className="space-y-3 bg-gray-50/70 p-4 rounded-md border border-gray-200">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Academic & Enrollment</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Roll Number</Label>
                      <Input 
                        value={recordData.rollNumber} 
                        onChange={e => setRecordData(p => ({ ...p, rollNumber: e.target.value }))} 
                        placeholder="e.g. 26001001" 
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Institute Email</Label>
                      <Input 
                        type="email"
                        value={recordData.instituteEmail} 
                        onChange={e => setRecordData(p => ({ ...p, instituteEmail: e.target.value }))} 
                        placeholder="e.g. 26001001@iitdh.ac.in" 
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Faculty Advisor</Label>
                      <Input 
                        value={recordData.facultyAdvisor} 
                        onChange={e => setRecordData(p => ({ ...p, facultyAdvisor: e.target.value }))} 
                        placeholder="e.g. Prof. Sharma" 
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Year of Joining</Label>
                      <Input 
                        value={recordData.yearOfJoining} 
                        onChange={e => setRecordData(p => ({ ...p, yearOfJoining: e.target.value }))} 
                        placeholder="e.g. 2026" 
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Date of Joining</Label>
                      <Input 
                        type="date"
                        value={recordData.dateOfJoining} 
                        onChange={e => setRecordData(p => ({ ...p, dateOfJoining: e.target.value }))} 
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Exit Date</Label>
                      <Input 
                        type="date"
                        value={recordData.exitDate} 
                        onChange={e => setRecordData(p => ({ ...p, exitDate: e.target.value }))} 
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2 md:col-span-3">
                      <Label className="text-xs">Sponsoring Agency</Label>
                      <Input 
                        value={recordData.sponsoringAgency} 
                        onChange={e => setRecordData(p => ({ ...p, sponsoringAgency: e.target.value }))} 
                        placeholder="e.g. ICCR / Self-funded / Ministry" 
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Passport & Identity */}
                <div className="space-y-3 bg-gray-50/70 p-4 rounded-md border border-gray-200">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Passport & Identity</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Citizenship No</Label>
                      <Input 
                        value={recordData.citizenshipNo} 
                        onChange={e => setRecordData(p => ({ ...p, citizenshipNo: e.target.value }))} 
                        placeholder="National ID / Citizenship No" 
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Passport Issue Date</Label>
                      <Input 
                        type="date"
                        value={recordData.passportIssueDate} 
                        onChange={e => setRecordData(p => ({ ...p, passportIssueDate: e.target.value }))} 
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Passport Place of Issue</Label>
                      <Input 
                        value={recordData.passportPlaceOfIssue} 
                        onChange={e => setRecordData(p => ({ ...p, passportPlaceOfIssue: e.target.value }))} 
                        placeholder="City, Country" 
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Visa & FRRO Details */}
                <div className="space-y-3 bg-gray-50/70 p-4 rounded-md border border-gray-200">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Visa & FRRO Details</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Visa Details / Number</Label>
                      <Input 
                        value={recordData.visaDetails} 
                        onChange={e => setRecordData(p => ({ ...p, visaDetails: e.target.value }))} 
                        placeholder="e.g. Student Visa V123456" 
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Visa Issue Date</Label>
                      <Input 
                        type="date"
                        value={recordData.visaIssueDate} 
                        onChange={e => setRecordData(p => ({ ...p, visaIssueDate: e.target.value }))} 
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Visa Expiry Date</Label>
                      <Input 
                        type="date"
                        value={recordData.visaExpiryDate} 
                        onChange={e => setRecordData(p => ({ ...p, visaExpiryDate: e.target.value }))} 
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Visa Place of Issue</Label>
                      <Input 
                        value={recordData.visaPlaceOfIssue} 
                        onChange={e => setRecordData(p => ({ ...p, visaPlaceOfIssue: e.target.value }))} 
                        placeholder="Consulate / City" 
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">S-Form Reference</Label>
                      <Input 
                        value={recordData.sForm} 
                        onChange={e => setRecordData(p => ({ ...p, sForm: e.target.value }))} 
                        placeholder="FRRO S-Form number" 
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">C-Form Reference</Label>
                      <Input 
                        value={recordData.cForm} 
                        onChange={e => setRecordData(p => ({ ...p, cForm: e.target.value }))} 
                        placeholder="FRRO C-Form number" 
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Office Remarks */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Office Remarks</Label>
                  <textarea 
                    className="w-full p-2 border rounded-md text-sm"
                    rows="2"
                    value={recordData.officeRemarks} 
                    onChange={e => setRecordData(p => ({ ...p, officeRemarks: e.target.value }))} 
                    placeholder="Additional confidential notes, FRRO remarks, etc."
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>Cancel</Button>
            <Button 
              onClick={handleUpdate} 
              disabled={saving || loadingDetail || detailLoadFailed} 
              className="bg-brand-purple hover:bg-brand-purpleDark"
            >
              {saving ? 'Saving...' : loadingDetail ? 'Loading full record...' : 'Update Application & Record'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
