import React, { useState } from 'react';
import apiClient from '../api/client';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { extractValidationErrors } from '../utils/formErrors';

export default function VisitorsForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organisation: '',
    department: '',
    country: '',
    nationality: '',
    passportNumber: '',
    websiteOrProfileUrl: '',
    designation: '',
    purposeOfVisit: '',
    visitFrom: '',
    visitTo: '',
    phone: '',
    hostName: '',
    hostDepartment: '',
    remarks: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [referenceId, setReferenceId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        organisation: formData.organisation.trim(),
        country: formData.country.trim(),
        purposeOfVisit: formData.purposeOfVisit.trim(),
        visitFrom: new Date(formData.visitFrom).toISOString(),
        ...(formData.visitTo && { visitTo: new Date(formData.visitTo).toISOString() }),
        ...(formData.designation && { designation: formData.designation.trim() }),
        ...(formData.department && { department: formData.department.trim() }),
        ...(formData.nationality && { nationality: formData.nationality.trim() }),
        ...(formData.passportNumber && { passportNumber: formData.passportNumber.trim() }),
        // The backend's field name; a "website" key is dropped without being saved
        ...(formData.websiteOrProfileUrl && { websiteOrProfileUrl: formData.websiteOrProfileUrl.trim() }),
        ...(formData.phone && { phone: formData.phone.trim() }),
        ...(formData.hostName && { hostName: formData.hostName.trim() }),
        ...(formData.hostDepartment && { hostDepartment: formData.hostDepartment.trim() }),
        ...(formData.remarks && { remarks: formData.remarks.trim() }),
      };

      const res = await apiClient.post('/visitors', payload);
      const ref = res.data?.data?.referenceId || res.data?.data?.id || 'REGISTERED';
      setReferenceId(ref);
      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        organisation: '',
        department: '',
        country: '',
        nationality: '',
        passportNumber: '',
        websiteOrProfileUrl: '',
        designation: '',
        purposeOfVisit: '',
        visitFrom: '',
        visitTo: '',
        phone: '',
        hostName: '',
        hostDepartment: '',
        remarks: '',
      });
    } catch (err) {
      console.error('Visitor registration error:', err);
      // 4.6: Show the field name next to each error message
      const { fieldErrors: extractedFields, errorList, generalMessage } = extractValidationErrors(err);
      setFieldErrors(extractedFields);

      if (errorList.length > 0) {
        const errorMsg = errorList
          .map((e) => `${e.field || 'Field'}: ${e.message}`)
          .join(' | ');
        setError(errorMsg);
      } else {
        setError(generalMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Delegation Registered</h2>
          <p className="text-gray-600 text-sm">
            The visiting delegation details have been registered successfully. The International Relations Office will review the itinerary and coordinate campus access passes.
          </p>

          {/* 1.13: Show Reference ID */}
          {referenceId && (
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-center">
              <p className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-1">Registration Reference Number</p>
              <p className="font-mono text-lg font-bold text-brand-purple select-all">{referenceId}</p>
              <p className="text-[11px] text-gray-500 mt-1">Please quote this ID for scheduling and on-campus protocol.</p>
            </div>
          )}

          <div className="pt-2">
            <Button onClick={() => setSuccess(false)} variant="outline" className="w-full border-brand-purple text-brand-purple cursor-pointer">
              Register Another Delegation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/IITDh Logo.svg" alt="IIT Dharwad" className="h-10 w-auto" />
          </div>
          <span className="inline-block px-3 py-1 rounded-md bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-wider mb-2">
            International Relations Office
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Register Visiting Delegation</h1>
          <p className="text-base text-gray-600">
            Submit itinerary and details for international delegates, visiting professors, and researchers hosted at IIT Dharwad.
          </p>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Full Name <span className="text-red-500">*</span></Label>
                <Input
                  required
                  maxLength={150}
                  value={formData.fullName}
                  onChange={handleChange('fullName')}
                  placeholder="Prof. / Dr. / Mr. / Ms. Jane Doe"
                  className={fieldErrors.fullName ? 'border-red-500' : ''}
                />
                {fieldErrors.fullName && <p className="text-xs text-red-500">{fieldErrors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label>Email <span className="text-red-500">*</span></Label>
                <Input
                  type="email"
                  required
                  maxLength={254}
                  value={formData.email}
                  onChange={handleChange('email')}
                  placeholder="jane.doe@university.edu"
                  className={fieldErrors.email ? 'border-red-500' : ''}
                />
                {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label>Institution / Organization <span className="text-red-500">*</span></Label>
                <Input
                  required
                  maxLength={200}
                  value={formData.organisation}
                  onChange={handleChange('organisation')}
                  placeholder="e.g. University of Tokyo, DAAD"
                  className={fieldErrors.organisation ? 'border-red-500' : ''}
                />
                {fieldErrors.organisation && <p className="text-xs text-red-500">{fieldErrors.organisation}</p>}
              </div>

              <div className="space-y-2">
                <Label>Department / Faculty</Label>
                <Input
                  maxLength={150}
                  value={formData.department}
                  onChange={handleChange('department')}
                  placeholder="e.g. Department of Physics"
                />
              </div>

              <div className="space-y-2">
                <Label>Country <span className="text-red-500">*</span></Label>
                <Input
                  required
                  maxLength={100}
                  value={formData.country}
                  onChange={handleChange('country')}
                  placeholder="e.g. Japan, Germany, USA"
                  className={fieldErrors.country ? 'border-red-500' : ''}
                />
                {fieldErrors.country && <p className="text-xs text-red-500">{fieldErrors.country}</p>}
              </div>

              <div className="space-y-2">
                <Label>Nationality</Label>
                <Input
                  maxLength={100}
                  value={formData.nationality}
                  onChange={handleChange('nationality')}
                  placeholder="e.g. French, Japanese"
                />
              </div>

              <div className="space-y-2">
                <Label>Passport Number</Label>
                <Input
                  maxLength={50}
                  value={formData.passportNumber}
                  onChange={handleChange('passportNumber')}
                  placeholder="e.g. A12345678"
                />
              </div>

              <div className="space-y-2">
                <Label>Designation / Role</Label>
                <Input
                  maxLength={150}
                  value={formData.designation}
                  onChange={handleChange('designation')}
                  placeholder="e.g. Professor, Research Scholar, Delegate"
                />
              </div>

              <div className="space-y-2">
                <Label>Contact Phone</Label>
                <Input
                  maxLength={30}
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  placeholder="+1-555-0199"
                />
              </div>

              <div className="space-y-2">
                <Label>Website / Academic Profile</Label>
                <Input
                  type="url"
                  maxLength={300}
                  value={formData.websiteOrProfileUrl}
                  onChange={handleChange('websiteOrProfileUrl')}
                  placeholder="https://university.edu/~faculty"
                  className={fieldErrors.websiteOrProfileUrl ? 'border-red-500' : ''}
                />
                {fieldErrors.websiteOrProfileUrl && <p className="text-xs text-red-500">{fieldErrors.websiteOrProfileUrl}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Purpose of Visit <span className="text-red-500">*</span></Label>
                <textarea
                  required
                  rows={3}
                  maxLength={2000}
                  className="flex w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple"
                  value={formData.purposeOfVisit}
                  onChange={handleChange('purposeOfVisit')}
                  placeholder="Describe the purpose of the visit (e.g., guest lectures, research collaboration discussion, lab visits, MOU ceremony)..."
                />
                {fieldErrors.purposeOfVisit && <p className="text-xs text-red-500">{fieldErrors.purposeOfVisit}</p>}
              </div>

              {/* 4.4 Split host into hostName and hostDepartment */}
              <div className="space-y-2">
                <Label>Host Faculty / Coordinator at IITDh</Label>
                <Input
                  maxLength={200}
                  value={formData.hostName}
                  onChange={handleChange('hostName')}
                  placeholder="e.g. Prof. Ramesh Chandra"
                />
              </div>

              <div className="space-y-2">
                <Label>Host Department at IITDh</Label>
                <Input
                  maxLength={200}
                  value={formData.hostDepartment}
                  onChange={handleChange('hostDepartment')}
                  placeholder="e.g. Dept. of Computer Science & Engineering"
                />
              </div>

              <div className="space-y-2">
                <Label>Visit Start Date <span className="text-red-500">*</span></Label>
                <Input
                  type="date"
                  required
                  value={formData.visitFrom}
                  onChange={handleChange('visitFrom')}
                  className={fieldErrors.visitFrom ? 'border-red-500' : ''}
                />
                {fieldErrors.visitFrom && <p className="text-xs text-red-500">{fieldErrors.visitFrom}</p>}
              </div>

              <div className="space-y-2">
                <Label>Visit End Date</Label>
                <Input
                  type="date"
                  value={formData.visitTo}
                  onChange={handleChange('visitTo')}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Remarks / Protocol Requirements</Label>
                <textarea
                  rows={2}
                  maxLength={1000}
                  className="flex w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple"
                  value={formData.remarks}
                  onChange={handleChange('remarks')}
                  placeholder="Special dietary requirements, transit assistance, campus accommodation needs, etc."
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-purple hover:bg-brand-purpleDark mt-8 py-6 text-base font-semibold cursor-pointer"
            >
              {loading ? 'Submitting...' : 'Register Visit'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
