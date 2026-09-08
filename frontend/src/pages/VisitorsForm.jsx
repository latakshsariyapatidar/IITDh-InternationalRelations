import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useStudentAuth } from '../contexts/StudentAuthContext';

export default function VisitorsForm() {
  const { student } = useStudentAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organisation: '',
    country: '',
    designation: '',
    purposeOfVisit: '',
    visitFrom: '',
    visitTo: '',
    phone: '',
    hostName: student?.name ? `Prof. ${student.name}` : ''
  });

  useEffect(() => {
    if (student?.name && !formData.hostName) {
      setFormData(prev => ({ ...prev, hostName: student.name }));
    }
  }, [student]);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
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
        ...(formData.phone && { phone: formData.phone.trim() }),
        ...(formData.hostName && { hostName: formData.hostName.trim() }),
      };

      await apiClient.post('/visitors', payload);
      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        organisation: '',
        country: '',
        designation: '',
        purposeOfVisit: '',
        visitFrom: '',
        visitTo: '',
        phone: '',
        hostName: student?.name || ''
      });
    } catch (err) {
      console.error('Visitor registration error:', err);
      const errors = err.response?.data?.errors;
      const errorMsg = Array.isArray(errors)
        ? errors.map(e => e.message || `${e.path?.join('.')}: invalid`).join(', ')
        : err.response?.data?.message || 'Failed to submit visitor registration.';
      setError(errorMsg);
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
          <p className="text-gray-600">The visiting delegation details have been registered successfully. The International Relations Office will review the itinerary and coordinate campus access passes.</p>
          <div className="pt-2 space-y-2">
            <Button onClick={() => setSuccess(false)} variant="outline" className="w-full border-brand-purple text-brand-purple">
              Register Another Delegation
            </Button>
            <Link to="/faculty-portal" className="w-full inline-block">
              <Button className="w-full bg-brand-purple hover:bg-brand-purpleDark text-white">
                Return to Faculty Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/faculty-portal"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-purple hover:text-brand-purpleDark mb-6 transition-colors"
        >
          ← Back to Faculty Portal
        </Link>

        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-md bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-wider mb-2">
            Faculty Hosted Visits
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Register Visiting Delegation</h1>
          <p className="text-base text-gray-600">
            Submit itinerary and details for international delegates, visiting professors, and researchers hosted by your department.
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
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  placeholder="Prof. / Dr. / Mr. / Ms. Jane Doe"
                />
              </div>

              <div className="space-y-2">
                <Label>Email <span className="text-red-500">*</span></Label>
                <Input 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="jane.doe@university.edu"
                />
              </div>

              <div className="space-y-2">
                <Label>Institution / Organization <span className="text-red-500">*</span></Label>
                <Input 
                  required 
                  value={formData.organisation}
                  onChange={e => setFormData({...formData, organisation: e.target.value})}
                  placeholder="e.g. University of Tokyo, DAAD"
                />
              </div>

              <div className="space-y-2">
                <Label>Country <span className="text-red-500">*</span></Label>
                <Input 
                  required 
                  value={formData.country}
                  onChange={e => setFormData({...formData, country: e.target.value})}
                  placeholder="e.g. Japan, Germany, India"
                />
              </div>

              <div className="space-y-2">
                <Label>Designation / Role</Label>
                <Input 
                  value={formData.designation}
                  onChange={e => setFormData({...formData, designation: e.target.value})}
                  placeholder="e.g. Professor, Research Scholar, Delegate"
                />
              </div>

              <div className="space-y-2">
                <Label>Contact Phone</Label>
                <Input 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="+1-555-0199"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Purpose of Visit <span className="text-red-500">*</span></Label>
                <textarea 
                  required
                  rows={3}
                  className="flex w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple"
                  value={formData.purposeOfVisit}
                  onChange={e => setFormData({...formData, purposeOfVisit: e.target.value})}
                  placeholder="Describe the purpose of the visit (e.g., guest lectures, research collaboration discussion, lab visits, MOU ceremony)..."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Host Faculty / Department at IITDh</Label>
                <Input 
                  value={formData.hostName}
                  onChange={e => setFormData({...formData, hostName: e.target.value})}
                  placeholder="e.g. Dept. of Computer Science / Prof. Ramesh Chandra"
                />
              </div>

              <div className="space-y-2">
                <Label>Visit Start Date <span className="text-red-500">*</span></Label>
                <Input 
                  type="date" 
                  required 
                  value={formData.visitFrom}
                  onChange={e => setFormData({...formData, visitFrom: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Visit End Date</Label>
                <Input 
                  type="date" 
                  value={formData.visitTo}
                  onChange={e => setFormData({...formData, visitTo: e.target.value})}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-purple hover:bg-brand-purpleDark mt-8 py-6 text-base font-semibold"
            >
              {loading ? 'Submitting...' : 'Register Visit'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
