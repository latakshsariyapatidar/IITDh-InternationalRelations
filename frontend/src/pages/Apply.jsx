import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { fetchAllPages } from '../api/fetchAllPages';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { compressDocument, formatBytes } from '../utils/fileCompressor';
import { extractValidationErrors } from '../utils/formErrors';
import { isNepalOrBhutanNational } from '../utils/nationality';

const STEPS = [
  "Personal Details",
  "Contact Info",
  "Academic Info",
  "Visa Info",
  "Documents"
];

// The documents the office asks for, all scanned into one PDF. "(if any)"
// items are optional; the rest are required.
const DOCUMENT_CHECKLIST = [
  'Grade cards (10th, 12th and UG)',
  'Statement of Purpose (SOP)',
  'Recommendation by two members',
  'Passport copy (ID card for Nepal / Bhutan nationals)',
  'Work experience (if any)',
  'Publications (if any)',
];

const STEP_FIELD_MAP = {
  0: ['firstName', 'lastName', 'dateOfBirth', 'gender', 'nationality', 'countryOfResidence', 'passportNumber', 'passportExpiryDate', 'citizenshipNo'],
  1: ['email', 'phone', 'currentAddress', 'emergencyContactName', 'emergencyContactRelation', 'emergencyContactPhone'],
  2: ['programLevel', 'programLevelOther', 'programAppliedFor', 'discipline', 'intendedIntake', 'highestQualification', 'previousInstitution', 'previousGradeOrGPA', 'englishTestType', 'englishTestScore', 'greScore'],
  3: ['requiresVisaSponsorship', 'visaCategory'],
  4: ['combinedDocuments', 'photo']
};

