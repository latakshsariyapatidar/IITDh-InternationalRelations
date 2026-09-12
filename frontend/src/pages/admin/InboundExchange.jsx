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

export default function InboundExchange() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Status update state
  const [status, setStatus] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');

  // 17 Real Office Record Fields
  const [recordData, setRecordData] = useState(INITIAL_RECORD_STATE);

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
      link.setAttribute('download', `inbound_exchange_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Export failed');
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

    try {
      const res = await apiClient.get(`/inbound-exchange/${app.id}`);
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
    } catch (e) {
      console.error('Failed to load full exchange application details', e);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      // 1. Update application status and review notes
      await apiClient.patch(`/inbound-exchange/${selectedApp.id}`, {
        status,
        reviewNotes
      });

      // 2. Update office record fields with sanitized values (resolves 400 error)
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

      await apiClient.patch(`/inbound-exchange/${selectedApp.id}/record`, recordPayload);

      setIsDialogOpen(false);
      fetchExchange();
    } catch (err) {
      console.error(err);
      alert('Failed to update record: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
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
        <h2 className="text-2xl font-bold">Inbound Exchange Applications</h2>
        <Button onClick={handleExport} variant="outline" className="border-gray-300 hover:bg-gray-50">
          Export Excel
        </Button>
      </div>

      <div className="bg-white border rounded-md shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant Name</TableHead>
              <TableHead>Home Institution</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Exchange Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Roll Number</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-4">Loading...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-4">No records found.</TableCell></TableRow>
            ) : (
              data.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.firstName} {item.lastName}</TableCell>
                  <TableCell>{item.homeUniversity}</TableCell>
                  <TableCell>{item.nationality}</TableCell>
                  <TableCell>
                    <span className="capitalize">{item.exchangeType?.toLowerCase().replace(/_/g, ' ')}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${item.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 
                        item.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{item.rollNumber || '—'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openReview(item)}>Review</Button>
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
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-3xl">
          <DialogHeader>
            <DialogTitle>Review Exchange Application</DialogTitle>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6 py-4">
              {/* Applicant Overview */}
              <div className="bg-gray-50 p-4 rounded-lg border grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div><span className="font-semibold text-gray-600">Name:</span> <p className="font-medium">{selectedApp.firstName} {selectedApp.lastName}</p></div>
                <div><span className="font-semibold text-gray-600">Email:</span> <p className="font-medium">{selectedApp.email}</p></div>
                <div><span className="font-semibold text-gray-600">Home University:</span> <p className="font-medium">{selectedApp.homeUniversity}</p></div>
                <div><span className="font-semibold text-gray-600">Nationality:</span> <p className="font-medium">{selectedApp.nationality}</p></div>
                <div><span className="font-semibold text-gray-600">Exchange Type:</span> <p className="font-medium">{selectedApp.exchangeType}</p></div>
                <div><span className="font-semibold text-gray-600">Stay:</span> <p className="font-medium">{selectedApp.intendedStayFrom ? selectedApp.intendedStayFrom.slice(0, 10) : '—'} to {selectedApp.intendedStayTo ? selectedApp.intendedStayTo.slice(0, 10) : '—'}</p></div>
              </div>

              {/* Uploaded Documents */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Supporting Documents</h4>
                <div className="flex flex-wrap gap-2">
                  {['passportCopy', 'photo', 'academicTranscripts', 'nominationLetter', 'statementOfPurpose', 'financialProof', 'recommendationLetter'].map(field => (
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

              {/* Application Decision */}
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
                      <option value="ACCEPTED">Accepted</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Review Notes (Internal)</Label>
                    <textarea 
                      className="w-full p-2 border rounded-md text-sm" 
                      rows="2"
                      value={reviewNotes} 
                      onChange={e => setReviewNotes(e.target.value)} 
                      placeholder="Private notes..."
                    />
                  </div>
                </div>
              </div>

              {/* Office Record Section (17 schema fields) */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-brand-purpleDark text-base">Office Record (IRO Internal)</h4>
                  <span className="text-xs text-gray-500">Maintained post-acceptance</span>
                </div>

                {/* Academic & Enrollment */}
                <div className="space-y-3 bg-gray-50/70 p-4 rounded-md border border-gray-200">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Academic & Host Details</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Roll Number</Label>
                      <Input 
                        value={recordData.rollNumber} 
                        onChange={e => setRecordData(p => ({ ...p, rollNumber: e.target.value }))} 
                        placeholder="e.g. 26EX001" 
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Institute Email</Label>
                      <Input 
                        type="email"
                        value={recordData.instituteEmail} 
                        onChange={e => setRecordData(p => ({ ...p, instituteEmail: e.target.value }))} 
                        placeholder="e.g. 26ex001@iitdh.ac.in" 
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Faculty Advisor / Host</Label>
                      <Input 
                        value={recordData.facultyAdvisor} 
                        onChange={e => setRecordData(p => ({ ...p, facultyAdvisor: e.target.value }))} 
                        placeholder="e.g. Prof. Kumar" 
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
                        placeholder="e.g. Home University / Erasmus+ / Self-funded" 
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
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Visa & FRRO Compliance</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Visa Details / Number</Label>
                      <Input 
                        value={recordData.visaDetails} 
                        onChange={e => setRecordData(p => ({ ...p, visaDetails: e.target.value }))} 
                        placeholder="e.g. Student Visa V987654" 
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
                    placeholder="Confidential notes regarding this exchange student..."
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={saving} className="bg-brand-purple hover:bg-brand-purpleDark">
              {saving ? 'Saving...' : 'Update Application & Record'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
