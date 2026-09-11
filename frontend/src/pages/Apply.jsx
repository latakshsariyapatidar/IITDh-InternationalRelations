import React, { useState } from 'react';
import apiClient from '../api/client';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { compressDocument, formatBytes } from '../utils/fileCompressor';

const STEPS = [
  "Personal Details",
  "Contact Info",
  "Academic Info",
  "Visa Info",
  "Documents"
];

export default function Apply() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dateOfBirth: '', gender: 'PREFER_NOT_TO_SAY',
    nationality: '', countryOfResidence: '', passportNumber: '', passportExpiryDate: '',
    email: '', phone: '', currentAddress: '', emergencyContactName: '',
    emergencyContactRelation: '', emergencyContactPhone: '',
    programLevel: 'BACHELORS', programAppliedFor: '', intendedIntake: '',
    highestQualification: '', previousInstitution: '', previousGradeOrGPA: '',
    englishTestType: 'NOT_APPLICABLE', englishTestScore: '', visaCategory: '',
    requiresVisaSponsorship: 'true',
  });

  const [files, setFiles] = useState({});
  const [compressing, setCompressing] = useState({});
  const [compressionStats, setCompressionStats] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList[0]) {
      const originalFile = fileList[0];
      setCompressing(prev => ({ ...prev, [name]: true }));
      try {
        const compressed = await compressDocument(originalFile);
        setFiles(prev => ({ ...prev, [name]: compressed }));
        setCompressionStats(prev => ({
          ...prev,
          [name]: {
            original: originalFile.size,
            compressed: compressed.size,
            reduction: compressed.reductionPercent || 0,
          }
        }));
      } catch (err) {
        console.warn('Compression fallback to original file:', err);
        setFiles(prev => ({ ...prev, [name]: originalFile }));
      } finally {
        setCompressing(prev => ({ ...prev, [name]: false }));
      }
    } else {
      setFiles(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
      setCompressionStats(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validateStep = () => {
    // Basic validation just relying on HTML5 required attributes for now, 
    // handled by form onSubmit for next steps.
    return true; 
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

      // Ensure any pending file compression completes before payload creation
      for (const [key, file] of Object.entries(files)) {
        if (!file.compressedSize && (file.type?.startsWith('image/') || file.type === 'application/pdf')) {
          const compressed = await compressDocument(file);
          payload.append(key, compressed);
        } else {
          payload.append(key, file);
        }
      }

      await apiClient.post('/applications', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 413) {
        setError('Uploaded files exceed the server upload limit. Please ensure each file is compressed and under 2MB.');
      } else {
        setError(err.response?.data?.message || 'An error occurred while submitting your application.');
      }
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
            Thank you for applying to IIT Dharwad. Your application has been received and is currently under review.
          </p>
          <Button onClick={() => window.location.href = '/'} className="mt-4 bg-brand-purple hover:bg-brand-purpleDark w-full">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  const renderFileBadge = (name) => {
    if (compressing[name]) {
      return <p className="text-xs text-brand-purple animate-pulse mt-1">Compressing document...</p>;
    }
    const stat = compressionStats[name];
    if (stat) {
      return (
        <p className="text-xs text-green-600 flex items-center gap-1 mt-1 font-medium">
          <span>✓ Ready:</span>
          <span>{formatBytes(stat.compressed)}</span>
          {stat.reduction > 0 && (
            <span className="text-gray-500 font-normal">
              (reduced by {stat.reduction}%)
            </span>
          )}
        </p>
      );
    }
    return null;
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 flex flex-col md:flex-row font-sans">
      
      {/* LEFT SIDEBAR: Progress / Branding */}
      <div className="hidden md:flex flex-col w-1/3 max-w-sm bg-brand-purpleDark text-white p-10 relative">
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="mb-12">
            <img src="/IITDh Logo.svg" alt="IITDh Logo" className="h-16 mb-4" />
            <h1 className="text-3xl font-bold tracking-tight">Admissions</h1>
            <p className="text-brand-purpleLight/70 mt-2 text-sm">International Relations Office</p>
          </div>
          
          <div className="flex-1 space-y-8">
            {STEPS.map((step, idx) => {
              const isActive = idx === currentStep;
              const isPast = idx < currentStep;

              return (
                <div key={step} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300
                    ${isActive ? 'bg-brand-marigold text-brand-purpleDark' : 
                      isPast ? 'bg-brand-purple text-white' : 'bg-brand-purple/40 text-brand-purpleLight/40'}`}>
                    {isPast ? '✓' : idx + 1}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${isActive ? 'text-white font-bold' : isPast ? 'text-brand-purpleLight/80' : 'text-brand-purpleLight/40'}`}>
                      {step}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-xs text-brand-purpleLight/40 border-t border-brand-purple/20 pt-6">
            IIT Dharwad, Permanent Campus, Chikkamalligawad, Karnataka - 580007
          </div>
        </div>
        
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-marigold/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 -right-24 w-64 h-64 bg-brand-purpleLight/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6 md:p-16">
            <div className="max-w-2xl mx-auto space-y-8">
              
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-marigold">Step {currentStep + 1} of {STEPS.length}</span>
                <h2 className="text-3xl font-bold text-gray-900 mt-1">{STEPS[currentStep]}</h2>
                <p className="text-gray-500 mt-2 text-sm">Please provide accurate information as per your official documents.</p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-6">

              {/* STEP 1: Personal Details */}
              <div className={currentStep === 0 ? 'block animate-in fade-in slide-in-from-right-4 duration-500' : 'hidden'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="space-y-2">
                    <Label>First Name <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 0} name="firstName" value={formData.firstName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 0} name="lastName" value={formData.lastName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 0} type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                      <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Nationality <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 0} name="nationality" value={formData.nationality} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Country of Residence <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 0} name="countryOfResidence" value={formData.countryOfResidence} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Passport Number <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 0} name="passportNumber" value={formData.passportNumber} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Passport Expiry Date <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 0} type="date" name="passportExpiryDate" value={formData.passportExpiryDate} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              {/* STEP 2: Contact Info */}
              <div className={currentStep === 1 ? 'block animate-in fade-in slide-in-from-right-4 duration-500' : 'hidden'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="space-y-2">
                    <Label>Email Address <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 1} type="email" name="email" value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 1} name="phone" value={formData.phone} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Current Residential Address <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 1} name="currentAddress" value={formData.currentAddress} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Emergency Contact Name <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 1} name="emergencyContactName" value={formData.emergencyContactName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Emergency Contact Relation <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 1} name="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Emergency Contact Phone <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 1} name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              {/* STEP 3: Academic Info */}
              <div className={currentStep === 2 ? 'block animate-in fade-in slide-in-from-right-4 duration-500' : 'hidden'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="space-y-2">
                    <Label>Program Level <span className="text-red-500">*</span></Label>
                    <select required={currentStep === 2} name="programLevel" value={formData.programLevel} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="BACHELORS">Bachelors</option>
                      <option value="MASTERS">Masters</option>
                      <option value="PHD">PhD</option>
                      <option value="POSTDOC">Postdoc</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Program Applied For <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 2} name="programAppliedFor" value={formData.programAppliedFor} onChange={handleInputChange} placeholder="e.g. Computer Science" />
                  </div>
                  <div className="space-y-2">
                    <Label>Intended Intake <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 2} name="intendedIntake" value={formData.intendedIntake} onChange={handleInputChange} placeholder="e.g. Fall 2026" />
                  </div>
                  <div className="space-y-2">
                    <Label>Highest Qualification <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 2} name="highestQualification" value={formData.highestQualification} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Previous Institution <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 2} name="previousInstitution" value={formData.previousInstitution} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Previous Grade / GPA <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 2} name="previousGradeOrGPA" value={formData.previousGradeOrGPA} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>English Test Type</Label>
                    <select name="englishTestType" value={formData.englishTestType} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="NOT_APPLICABLE">Not Applicable</option>
                      <option value="IELTS">IELTS</option>
                      <option value="TOEFL">TOEFL</option>
                      <option value="PTE">PTE</option>
                      <option value="DUOLINGO">Duolingo</option>
                      <option value="NATIVE_SPEAKER">Native Speaker</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>English Test Score</Label>
                    <Input name="englishTestScore" value={formData.englishTestScore} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              {/* STEP 4: Visa Info */}
              <div className={currentStep === 3 ? 'block animate-in fade-in slide-in-from-right-4 duration-500' : 'hidden'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="space-y-2">
                    <Label>Requires Visa Sponsorship? <span className="text-red-500">*</span></Label>
                    <select required={currentStep === 3} name="requiresVisaSponsorship" value={formData.requiresVisaSponsorship} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Current Visa Category (If applicable)</Label>
                    <Input name="visaCategory" value={formData.visaCategory} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              {/* STEP 5: Documents */}
              <div className={currentStep === 4 ? 'block animate-in fade-in slide-in-from-right-4 duration-500' : 'hidden'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="space-y-2">
                    <Label>Passport Copy <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 4} type="file" name="passportCopy" accept=".pdf,.jpeg,.jpg,.png" onChange={handleFileChange} className="cursor-pointer" />
                    {renderFileBadge('passportCopy')}
                  </div>
                  <div className="space-y-2">
                    <Label>Photo <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 4} type="file" name="photo" accept=".jpeg,.jpg,.png" onChange={handleFileChange} className="cursor-pointer" />
                    {renderFileBadge('photo')}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Academic Transcripts <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 4} type="file" name="academicTranscripts" accept=".pdf,.jpeg,.jpg,.png" onChange={handleFileChange} className="cursor-pointer" />
                    {renderFileBadge('academicTranscripts')}
                  </div>
                  <div className="space-y-2">
                    <Label>English Test Score Card</Label>
                    <Input type="file" name="englishTestScoreCard" accept=".pdf,.jpeg,.jpg,.png" onChange={handleFileChange} className="cursor-pointer" />
                    {renderFileBadge('englishTestScoreCard')}
                  </div>
                  <div className="space-y-2">
                    <Label>Statement of Purpose</Label>
                    <Input type="file" name="statementOfPurpose" accept=".pdf,.jpeg,.jpg,.png" onChange={handleFileChange} className="cursor-pointer" />
                    {renderFileBadge('statementOfPurpose')}
                  </div>
                  <div className="space-y-2">
                    <Label>Financial Proof</Label>
                    <Input type="file" name="financialProof" accept=".pdf,.jpeg,.jpg,.png" onChange={handleFileChange} className="cursor-pointer" />
                    {renderFileBadge('financialProof')}
                  </div>
                  <div className="space-y-2">
                    <Label>Recommendation Letter</Label>
                    <Input type="file" name="recommendationLetter" accept=".pdf,.jpeg,.jpg,.png" onChange={handleFileChange} className="cursor-pointer" />
                    {renderFileBadge('recommendationLetter')}
                </div>
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
