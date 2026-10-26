import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AdminFormLayout from '../../components/admin/AdminFormLayout';
import { resolveLogoUrl } from '../../utils/media';
import { optionalText } from '../../utils/formPayload';
import { formatApiError } from '../../utils/formErrors';
import { compressDocument } from '../../utils/fileCompressor';

export default function Partners() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  // Filters
  const [typeFilter, setTypeFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Track replacement file deletion safely
  const [initialLogoUrl, setInitialLogoUrl] = useState('');
  const [newlyUploadedLogo, setNewlyUploadedLogo] = useState('');

  // Partner MOUs and document upload state
  const [partnerMous, setPartnerMous] = useState([]);
  const [loadingMous, setLoadingMous] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [showAddMouSection, setShowAddMouSection] = useState(false);
  const [newMouTitle, setNewMouTitle] = useState('');
  const [newMouSignedDate, setNewMouSignedDate] = useState('');
  const [newMouFile, setNewMouFile] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    countryCode: '',
    type: 'UNIVERSITY',
    focus: '',
    website: '',
    logoUrl: '',
    championName: '',
    championEmail: '',
    championDesignation: '',
    isActive: 'true'
  });

  const fetchPartners = async () => {
    setLoading(true);
    try {
      let url = `/partners?page=${page}&limit=${limit}`;
      if (typeFilter) url += `&type=${typeFilter}`;
      if (countryFilter) url += `&country=${encodeURIComponent(countryFilter)}`;
      
      const res = await apiClient.get(url);
      setData(res.data?.data?.partners || []);
      const total = res.data?.data?.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      console.error(err);
      alert('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [page, typeFilter, countryFilter]);

  const fetchPartnerMous = async (partnerId) => {
    if (!partnerId) {
      setPartnerMous([]);
      return;
    }
    setLoadingMous(true);
    try {
      const res = await apiClient.get(`/mous?partnerId=${partnerId}&limit=50`);
      setPartnerMous(res.data?.data?.mous || []);
    } catch (err) {
      console.error('Failed to fetch partner MOUs:', err);
    } finally {
      setLoadingMous(false);
    }
  };

  const handleUploadDocumentForMou = async (mouId, rawFile) => {
    if (!rawFile || !mouId) return;
    setUploadingDoc(true);
    try {
      const optimized = await compressDocument(rawFile);
      const fd = new FormData();
      fd.append('file', optimized);
      await apiClient.post(`/mous/${mouId}/document`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('MOU document uploaded successfully!');
      fetchPartnerMous(currentId);
    } catch (err) {
      alert('Document upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleCreateMouForPartner = async (partnerId, partnerName, rawFile, mouTitle, signedDate) => {
    if (!partnerId) return;
    setUploadingDoc(true);
    try {
      const payload = {
        partnerId,
        title: mouTitle?.trim() || `${partnerName} Bilateral Agreement`,
        signedDate: signedDate || new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
        isPublic: true,
      };
      const res = await apiClient.post('/mous', payload);
      const createdMouId = res.data?.data?.id;

      if (rawFile && createdMouId) {
        const optimized = await compressDocument(rawFile);
        const fd = new FormData();
        fd.append('file', optimized);
        await apiClient.post(`/mous/${createdMouId}/document`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      alert('MOU created and published successfully!');
      setShowAddMouSection(false);
      setNewMouTitle('');
      setNewMouSignedDate('');
      setNewMouFile(null);
      fetchPartnerMous(partnerId);
    } catch (err) {
      alert('Failed to create MOU: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDownloadMouDoc = async (mouId, title) => {
    try {
      const res = await apiClient.get(`/mous/${mouId}/document`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `MOU_${(title || mouId).replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download document: ' + (err.response?.data?.message || err.message));
    }
  };

  const openCreate = () => {
    setCurrentId(null);
    setInitialLogoUrl('');
    setNewlyUploadedLogo('');
    setPartnerMous([]);
    setShowAddMouSection(false);
    setNewMouTitle('');
    setNewMouSignedDate('');
    setNewMouFile(null);
    setFormData({
      name: '',
      country: '',
      countryCode: '',
      type: 'UNIVERSITY',
      focus: '',
      website: '',
      logoUrl: '',
      championName: '',
      championEmail: '',
      championDesignation: '',
      isActive: 'true'
    });
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setCurrentId(item.id);
    setInitialLogoUrl(item.logoUrl || '');
    setNewlyUploadedLogo('');
    setShowAddMouSection(false);
    setNewMouTitle('');
    setNewMouSignedDate('');
    setNewMouFile(null);
    fetchPartnerMous(item.id);
    setFormData({
      name: item.name,
      country: item.country,
      countryCode: item.countryCode || '',
      type: item.type,
      focus: item.focus || '',
      website: item.website || '',
      logoUrl: item.logoUrl || '',
      championName: item.championName || '',
      championEmail: item.championEmail || '',
      championDesignation: item.championDesignation || '',
      isActive: item.isActive ? 'true' : 'false',
    });
    setIsFormOpen(true);
  };

  const handleCancel = async () => {
    // If a new logo was uploaded during this edit session but not saved, clean it up
    if (newlyUploadedLogo && newlyUploadedLogo.startsWith('/uploads')) {
      try {
        await apiClient.delete(`/uploads?url=${encodeURIComponent(newlyUploadedLogo)}`);
      } catch (e) {
        console.error('Failed to cleanup unsaved uploaded logo:', e);
      }
    }
    setIsFormOpen(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this partner? Warning: The partner's MOUs and their uploaded PDFs will also be deleted.")) {
      return;
    }
    try {
      await apiClient.delete(`/partners/${id}`);
      fetchPartners();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete partner');
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await apiClient.post('/uploads/image/partners', fd);
      const newUrl = res.data?.data?.url;

      // An earlier upload from this form was never saved, so nothing uses it.
      if (newlyUploadedLogo && newlyUploadedLogo.startsWith('/uploads')) {
        try {
          await apiClient.delete(`/uploads?url=${encodeURIComponent(newlyUploadedLogo)}`);
        } catch (e) {
          console.error('Failed to cleanup replaced uploaded logo:', e);
        }
      }

      // Track newly uploaded logo
      setNewlyUploadedLogo(newUrl);
      setFormData(prev => ({ ...prev, logoUrl: newUrl }));
    } catch (err) {
      console.error(err);
      alert('Failed to upload image. Max 10MB, JPEG/PNG/WEBP/GIF only.');
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      // website and logoUrl accept null to clear. focus and the champion's
      // name/designation are plain optional strings: "" clears them on an edit
      // and null is rejected. countryCode and championEmail reject "" as well,
      // so an empty box leaves them out.
      const isEdit = Boolean(currentId);
      const payload = {
        name: formData.name.trim(),
        country: formData.country.trim(),
        countryCode: formData.countryCode?.trim() ? formData.countryCode.trim().toUpperCase() : undefined,
        type: formData.type,
        focus: optionalText(formData.focus, isEdit),
        website: formData.website?.trim() ? formData.website.trim() : null,
        logoUrl: formData.logoUrl ? formData.logoUrl : null,
        championName: optionalText(formData.championName, isEdit),
        championEmail: formData.championEmail?.trim() ? formData.championEmail.trim() : undefined,
        championDesignation: optionalText(formData.championDesignation, isEdit),
        isActive: formData.isActive === 'true'
      };

      if (currentId) {
        await apiClient.patch(`/partners/${currentId}`, payload);
      } else {
        await apiClient.post('/partners', payload);
      }

      // After successful save, if a replacement logo was uploaded and we had an old logo, delete the old one
      if (newlyUploadedLogo && initialLogoUrl && initialLogoUrl !== newlyUploadedLogo && initialLogoUrl.startsWith('/uploads')) {
        try {
          await apiClient.delete(`/uploads?url=${encodeURIComponent(initialLogoUrl)}`);
        } catch (e) {
          console.error("Failed to delete old replaced logo:", e);
        }
      }

      setIsFormOpen(false);
      fetchPartners();
    } catch (err) {
      console.error(err);
      alert(formatApiError(err, 'Failed to save partner'));
    } finally {
      setSaveLoading(false);
    }
  };

  if (isFormOpen) {
    return (
      <AdminFormLayout
        title={currentId ? 'Edit Partner Details' : 'Add New Partner'}
        subtitle="Manage the details of this partner."
        stepName="Partner Info"
        onCancel={handleCancel}
        onSave={handleSave}
        loading={saveLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Partner Name <span className="text-red-500">*</span></Label>
            <Input 
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="University or Org Name" 
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Country <span className="text-red-500">*</span></Label>
            <Input 
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.country} 
              onChange={e => setFormData({...formData, country: e.target.value})} 
              placeholder="e.g. Japan" 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Country Code (ISO 2-letter, Optional)</Label>
            <Input 
              maxLength={2}
              className="border-gray-300 focus-visible:ring-brand-purple uppercase"
              value={formData.countryCode} 
              onChange={e => setFormData({...formData, countryCode: e.target.value.toUpperCase()})} 
              placeholder="e.g. JP, US, DE" 
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Type</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="UNIVERSITY">University</option>
              <option value="ORGANIZATION">Organization</option>
              <option value="CONSORTIUM">Consortium</option>
              <option value="NETWORK">Network</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Focus / Scope (Optional)</Label>
            <Input 
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.focus} 
              onChange={e => setFormData({...formData, focus: e.target.value})} 
              placeholder="e.g. Student Exchange" 
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Website (Optional)</Label>
            <Input 
              type="url"
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.website} 
              onChange={e => setFormData({...formData, website: e.target.value})} 
              placeholder="https://..." 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Status</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple"
              value={formData.isActive}
              onChange={e => setFormData({...formData, isActive: e.target.value})}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Champion Information */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">IITDh Champion Name (Optional)</Label>
            <Input 
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.championName} 
              onChange={e => setFormData({...formData, championName: e.target.value})} 
              placeholder="e.g. Dr. A. Sharma" 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-semibold">Champion Email (Optional)</Label>
            <Input 
              type="email"
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.championEmail} 
              onChange={e => setFormData({...formData, championEmail: e.target.value})} 
              placeholder="faculty@iitdh.ac.in" 
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Champion Designation (Optional)</Label>
            <Input 
              className="border-gray-300 focus-visible:ring-brand-purple"
              value={formData.championDesignation} 
              onChange={e => setFormData({...formData, championDesignation: e.target.value})} 
              placeholder="e.g. Associate Professor, CSE" 
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-700 font-semibold">Logo Image (Max 10MB)</Label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <Input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="border-gray-300 focus-visible:ring-brand-purple cursor-pointer"
                  onChange={e => handleImageUpload(e.target.files[0])} 
                />
              </div>
              {formData.logoUrl && (
                <div className="shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center p-2">
                  <img src={resolveLogoUrl(formData.logoUrl)} className="w-full h-full object-contain" alt="Logo preview"/>
                </div>
              )}
            </div>
          </div>

          {/* Section: Signed MOU Document & Agreement */}
          <div className="space-y-4 md:col-span-2 border-t pt-5 mt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <Label className="text-base font-bold text-gray-900 block">
                  Partner MOU & Signed Document
                </Label>
                <p className="text-xs text-gray-500">
                  Manage bilateral agreements and upload signed MOU documents for this partner. Documents are accessible to verified @iitdh.ac.in accounts.
                </p>
              </div>
              {currentId && !showAddMouSection && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNewMouTitle(`${formData.name} Bilateral Agreement`);
                    setNewMouSignedDate(new Date().toISOString().split('T')[0]);
                    setShowAddMouSection(true);
                  }}
                  className="text-xs text-brand-purple border-brand-purple/40 hover:bg-brand-purpleLight/30 cursor-pointer self-start sm:self-auto"
                >
                  + Add / Upload MOU Document
                </Button>
              )}
            </div>

            {!currentId ? (
              <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-4 text-xs text-purple-900 leading-relaxed">
                <span className="font-semibold">Note:</span> Save this partner first to attach signed MOU documents, or create and manage bilateral agreements directly in the{' '}
                <Link to="/admin/mous" className="font-bold underline text-brand-purple">
                  MOUs section
                </Link>.
              </div>
            ) : loadingMous ? (
              <div className="text-xs text-gray-500 py-3">Loading associated MOUs...</div>
            ) : (
              <div className="space-y-3">
                {partnerMous.length === 0 && !showAddMouSection ? (
                  <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center">
                    <p className="text-xs text-gray-500 mb-3">No MOU document is currently attached to this partner.</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNewMouTitle(`${formData.name} Bilateral Agreement`);
                        setNewMouSignedDate(new Date().toISOString().split('T')[0]);
                        setShowAddMouSection(true);
                      }}
                      className="text-xs font-semibold text-brand-purple border-brand-purple/40 hover:bg-purple-50 cursor-pointer"
                    >
                      Attach Signed MOU Document Now
                    </Button>
                  </div>
                ) : (
                  partnerMous.map((mou) => (
                    <div
                      key={mou.id}
                      className="bg-gray-50/80 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-sm text-gray-900 truncate">{mou.title}</span>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              mou.isPublic !== false
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {mou.isPublic !== false ? 'Published on Website' : 'Hidden Draft'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                          <span>Signed: {mou.signedDate ? mou.signedDate.split('T')[0] : '—'}</span>
                          <span>
                            Status: <strong className="text-gray-700">{mou.status}</strong>
                          </span>
                          <span>
                            Document:{' '}
                            {mou.hasDocument ? (
                              <span className="text-emerald-600 font-semibold">✓ Signed PDF Uploaded</span>
                            ) : (
                              <span className="text-red-500 font-semibold">✕ No File Uploaded</span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {mou.hasDocument && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadMouDoc(mou.id, mou.title)}
                            className="text-xs text-brand-purple cursor-pointer"
                          >
                            Download PDF
                          </Button>
                        )}
                        <label className="inline-flex items-center">
                          <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-purple text-white hover:bg-brand-purpleDark cursor-pointer shadow-xs transition-colors">
                            {uploadingDoc ? 'Uploading...' : mou.hasDocument ? 'Replace PDF' : 'Upload PDF'}
                          </span>
                          <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            disabled={uploadingDoc}
                            onChange={(e) => handleUploadDocumentForMou(mou.id, e.target.files?.[0])}
                          />
                        </label>
                      </div>
                    </div>
                  ))
                )}

                {/* Inline Add MOU Box */}
                {showAddMouSection && (
                  <div className="bg-purple-50/50 border border-brand-purpleLight/80 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-brand-purpleDark">
                        Add New MOU & Attach Document
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowAddMouSection(false)}
                        className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-semibold text-gray-700">MOU Title</Label>
                        <Input
                          value={newMouTitle}
                          onChange={(e) => setNewMouTitle(e.target.value)}
                          placeholder="e.g. Academic Exchange Agreement"
                          className="h-8 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-gray-700">Signed Date</Label>
                        <Input
                          type="date"
                          value={newMouSignedDate}
                          onChange={(e) => setNewMouSignedDate(e.target.value)}
                          className="h-8 text-xs bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-xs font-semibold text-gray-700">Signed Document (PDF)</Label>
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setNewMouFile(e.target.files?.[0])}
                          className="h-8 text-xs bg-white cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddMouSection(false)}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        disabled={uploadingDoc}
                        onClick={() =>
                          handleCreateMouForPartner(
                            currentId,
                            formData.name,
                            newMouFile,
                            newMouTitle,
                            newMouSignedDate
                          )
                        }
                        className="bg-brand-purple hover:bg-brand-purpleDark text-white text-xs cursor-pointer shadow-xs"
                      >
                        {uploadingDoc ? 'Saving MOU...' : 'Create MOU & Attach PDF'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </AdminFormLayout>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Partners Management</h2>
          <p className="text-sm text-gray-500">Manage overseas universities and partner organisations</p>
        </div>
        <Button onClick={openCreate} className="bg-brand-purple hover:bg-brand-purpleDark">Add Partner</Button>
      </div>

      {/* Filters (5.39) */}
      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm items-center">
        <div className="w-48">
          <Label className="text-xs font-semibold text-gray-500 mb-1 block">Filter by Type</Label>
          <select
            className="w-full text-sm border border-gray-300 rounded-md p-2"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Types</option>
            <option value="UNIVERSITY">University</option>
            <option value="ORGANIZATION">Organization</option>
            <option value="CONSORTIUM">Consortium</option>
            <option value="NETWORK">Network</option>
          </select>
        </div>

        <div className="w-48">
          <Label className="text-xs font-semibold text-gray-500 mb-1 block">Filter by Country</Label>
          <Input
            placeholder="Search country..."
            className="h-9 text-sm"
            value={countryFilter}
            onChange={(e) => {
              setCountryFilter(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {(typeFilter || countryFilter) && (
          <div className="self-end pb-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setTypeFilter('');
                setCountryFilter('');
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Country</TableHead>
              <TableHead className="font-semibold">Champion</TableHead>
              <TableHead className="font-semibold">Active</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">Loading partners...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No partners found.</TableCell></TableRow>
            ) : (
              data.map(item => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium flex items-center gap-3 text-gray-900">
                    <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-white flex items-center justify-center shrink-0">
                      {item.logoUrl ? (
                        <img 
                          src={resolveLogoUrl(item.logoUrl)} 
                          alt="Logo" 
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {e.target.style.display='none'}}
                        />
                      ) : (
                        <span className="text-gray-400 font-bold text-xs">{item.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      {item.focus && <div className="text-xs text-gray-500">{item.focus}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-brand-purpleLight/20 text-brand-purple">
                      {item.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {item.country} {item.countryCode ? `(${item.countryCode})` : ''}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {item.championName ? (
                      <div>
                        <div className="font-medium text-gray-800">{item.championName}</div>
                        {item.championEmail && <div className="text-xs text-gray-500">{item.championEmail}</div>}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.isActive ? (
                      <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-medium border border-green-200">Yes</span>
                    ) : (
                      <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-md text-xs font-medium border border-gray-200">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link
                      to={`/admin/mous?partnerId=${item.id}`}
                      className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-md border border-brand-purple/30 text-brand-purple hover:bg-brand-purpleLight/30 transition-colors"
                    >
                      MOUs
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => openEdit(item)}>Edit</Button>
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
        <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>
    </div>
  );
}
