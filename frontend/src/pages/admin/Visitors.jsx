import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { formatDay } from '../../utils/formatDay';
import { RiSearchLine, RiFilter3Line, RiDownloadCloud2Line } from '@remixicon/react';

export default function Visitors() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  // 5.26: Filters
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const buildQueryParams = () => {
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (countryFilter.trim()) params.country = countryFilter.trim();
    if (verifiedFilter !== '') params.isVerified = verifiedFilter;
    if (dateFrom) params.visitFrom = new Date(dateFrom).toISOString();
    if (dateTo) params.visitTo = new Date(dateTo).toISOString();
    return params;
  };

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        ...buildQueryParams()
      };
      const res = await apiClient.get('/visitors', { params });
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
  }, [page, countryFilter, verifiedFilter, dateFrom, dateTo]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchVisitors();
  };

  // 5.26: Export uses same filters
  const handleExport = async () => {
    try {
      const params = buildQueryParams();
      const res = await apiClient.get('/visitors/export', { params, responseType: 'blob' });
      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `visitors_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Export failed');
    }
  };

  // 5.24: Open dialog with full editable form
  const openReview = (visitor) => {
    setSelectedVisitor(visitor);
    setEditFormData({
      fullName: visitor.fullName || visitor.name || '',
      email: visitor.email || '',
      organisation: visitor.organisation || visitor.institution || '',
      department: visitor.department || '',
      country: visitor.country || '',
      nationality: visitor.nationality || '',
      passportNumber: visitor.passportNumber || '',
      designation: visitor.designation || visitor.title || '',
      phone: visitor.phone || '',
      website: visitor.website || '',
      hostName: visitor.hostName || '',
      hostDepartment: visitor.hostDepartment || '',
      purposeOfVisit: visitor.purposeOfVisit || '',
      visitFrom: visitor.visitFrom ? visitor.visitFrom.slice(0, 10) : '',
      visitTo: visitor.visitTo ? visitor.visitTo.slice(0, 10) : '',
      remarks: visitor.remarks || '',
      isVerified: visitor.isVerified || false,
    });
    setIsDialogOpen(true);
  };

  const handleFieldChange = (field, val) => {
    setEditFormData(prev => ({ ...prev, [field]: val }));
  };

  // 5.24: Allow editing every field on update
  const handleUpdate = async () => {
    try {
      const payload = {
        ...editFormData,
        visitFrom: editFormData.visitFrom ? new Date(editFormData.visitFrom).toISOString() : undefined,
        visitTo: editFormData.visitTo ? new Date(editFormData.visitTo).toISOString() : null,
      };
      await apiClient.patch(`/visitors/${selectedVisitor.id}`, payload);
      setIsDialogOpen(false);
      fetchVisitors();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update visitor record');
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

  const resetFilters = () => {
    setSearch('');
    setCountryFilter('');
    setVerifiedFilter('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visiting Delegations Register</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage international delegates, academic missions, and campus protocol.</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="border-brand-purple text-brand-purple flex items-center gap-1.5 cursor-pointer self-start sm:self-auto">
          <RiDownloadCloud2Line size={16} /> Export to Excel
        </Button>
      </div>

      {/* 5.26 Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <RiSearchLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search visitor, institution, email (press Enter)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>

          <input
            type="text"
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            placeholder="Filter by country..."
            className="w-40 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
          />

          <select
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
          >
            <option value="">All Verification States</option>
            <option value="true">Verified Only</option>
            <option value="false">Unverified / Pending</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <span>From:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-2 py-1 text-xs border border-gray-300 rounded-lg"
            />
            <span>To:</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-2 py-1 text-xs border border-gray-300 rounded-lg"
            />
          </div>

          {(search || countryFilter || verifiedFilter !== '' || dateFrom || dateTo) && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-brand-purple hover:underline ml-auto cursor-pointer"
            >
              Reset
            </button>
          )}
        </form>
      </div>

      <div className="bg-white border rounded-xl shadow-xs overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Delegate Name</TableHead>
              <TableHead>Institution & Dept</TableHead>
              <TableHead>Country / Nationality</TableHead>
              <TableHead>Host & Dept at IITDh</TableHead>
              <TableHead>Visit Dates</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">Loading delegations...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">No visitors found matching current filter.</TableCell></TableRow>
            ) : (
              data.map(item => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium">
                    <p className="font-semibold text-gray-900">{item.fullName || item.name}</p>
                    {item.email && <p className="text-xs text-gray-500">{item.email}</p>}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-800">{item.organisation || item.institution}</p>
                    {item.department && <p className="text-xs text-gray-500">{item.department}</p>}
                  </TableCell>
                  <TableCell>
                    <p className="text-gray-800 font-medium">{item.country}</p>
                    {item.nationality && <p className="text-xs text-gray-500">{item.nationality}</p>}
                  </TableCell>
                  <TableCell>
                    <p className="text-xs text-gray-800 font-medium">{item.hostName || '—'}</p>
                    {item.hostDepartment && <p className="text-[11px] text-gray-500">{item.hostDepartment}</p>}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {item.visitFrom ? formatDay(item.visitFrom) : ''}
                    {item.visitTo ? ` - ${formatDay(item.visitTo)}` : ''}
                  </TableCell>
                  <TableCell>
                    {item.isVerified ? (
                      <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-xs font-semibold border border-green-200">Verified</span>
                    ) : (
                      <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium border border-gray-200">Pending</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openReview(item)} className="cursor-pointer">Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} className="cursor-pointer">Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="cursor-pointer">Previous</Button>
        <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="cursor-pointer">Next</Button>
      </div>

      {/* 5.24 & 5.25: Comprehensive Edit & Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Delegation Record</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Full Name *</Label>
                <Input value={editFormData.fullName || ''} onChange={(e) => handleFieldChange('fullName', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Email *</Label>
                <Input type="email" value={editFormData.email || ''} onChange={(e) => handleFieldChange('email', e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Institution / Organisation *</Label>
                <Input value={editFormData.organisation || ''} onChange={(e) => handleFieldChange('organisation', e.target.value)} />
              </div>
              {/* 5.25 Department */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Visitor's Department</Label>
                <Input value={editFormData.department || ''} onChange={(e) => handleFieldChange('department', e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Country *</Label>
                <Input value={editFormData.country || ''} onChange={(e) => handleFieldChange('country', e.target.value)} />
              </div>
              {/* 5.25 Nationality */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Nationality</Label>
                <Input value={editFormData.nationality || ''} onChange={(e) => handleFieldChange('nationality', e.target.value)} />
              </div>

              {/* 5.25 Passport Number */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Passport Number</Label>
                <Input value={editFormData.passportNumber || ''} onChange={(e) => handleFieldChange('passportNumber', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Designation / Title</Label>
                <Input value={editFormData.designation || ''} onChange={(e) => handleFieldChange('designation', e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Phone</Label>
                <Input value={editFormData.phone || ''} onChange={(e) => handleFieldChange('phone', e.target.value)} />
              </div>
              {/* 5.25 Website */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Website / Profile Link</Label>
                <Input value={editFormData.website || ''} onChange={(e) => handleFieldChange('website', e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Host Faculty at IITDh</Label>
                <Input value={editFormData.hostName || ''} onChange={(e) => handleFieldChange('hostName', e.target.value)} />
              </div>
              {/* 5.25 Host Department */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Host Department at IITDh</Label>
                <Input value={editFormData.hostDepartment || ''} onChange={(e) => handleFieldChange('hostDepartment', e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Visit Start Date</Label>
                <Input type="date" value={editFormData.visitFrom || ''} onChange={(e) => handleFieldChange('visitFrom', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Visit End Date</Label>
                <Input type="date" value={editFormData.visitTo || ''} onChange={(e) => handleFieldChange('visitTo', e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Purpose of Visit</Label>
              <textarea
                rows={2}
                value={editFormData.purposeOfVisit || ''}
                onChange={(e) => handleFieldChange('purposeOfVisit', e.target.value)}
                className="w-full p-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple"
              />
            </div>

            {/* 5.25 Remarks */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Remarks & Protocol Notes</Label>
              <textarea
                rows={2}
                value={editFormData.remarks || ''}
                onChange={(e) => handleFieldChange('remarks', e.target.value)}
                className="w-full p-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple"
                placeholder="Transit, accommodations, special protocol..."
              />
            </div>

            <div className="border-t pt-3 space-y-1.5">
              <Label className="text-xs font-semibold">Verification Status</Label>
              <select
                className="w-full p-2 border rounded-lg text-xs bg-white"
                value={editFormData.isVerified ? 'true' : 'false'}
                onChange={(e) => handleFieldChange('isVerified', e.target.value === 'true')}
              >
                <option value="false">Pending / Unverified</option>
                <option value="true">Approved & Verified Visit</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="cursor-pointer">Cancel</Button>
            <Button onClick={handleUpdate} className="bg-brand-purple hover:bg-brand-purpleDark cursor-pointer">
              Save All Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
