import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const STEPS = [
  "Program Selection",
  "Academic Details",
  "Motivation & Documents"
];

export default function OutboundApply() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [partners, setPartners] = useState([]);

  const [formData, setFormData] = useState({
    partnerId: '',
    rollNumber: '',
    branch: '',
    currentYear: '',
    cgpa: '',
    programType: 'SEMESTER_EXCHANGE',
    intendedSemester: '',
    motivation: '',
  });

  const [files, setFiles] = useState({});

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await apiClient.get('/partners?limit=100');
        setPartners(res.data?.data?.partners || []);
      } catch (err) {
        console.error('Failed to load partners', err);
      }
    };
    fetchPartners();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList[0]) {
      setFiles(prev => ({ ...prev, [name]: fileList[0] }));
    } else {
      setFiles(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== STEPS.length - 1) {
      handleNext(e);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        payload.append(key, formData[key]);
      });
      Object.keys(files).forEach(key => {
        payload.append(key, files[key]);
      });

      await apiClient.post('/outbound-applications', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while submitting your application.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="h-screen w-screen bg-brand-purpleDark flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Application Submitted!</h2>
          <p className="text-gray-600 text-lg">
            Your outbound application has been successfully submitted to the IRO for review.
          </p>
          <Button onClick={() => navigate('/students/track')} className="mt-4 bg-brand-purple hover:bg-brand-purpleDark w-full">
            Track Application
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 flex flex-col md:flex-row font-sans">
      
      {/* LEFT SIDEBAR: Progress / Branding */}
      <div className="hidden md:flex flex-col w-1/3 max-w-sm bg-brand-purpleDark text-white p-10 relative">
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="mb-12">
            <img src="/IITDh Logo.svg" alt="IITDh Logo" className="h-16 mb-4" />
            <h1 className="text-3xl font-bold tracking-tight">Outbound Mobility</h1>
            <p className="text-brand-purpleLight/70 mt-2 text-sm">International Relations Office</p>
          </div>
          
          <div className="flex-1 space-y-8">
            {STEPS.map((step, idx) => {
              const isActive = idx === currentStep;
              const isPast = idx < currentStep;
              return (
                <div key={step} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isActive ? 'bg-brand-marigold text-brand-purpleDark shadow-[0_0_15px_rgba(255,184,28,0.5)]' : 
                    isPast ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40'
                  }`}>
                    {isPast ? '✓' : idx + 1}
                  </div>
                  <span className={`font-semibold transition-colors duration-300 ${isActive ? 'text-white' : isPast ? 'text-white/80' : 'text-white/40'}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-marigold/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 -right-24 w-64 h-64 bg-brand-purpleLight/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* RIGHT SIDE: Form Area */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          
          {/* Header for mobile (hidden on desktop) */}
          <div className="md:hidden bg-brand-purpleDark text-white p-6 shrink-0 flex items-center justify-between">
            <span className="font-bold">Step {currentStep + 1} of {STEPS.length}</span>
            <span className="text-brand-marigold font-semibold">{STEPS[currentStep]}</span>
          </div>

          {/* Form Content Area (Scrollable internally if needed, but designed to fit) */}
          <div className="flex-1 p-8 md:p-16 overflow-y-auto custom-scrollbar">
            <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
              
              <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{STEPS[currentStep]}</h2>
                <p className="text-gray-500">Please provide your details below.</p>
                {error && (
                  <div className="mt-4 bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 text-sm font-medium">
                    {error}
                  </div>
                )}
              </div>

              {/* STEP 1: Program Selection */}
              <div className={currentStep === 0 ? 'block animate-in fade-in slide-in-from-right-4 duration-500' : 'hidden'}>
                <div className="grid grid-cols-1 gap-y-5">
                  <div className="space-y-2">
                    <Label>Partner University <span className="text-red-500">*</span></Label>
                    <select required={currentStep === 0} name="partnerId" value={formData.partnerId} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="" disabled>Select a partner university</option>
                      {partners.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.country})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Program Type <span className="text-red-500">*</span></Label>
                    <select required={currentStep === 0} name="programType" value={formData.programType} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="SEMESTER_EXCHANGE">Semester Exchange</option>
                      <option value="RESEARCH_INTERNSHIP">Research Internship</option>
                      <option value="SUMMER_PROGRAM">Summer Program</option>
                      <option value="DUAL_DEGREE">Dual Degree</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Intended Semester / Duration <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 0} name="intendedSemester" value={formData.intendedSemester} onChange={handleInputChange} placeholder="e.g. Fall 2026 or 3 months" />
                  </div>
                </div>
              </div>

              {/* STEP 2: Academic Details */}
              <div className={currentStep === 1 ? 'block animate-in fade-in slide-in-from-right-4 duration-500' : 'hidden'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="space-y-2">
                    <Label>IITDh Roll Number <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 1} name="rollNumber" value={formData.rollNumber} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Year of Study <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 1} name="currentYear" value={formData.currentYear} onChange={handleInputChange} placeholder="e.g. 3rd Year" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Branch / Department <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 1} name="branch" value={formData.branch} onChange={handleInputChange} placeholder="e.g. Computer Science and Engineering" />
                  </div>
                  <div className="space-y-2">
                    <Label>Current CGPA <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 1} name="cgpa" value={formData.cgpa} onChange={handleInputChange} placeholder="e.g. 8.5" />
                  </div>
                </div>
              </div>

              {/* STEP 3: Motivation & Documents */}
              <div className={currentStep === 2 ? 'block animate-in fade-in slide-in-from-right-4 duration-500' : 'hidden'}>
                <div className="grid grid-cols-1 gap-y-5">
                  <div className="space-y-2">
                    <Label>Motivation / Statement of Purpose <span className="text-red-500">*</span></Label>
                    <textarea required={currentStep === 2} name="motivation" value={formData.motivation} onChange={handleInputChange} className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Briefly describe why you want to apply for this program..." />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Academic Transcripts (PDF) <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 2} type="file" name="transcript" accept=".pdf" onChange={handleFileChange} className="cursor-pointer" />
                  </div>
                  <div className="space-y-2">
                    <Label>NOC / Endorsement Form (Optional)</Label>
                    <Input type="file" name="recommendationLetter" accept=".pdf" onChange={handleFileChange} className="cursor-pointer" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="shrink-0 border-t bg-gray-50/50 p-6 md:px-16 flex items-center justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePrev} 
              disabled={currentStep === 0 || loading}
              className="w-32"
            >
              Previous
            </Button>
            
            <Button 
              type="submit" 
              disabled={loading}
              className="w-32 bg-brand-purple hover:bg-brand-purpleDark"
            >
              {loading ? 'Processing...' : currentStep === STEPS.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </div>

        </form>
      </div>
      
    </div>
  );
}