export default function Apply() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [referenceId, setReferenceId] = useState(null);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [programs, setPrograms] = useState([]);
  const [isCustomProgram, setIsCustomProgram] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dateOfBirth: '', gender: 'PREFER_NOT_TO_SAY',
    nationality: '', countryOfResidence: '', passportNumber: '', passportExpiryDate: '', citizenshipNo: '',
    email: '', phone: '', currentAddress: '', emergencyContactName: '',
    emergencyContactRelation: '', emergencyContactPhone: '',
    // 4.1: Must be UNDERGRADUATE, POSTGRADUATE, PHD, or OTHER
    programLevel: 'UNDERGRADUATE',
    programLevelOther: '',
    programAppliedFor: '', discipline: '', intendedIntake: '',
    highestQualification: '', previousInstitution: '', previousGradeOrGPA: '',
    englishTestType: '', englishTestScore: '', greScore: '', visaCategory: '',
    requiresVisaSponsorship: 'true',
  });

  const [files, setFiles] = useState({});
  const nepalOrBhutan = isNepalOrBhutanNational(formData.nationality);
  const [compressing, setCompressing] = useState({});
  const [compressionStats, setCompressionStats] = useState({});

  useEffect(() => {
    // 4.3 Populate programs catalogue for dropdown
    const fetchPrograms = async () => {
      try {
        const list = await fetchAllPages('/programs', 'programs', { pageSize: 100, params: { isActive: true } });
        setPrograms(list);
      } catch (err) {
        console.warn('Could not load programs catalogue:', err);
      }
    };
    fetchPrograms();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
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
    setFieldErrors({});
    setSuccess(false);

    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        // If programLevel is not OTHER, do not submit programLevelOther
        if (key === 'programLevelOther' && formData.programLevel !== 'OTHER') {
          return;
        }
        // The citizenship number only applies to Nepal and Bhutan nationals.
        if (key === 'citizenshipNo' && !nepalOrBhutan) {
          return;
        }
        if (formData[key] !== undefined && formData[key] !== '') {
          payload.append(key, formData[key]);
        }
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

      const res = await apiClient.post('/applications', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const ref = res.data?.data?.referenceId || res.data?.data?.id || 'SUBMITTED';
      setReferenceId(ref);
      setSuccess(true);
    } catch (err) {
      console.error('Application submission error:', err);
      // 1.8: Backend allows 5 MB for application documents
      if (err.response?.status === 413) {
        setError('Uploaded files exceed the server upload limit. The documents PDF must be under 10 MB and the photo under 5 MB.');
        return;
      }

      // 4.2 & 1.3: Parse validation errors and jump back to the step that has the bad field
      const { fieldErrors: extractedFields, errorList, generalMessage } = extractValidationErrors(err);
      setFieldErrors(extractedFields);

      let targetStep = -1;
      if (errorList.length > 0) {
        const firstBadField = errorList[0].field;
        for (let stepIdx = 0; stepIdx < STEPS.length; stepIdx++) {
          if (STEP_FIELD_MAP[stepIdx]?.includes(firstBadField)) {
            targetStep = stepIdx;
            break;
          }
        }
      }

      if (targetStep >= 0 && targetStep !== currentStep) {
        setCurrentStep(targetStep);
        setError(`Please check Step ${targetStep + 1} (${STEPS[targetStep]}): ${errorList[0].message}`);
      } else {
        setError(generalMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="h-screen w-screen bg-brand-purpleDark flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Application Submitted!</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Thank you for applying for degree studies at IIT Dharwad. Your application has been successfully submitted and forwarded to the International Relations Office.
          </p>

          {/* 1.13: Show Reference ID */}
          {referenceId && (
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-center">
              <p className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-1">Application Reference Number</p>
              <p className="font-mono text-lg font-bold text-brand-purple select-all">{referenceId}</p>
              <p className="text-[11px] text-gray-500 mt-1">Please quote this reference ID in all future correspondence.</p>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Button onClick={() => window.location.href = '/international-admissions'} className="w-full bg-brand-purple hover:bg-brand-purpleDark cursor-pointer">
              Return to International Admissions
            </Button>
            <Button onClick={() => window.location.href = '/'} variant="outline" className="w-full cursor-pointer">
              Return to Home
            </Button>
          </div>
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
            <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-marigold/20 text-brand-marigold mb-2">
              Degree Programs
            </div>
            <h1 className="text-3xl font-bold tracking-tight">International Admissions</h1>
            <p className="text-brand-purpleLight/70 mt-1 text-sm">International Relations Office</p>
          </div>
          
          <div className="flex-1 space-y-8">
            {STEPS.map((step, idx) => {
              const isActive = idx === currentStep;
              const isPast = idx < currentStep;

              return (
                <div key={step} className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentStep(idx)}>
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
                    <Input required={currentStep === 0} name="firstName" value={formData.firstName} onChange={handleInputChange} className={fieldErrors.firstName ? 'border-red-500' : ''} />
                    {fieldErrors.firstName && <p className="text-xs text-red-500">{fieldErrors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 0} name="lastName" value={formData.lastName} onChange={handleInputChange} className={fieldErrors.lastName ? 'border-red-500' : ''} />
                    {fieldErrors.lastName && <p className="text-xs text-red-500">{fieldErrors.lastName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 0} type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className={fieldErrors.dateOfBirth ? 'border-red-500' : ''} />
                    {fieldErrors.dateOfBirth && <p className="text-xs text-red-500">{fieldErrors.dateOfBirth}</p>}
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
                    <Input required={currentStep === 0} name="nationality" value={formData.nationality} onChange={handleInputChange} className={fieldErrors.nationality ? 'border-red-500' : ''} />
                    {fieldErrors.nationality && <p className="text-xs text-red-500">{fieldErrors.nationality}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Country of Residence <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 0} name="countryOfResidence" value={formData.countryOfResidence} onChange={handleInputChange} className={fieldErrors.countryOfResidence ? 'border-red-500' : ''} />
                    {fieldErrors.countryOfResidence && <p className="text-xs text-red-500">{fieldErrors.countryOfResidence}</p>}
                  </div>
                  {nepalOrBhutan && (
                    <div className="space-y-2 md:col-span-2">
                      <Label>Citizenship Number <span className="text-red-500">*</span></Label>
                      <Input required={currentStep === 0} name="citizenshipNo" value={formData.citizenshipNo} onChange={handleInputChange} className={fieldErrors.citizenshipNo ? 'border-red-500' : ''} />
                      <p className="text-xs text-gray-500">Nepal and Bhutan nationals give their citizenship number. Passport details are optional.</p>
                      {fieldErrors.citizenshipNo && <p className="text-xs text-red-500">{fieldErrors.citizenshipNo}</p>}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Passport Number {!nepalOrBhutan && <span className="text-red-500">*</span>}</Label>
                    <Input required={currentStep === 0 && !nepalOrBhutan} name="passportNumber" value={formData.passportNumber} onChange={handleInputChange} className={fieldErrors.passportNumber ? 'border-red-500' : ''} />
                    {fieldErrors.passportNumber && <p className="text-xs text-red-500">{fieldErrors.passportNumber}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Passport Expiry Date {!nepalOrBhutan && <span className="text-red-500">*</span>}</Label>
                    <Input required={currentStep === 0 && !nepalOrBhutan} type="date" name="passportExpiryDate" value={formData.passportExpiryDate} onChange={handleInputChange} className={fieldErrors.passportExpiryDate ? 'border-red-500' : ''} />
                    {fieldErrors.passportExpiryDate && <p className="text-xs text-red-500">{fieldErrors.passportExpiryDate}</p>}
                  </div>
                </div>
              </div>

              {/* STEP 2: Contact Info */}
              <div className={currentStep === 1 ? 'block animate-in fade-in slide-in-from-right-4 duration-500' : 'hidden'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="space-y-2">
                    <Label>Email Address <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 1} type="email" name="email" value={formData.email} onChange={handleInputChange} className={fieldErrors.email ? 'border-red-500' : ''} />
                    {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 1} name="phone" value={formData.phone} onChange={handleInputChange} className={fieldErrors.phone ? 'border-red-500' : ''} />
                    {fieldErrors.phone && <p className="text-xs text-red-500">{fieldErrors.phone}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Current Residential Address <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 1} name="currentAddress" value={formData.currentAddress} onChange={handleInputChange} className={fieldErrors.currentAddress ? 'border-red-500' : ''} />
                    {fieldErrors.currentAddress && <p className="text-xs text-red-500">{fieldErrors.currentAddress}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Emergency Contact Name <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 1} name="emergencyContactName" value={formData.emergencyContactName} onChange={handleInputChange} className={fieldErrors.emergencyContactName ? 'border-red-500' : ''} />
                    {fieldErrors.emergencyContactName && <p className="text-xs text-red-500">{fieldErrors.emergencyContactName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Emergency Contact Relation <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 1} name="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleInputChange} className={fieldErrors.emergencyContactRelation ? 'border-red-500' : ''} />
                    {fieldErrors.emergencyContactRelation && <p className="text-xs text-red-500">{fieldErrors.emergencyContactRelation}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Emergency Contact Phone <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 1} name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleInputChange} className={fieldErrors.emergencyContactPhone ? 'border-red-500' : ''} />
                    {fieldErrors.emergencyContactPhone && <p className="text-xs text-red-500">{fieldErrors.emergencyContactPhone}</p>}
                  </div>
                </div>
              </div>

              {/* STEP 3: Academic Info */}
              <div className={currentStep === 2 ? 'block animate-in fade-in slide-in-from-right-4 duration-500' : 'hidden'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="space-y-2">
                    <Label>Program Level <span className="text-red-500">*</span></Label>
                    {/* 4.1: Proper enum options matching backend schema */}
                    <select
                      required={currentStep === 2}
                      name="programLevel"
                      value={formData.programLevel}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="UNDERGRADUATE">Bachelors (Undergraduate)</option>
                      <option value="POSTGRADUATE">Masters (Postgraduate)</option>
                      <option value="PHD">PhD (Doctoral)</option>
                      <option value="OTHER">Other (please specify)</option>
                    </select>
                    {fieldErrors.programLevel && <p className="text-xs text-red-500">{fieldErrors.programLevel}</p>}
                  </div>

                  {formData.programLevel === 'OTHER' && (
                    <div className="space-y-2">
                      <Label>Specify Program Level <span className="text-red-500">*</span></Label>
                      <Input
                        required={currentStep === 2 && formData.programLevel === 'OTHER'}
                        name="programLevelOther"
                        value={formData.programLevelOther}
                        onChange={handleInputChange}
                        placeholder="e.g. Postdoctoral Fellow / Special Diploma"
                        className={fieldErrors.programLevelOther ? 'border-red-500' : ''}
                      />
                      {fieldErrors.programLevelOther && <p className="text-xs text-red-500">{fieldErrors.programLevelOther}</p>}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Program Applied For <span className="text-red-500">*</span></Label>
                      {programs.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setIsCustomProgram(prev => !prev)}
                          className="text-[11px] text-brand-purple hover:underline"
                        >
                          {isCustomProgram ? 'Select from list' : 'Type custom'}
                        </button>
                      )}
                    </div>
                    {programs.length > 0 && !isCustomProgram ? (
                      <select
                        required={currentStep === 2}
                        name="programAppliedFor"
                        value={formData.programAppliedFor}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select a Program</option>
                        {programs.map(p => (
                          <option key={p.id} value={p.name}>
                            {p.name} ({p.level || p.department})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        required={currentStep === 2}
                        name="programAppliedFor"
                        value={formData.programAppliedFor}
                        onChange={handleInputChange}
                        placeholder="e.g. Computer Science & Engineering"
                        className={fieldErrors.programAppliedFor ? 'border-red-500' : ''}
                      />
                    )}
                    {fieldErrors.programAppliedFor && <p className="text-xs text-red-500">{fieldErrors.programAppliedFor}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Discipline <span className="text-red-500">*</span></Label>
                    <select required={currentStep === 2} name="discipline" value={formData.discipline} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="">Select a discipline</option>
                      <option value="ENGINEERING">Engineering</option>
                      <option value="SCIENCE">Science</option>
                    </select>
                    {fieldErrors.discipline && <p className="text-xs text-red-500">{fieldErrors.discipline}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Intended Intake <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 2} name="intendedIntake" value={formData.intendedIntake} onChange={handleInputChange} placeholder="e.g. Autumn 2026" className={fieldErrors.intendedIntake ? 'border-red-500' : ''} />
                    {fieldErrors.intendedIntake && <p className="text-xs text-red-500">{fieldErrors.intendedIntake}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Educational Qualification <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 2} name="highestQualification" value={formData.highestQualification} onChange={handleInputChange} className={fieldErrors.highestQualification ? 'border-red-500' : ''} />
                    {fieldErrors.highestQualification && <p className="text-xs text-red-500">{fieldErrors.highestQualification}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Previous Institution <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 2} name="previousInstitution" value={formData.previousInstitution} onChange={handleInputChange} className={fieldErrors.previousInstitution ? 'border-red-500' : ''} />
                    {fieldErrors.previousInstitution && <p className="text-xs text-red-500">{fieldErrors.previousInstitution}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Percentage / CGPA Obtained <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 2} name="previousGradeOrGPA" value={formData.previousGradeOrGPA} onChange={handleInputChange} className={fieldErrors.previousGradeOrGPA ? 'border-red-500' : ''} />
                    {fieldErrors.previousGradeOrGPA && <p className="text-xs text-red-500">{fieldErrors.previousGradeOrGPA}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>TOEFL / IELTS <span className="text-red-500">*</span></Label>
                    <select required={currentStep === 2} name="englishTestType" value={formData.englishTestType} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="">Select a test</option>
                      <option value="TOEFL">TOEFL</option>
                      <option value="IELTS">IELTS</option>
                    </select>
                    {fieldErrors.englishTestType && <p className="text-xs text-red-500">{fieldErrors.englishTestType}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>TOEFL / IELTS Score <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 2} name="englishTestScore" value={formData.englishTestScore} onChange={handleInputChange} className={fieldErrors.englishTestScore ? 'border-red-500' : ''} />
                    {fieldErrors.englishTestScore && <p className="text-xs text-red-500">{fieldErrors.englishTestScore}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>GRE Score (Optional)</Label>
                    <Input name="greScore" value={formData.greScore} onChange={handleInputChange} className={fieldErrors.greScore ? 'border-red-500' : ''} />
                    {fieldErrors.greScore && <p className="text-xs text-red-500">{fieldErrors.greScore}</p>}
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
                <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg text-sm text-gray-700">
                  <p className="font-semibold text-brand-purple">Scan and attach all documents in a single PDF</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {DOCUMENT_CHECKLIST.map((doc) => <li key={doc}>{doc}</li>)}
                  </ul>
                  <p className="mt-3 text-xs text-gray-500">The PDF can be up to 10 MB. Upload the passport photo separately as a JPEG or PNG, up to 5 MB.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="space-y-2 md:col-span-2">
                    <Label>All Documents (single PDF) <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 4 && !files.combinedDocuments} type="file" name="combinedDocuments" accept=".pdf,application/pdf" onChange={handleFileChange} className="cursor-pointer" />
                    {renderFileBadge('combinedDocuments')}
                    {fieldErrors.combinedDocuments && <p className="text-xs text-red-500">{fieldErrors.combinedDocuments}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Passport Photo <span className="text-red-500">*</span></Label>
                    <Input required={currentStep === 4 && !files.photo} type="file" name="photo" accept=".jpeg,.jpg,.png" onChange={handleFileChange} className="cursor-pointer" />
                    {renderFileBadge('photo')}
                    {fieldErrors.photo && <p className="text-xs text-red-500">{fieldErrors.photo}</p>}
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
              className="w-32 cursor-pointer"
            >
              Previous
            </Button>
            
            <Button 
              type="submit" 
              disabled={loading}
              className="w-32 bg-brand-purple hover:bg-brand-purpleDark cursor-pointer"
            >
              {loading ? 'Processing...' : currentStep === STEPS.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </div>

        </form>
      </div>
      
    </div>
  );
}
