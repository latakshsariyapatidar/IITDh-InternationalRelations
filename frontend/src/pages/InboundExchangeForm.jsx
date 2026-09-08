import React, { useState, useRef } from 'react';
import apiClient from '../api/client';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function InboundExchangeForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    nationality: '',
    homeInstitution: '',
    programType: '',
    duration: ''
  });
  
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRefs = {
    passportCopy: useRef(null),
    photo: useRef(null),
    academicTranscripts: useRef(null),
    recommendationLetter: useRef(null),
    noc: useRef(null),
    cv: useRef(null)
  };

  const handleFileChange = (e, field) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => ({
        ...prev,
        [field]: e.target.files[0]
      }));
    } else {
      const newFiles = { ...files };
      delete newFiles[field];
      setFiles(newFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) payload.append(key, value);
      });
      
      Object.entries(files).forEach(([key, file]) => {
        payload.append(key, file);
      });

      await apiClient.post('/inbound-exchange', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccess(true);
      setFormData({
        firstName: '', lastName: '', email: '', nationality: '', 
        homeInstitution: '', programType: '', duration: ''
      });
      setFiles({});
      Object.values(fileInputRefs).forEach(ref => {
        if (ref.current) ref.current.value = '';
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Ensure all fields are filled properly and files are valid.');
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
          <h2 className="text-2xl font-bold text-gray-900">Application Submitted</h2>
          <p className="text-gray-600">Your exchange application has been received successfully. We will contact you soon.</p>
          <Button onClick={() => setSuccess(false)} variant="outline" className="mt-4 w-full border-brand-purple text-brand-purple">
            Submit Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Inbound Exchange Application</h1>
          <p className="text-lg text-gray-600">
            Apply for an exchange, internship, or visiting research position at IIT Dharwad.
          </p>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-brand-purpleDark border-b pb-2">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>First Name <span className="text-red-500">*</span></Label>
                  <Input 
                    required 
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name <span className="text-red-500">*</span></Label>
                  <Input 
                    required 
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email <span className="text-red-500">*</span></Label>
                  <Input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nationality <span className="text-red-500">*</span></Label>
                  <Input 
                    required 
                    value={formData.nationality}
                    onChange={e => setFormData({...formData, nationality: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Home Institution <span className="text-red-500">*</span></Label>
                  <Input 
                    required 
                    value={formData.homeInstitution}
                    onChange={e => setFormData({...formData, homeInstitution: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-brand-purpleDark border-b pb-2">Program Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Program Type <span className="text-red-500">*</span></Label>
                  <select 
                    required
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple"
                    value={formData.programType}
                    onChange={e => setFormData({...formData, programType: e.target.value})}
                  >
                    <option value="">Select a program...</option>
                    <option value="EXCHANGE">Exchange Program</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="RESEARCH">Research Stay</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Intended Duration <span className="text-red-500">*</span></Label>
                  <Input 
                    required 
                    value={formData.duration}
                    onChange={e => setFormData({...formData, duration: e.target.value})}
                    placeholder="e.g. Fall 2026, 6 Months, etc."
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-brand-purpleDark border-b pb-2">Documents</h3>
              <p className="text-sm text-gray-500 mb-4">Please upload PDF, JPG, or PNG files. Max 10MB per file.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: 'passportCopy', label: 'Passport Copy *', required: true },
                  { id: 'photo', label: 'Photograph *', required: true },
                  { id: 'academicTranscripts', label: 'Academic Transcripts *', required: true },
                  { id: 'recommendationLetter', label: 'Recommendation Letter' },
                  { id: 'noc', label: 'No Objection Certificate (NOC)' },
                  { id: 'cv', label: 'Curriculum Vitae (CV) *', required: true }
                ].map(field => (
                  <div key={field.id} className="space-y-2 border p-4 rounded-md bg-gray-50/50">
                    <Label>{field.label}</Label>
                    <input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-purple file:text-white hover:file:bg-brand-purpleDark"
                      required={field.required}
                      ref={fileInputRefs[field.id]}
                      onChange={(e) => handleFileChange(e, field.id)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-purple hover:bg-brand-purpleDark mt-8 py-6 text-lg"
            >
              {loading ? 'Submitting Application...' : 'Submit Application'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
