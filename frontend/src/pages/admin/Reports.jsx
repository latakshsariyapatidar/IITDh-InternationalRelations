import React, { useState } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';

export default function Reports() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [reportType, setReportType] = useState('inbound');
  
  const [previewLoading, setPreviewLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  
  const [rows, setRows] = useState(null);
  const [currentViewType, setCurrentViewType] = useState('inbound');
  const [totalCount, setTotalCount] = useState(0);

  const handlePreview = async () => {
    if (!from || !to) {
      alert("Please select both 'from' and 'to' dates.");
      return;
    }

    setPreviewLoading(true);
    try {
      const url = `/reports/${reportType}?from=${from}&to=${to}&format=json`;
      const res = await apiClient.get(url);
      const dataRows = res.data?.data?.rows || [];
      setRows(dataRows);
      setTotalCount(res.data?.data?.total ?? dataRows.length);
      setCurrentViewType(reportType);
    } catch (err) {
      console.error(err);
      alert('Failed to generate preview: ' + (err.response?.data?.message || err.message));
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!from || !to) {
      alert("Please select both 'from' and 'to' dates.");
      return;
    }

    setDownloadLoading(true);
    try {
      const url = `/reports/${reportType}?from=${from}&to=${to}&format=xlsx`;
      const res = await apiClient.get(url, { responseType: 'blob' });
      
      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${reportType}_report_${from}_to_${to}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error(err);
      alert('Failed to download report: ' + (err.response?.data?.message || err.message));
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">Generate on-screen registers or export Excel spreadsheets across custom date ranges.</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-gray-700">Report Register</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple"
              value={reportType}
              onChange={e => setReportType(e.target.value)}
            >
              <option value="inbound">Inbound Applications (Degree & Exchange)</option>
              <option value="visitors">Delegations & Visitors</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-gray-700">From Date</Label>
            <Input 
              type="date" 
              value={from} 
              onChange={e => setFrom(e.target.value)} 
              className="h-10"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-gray-700">To Date</Label>
            <Input 
              type="date" 
              value={to} 
              onChange={e => setTo(e.target.value)} 
              className="h-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button 
              onClick={handlePreview} 
              disabled={previewLoading || downloadLoading}
              className="flex-1 bg-brand-purple hover:bg-brand-purpleDark h-10"
            >
              {previewLoading ? 'Loading...' : 'Preview Report'}
            </Button>
            <Button 
              onClick={handleDownload} 
              disabled={previewLoading || downloadLoading}
              variant="outline"
              className="flex-1 border-gray-300 hover:bg-gray-50 h-10"
            >
              {downloadLoading ? 'Exporting...' : 'Export Excel'}
            </Button>
          </div>
        </div>
      </div>

      {/* On-Screen Table Preview */}
      {rows !== null && (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden space-y-4">
          <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50/50">
            <div>
              <h3 className="font-semibold text-gray-900">
                {currentViewType === 'inbound' ? 'Inbound Applications Register' : 'Visitors & Delegations Register'}
              </h3>
              <p className="text-xs text-gray-500">
                Displaying records from <span className="font-medium text-gray-700">{from}</span> to <span className="font-medium text-gray-700">{to}</span>
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-purpleLight/20 text-brand-purple">
              {totalCount} {totalCount === 1 ? 'record' : 'records'} found
            </span>
          </div>

          <div className="overflow-x-auto">
            {currentViewType === 'inbound' ? (
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Register</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>Program / Exchange</TableHead>
                    <TableHead>Faculty Advisor</TableHead>
                    <TableHead>Duration / Dates</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">No records found for the selected period.</TableCell></TableRow>
                  ) : (
                    rows.map((row, idx) => (
                      <TableRow key={row.id || idx} className="hover:bg-gray-50/50">
                        <TableCell className="text-gray-400 text-xs">{idx + 1}</TableCell>
                        <TableCell className="font-medium text-gray-900">{row.studentName}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            row.register === 'admission' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {row.register === 'admission' ? 'Degree Admission' : 'Exchange'}
                          </span>
                        </TableCell>
                        <TableCell>{row.nationality || '—'}</TableCell>
                        <TableCell className="text-sm">
                          <div>{row.programName || '—'}</div>
                          {row.homeUniversity && <div className="text-xs text-gray-500">{row.homeUniversity}</div>}
                        </TableCell>
                        <TableCell>{row.facultyAdvisor || '—'}</TableCell>
                        <TableCell className="text-xs text-gray-600">
                          {row.stayFrom ? new Date(row.stayFrom).toLocaleDateString() : '—'} to {row.stayTo ? new Date(row.stayTo).toLocaleDateString() : '—'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Visitor Name</TableHead>
                    <TableHead>Designation & Organisation</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Host Name</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Visit Dates</TableHead>
                    <TableHead>Verified</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">No visitors found for the selected period.</TableCell></TableRow>
                  ) : (
                    rows.map((row, idx) => (
                      <TableRow key={row.id || idx} className="hover:bg-gray-50/50">
                        <TableCell className="text-gray-400 text-xs">{idx + 1}</TableCell>
                        <TableCell className="font-medium text-gray-900">{row.fullName}</TableCell>
                        <TableCell className="text-sm">
                          <div>{row.designation || '—'}</div>
                          <div className="text-xs text-gray-500">{row.organisation}</div>
                        </TableCell>
                        <TableCell>{row.country}</TableCell>
                        <TableCell>{row.hostName || '—'}</TableCell>
                        <TableCell className="text-sm max-w-xs truncate" title={row.purposeOfVisit}>{row.purposeOfVisit}</TableCell>
                        <TableCell className="text-xs text-gray-600">
                          {row.visitFrom ? new Date(row.visitFrom).toLocaleDateString() : '—'}
                          {row.visitTo ? ` to ${new Date(row.visitTo).toLocaleDateString()}` : ''}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            row.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {row.isVerified ? 'Yes' : 'No'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
