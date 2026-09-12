import React, { useState } from 'react';
import apiClient from '../api/client';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { compressDocument, formatBytes } from '../utils/fileCompressor';

const STEPS = [
  "Personal Details",
  "Contact Info",
  "Home Academic Info",
  "Exchange & Stay Details",
  "Documents"
];

const STEP_DESCRIPTIONS = [
  "Please provide your personal and passport identification details.",
  "Provide your contact information and emergency contact person.",
  "Tell us about your home university and current program of study.",
  "Specify your desired mobility track, department, timeline, and stay details at IIT Dharwad.",
  "Upload clear PDF or image copies of the required supporting documents."
];

const INITIAL_FORM_STATE = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: 'PREFER_NOT_TO_SAY',
  nationality: '',
  countryOfResidence: '',
  passportNumber: '',
  passportExpiryDate: '',

  email: '',
  phone: '',
  currentAddress: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelation: '',

  homeUniversity: '',
  homeUniversityCountry: '',
  homeProgramOfStudy: '',
  programLevel: 'UNDERGRADUATE',
  programLevelOther: '',

  exchangeType: 'SEMESTER_EXCHANGE',
  exchangeTypeOther: '',
  proposedDepartment: '',
  proposedFacultyHost: '',
  intendedStayFrom: '',
  intendedStayTo: '',
  purposeOfVisit: '',
  visaCategory: '',
  requiresVisaSponsorship: 'true',
};

export default function InboundExchangeForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [files, setFiles] = useState({});
  const [compressing, setCompressing] = useState({});
  const [compressionStats, setCompressionStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

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

  const handleNext = (e) => {
    e.preventDefault();
    setError(null);

    // Custom step validations
    if (currentStep === 3) {
      if (formData.intendedStayFrom && formData.intendedStayTo) {
        if (new Date(formData.intendedStayTo) < new Date(formData.intendedStayFrom)) {
          setError("End date of stay cannot be earlier than start date of stay.");
          return;
        }
      }
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const handlePrev = () => {
    setError(null);
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

    // Required files check on Step 5
    if (!files.passportCopy) {
      setError("Please upload your Passport Copy.");
      return;
    }
    if (!files.photo) {
      setError("Please upload your Recent Photograph.");
      return;
    }
    if (!files.academicTranscripts) {
      setError("Please upload your Academic Transcripts.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          payload.append(key, value);
        }
      });

      for (const [key, file] of Object.entries(files)) {
        if (!file.compressedSize && (file.type?.startsWith('image/') || file.type === 'application/pdf')) {
          const compressed = await compressDocument(file);
          payload.append(key, compressed);
        } else {
          payload.append(key, file);
        }
      }

      await apiClient.post('/inbound-exchange', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 413) {
        setError('Uploaded files exceed the server upload limit. Please ensure each file is compressed and under 2MB.');
      } else {
        setError(err.response?.data?.message || 'An error occurred while submitting your exchange application.');
      }
    } finally {
      setLoading(false);
    }
  };

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

  const renderFileInput = (name, label, required = false) => {
    return (
      <div className="space-y-2 border border-dashed border-gray-300 p-4 rounded-xl hover:border-brand-purple transition-colors bg-gray-50/50">
        <Label className="flex justify-between items-center text-sm font-semibold text-gray-700">
          <span>{label} {required && <span className="text-red-500">*</span>}</span>
        </Label>
        <Input 
          type="file" 
          name={name} 
          required={currentStep === 4 && required && !files[name]} 
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
          className="cursor-pointer bg-white file:bg-brand-purple file:text-white file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 file:text-xs hover:file:bg-brand-purpleDark"
        />
        {renderFileBadge(name)}
      </div>
    );
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
          <h2 className="text-3xl font-bold text-gray-900">Exchange Application Submitted!</h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Thank you for applying for international mobility at IIT Dharwad. Your application has been received and is currently under review by the International Relations Office.
          </p>
          <div className="space-y-3 pt-2">
            <Button onClick={() => window.location.href = '/international-mobility'} className="w-full bg-brand-purple hover:bg-brand-purpleDark">
              Return to International Mobility
            </Button>
            <Button onClick={() => window.location.href = '/'} variant="outline" className="w-full">
              Return to Home
            </Button>
          </div>
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
            <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-marigold/20 text-brand-marigold mb-2">
              Non-Degree Mobility
            </div>
            <h1 className="text-3xl font-bold tracking-tight">International Mobility</h1>
            <p className="text-brand-purpleLight/70 mt-1 text-sm">International Relations Office</p>
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
                <p className="text-gray-500 mt-2 text-sm">{STEP_DESCRIPTIONS[currentStep]}</p>
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
                      <Label>Gender <span className="text-red-500">*</span></Label>
                      <select 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
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
                      <Input required={currentStep === 1} name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1..." />
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
                      <Label>Emergency Contact Phone <span className="text-red-500">*</span></Label>
                      <Input required={currentStep === 1} name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Emergency Contact Relation</Label>
                      <Input name="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleInputChange} placeholder="e.g. Parent, Guardian, Spouse" />
                    </div>
                  </div>
                </div>

                {/* STEP 3: Home Academic Info */}
                <div className={currentStep === 2 ? 'block animate-in fade-in slide-in-from-right-4 duration-500' : 'hidden'}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="space-y-2">
                      <Label>Home University / Institution <span className="text-red-500">*</span></Label>
                      <Input required={currentStep === 2} name="homeUniversity" value={formData.homeUniversity} onChange={handleInputChange} placeholder="e.g. Technical University of Munich" />
                    </div>
                    <div className="space-y-2">
                      <Label>Home University Country <span className="text-red-500">*</span></Label>
                      <Input required={currentStep === 2} name="homeUniversityCountry" value={formData.homeUniversityCountry} onChange={handleInputChange} placeholder="e.g. Germany" />
                    </div>
                    <div className="space-y-2">
                      <Label>Current Major / Program of Study <span className="text-red-500">*</span></Label>
                      <Input required={currentStep === 2} name="homeProgramOfStudy" value={formData.homeProgramOfStudy} onChange={handleInputChange} placeholder="e.g. B.S. in Computer Science" />
                    </div>
                    <div className="space-y-2">
                      <Label>Current Level of Study <span className="text-red-500">*</span></Label>
                      <select 
                        name="programLevel" 
                        value={formData.programLevel} 
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="UNDERGRADUATE">Undergraduate</option>
                        <option value="POSTGRADUATE">Postgraduate / Masters</option>
                        <option value="PHD">Ph.D. Scholar</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    {formData.programLevel === 'OTHER' && (
                      <div className="space-y-2 md:col-span-2">
                        <Label>Specify Current Level of Study <span className="text-red-500">*</span></Label>
                        <Input required={currentStep === 2 && formData.programLevel === 'OTHER'} name="programLevelOther" value={formData.programLevelOther} onChange={handleInputChange} placeholder="e.g. Postdoctoral Researcher" />
                      </div>
                    )}
                  </div>
                </div>

                {/* STEP 4: Exchange & Stay Details */}
                <div className={currentStep === 3 ? 'block animate-in fade-in slide-in-from-right-4 duration-500' : 'hidden'}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="space-y-2">
                      <Label>Exchange Mobility Type <span className="text-red-500">*</span></Label>
                      <select 
                        name="exchangeType" 
                        value={formData.exchangeType} 
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="SEMESTER_EXCHANGE">Semester Exchange (Coursework)</option>
                        <option value="RESEARCH_INTERNSHIP">Research Internship / Attachment</option>
                        <option value="SUMMER_PROGRAM">Summer / Short-Term Program</option>
                        <option value="OTHER">Other Mobility Track</option>
                      </select>
                    </div>
                    {formData.exchangeType === 'OTHER' && (
                      <div className="space-y-2">
                        <Label>Specify Exchange Type <span className="text-red-500">*</span></Label>
                        <Input required={currentStep === 3 && formData.exchangeType === 'OTHER'} name="exchangeTypeOther" value={formData.exchangeTypeOther} onChange={handleInputChange} placeholder="e.g. Project Internship" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Proposed IITDH Department</Label>
                      <Input name="proposedDepartment" value={formData.proposedDepartment} onChange={handleInputChange} placeholder="e.g. Computer Science & Engineering" />
                    </div>
                    <div className="space-y-2">
                      <Label>Proposed Faculty Host / Mentor (if identified)</Label>
                      <Input name="proposedFacultyHost" value={formData.proposedFacultyHost} onChange={handleInputChange} placeholder="e.g. Prof. Jane Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Intended Stay From <span className="text-red-500">*</span></Label>
                      <Input required={currentStep === 3} type="date" name="intendedStayFrom" value={formData.intendedStayFrom} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label>Intended Stay To <span className="text-red-500">*</span></Label>
                      <Input required={currentStep === 3} type="date" name="intendedStayTo" value={formData.intendedStayTo} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Statement of Purpose / Objectives <span className="text-red-500">*</span></Label>
                      <textarea 
                        required={currentStep === 3}
                        name="purposeOfVisit" 
                        rows={4}
                        value={formData.purposeOfVisit} 
                        onChange={handleInputChange} 
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Briefly describe your objectives, intended courses or research plan, and reasons for choosing IIT Dharwad..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Visa Category (if decided)</Label>
                      <Input name="visaCategory" value={formData.visaCategory} onChange={handleInputChange} placeholder="e.g. Student Visa / Research Visa" />
                    </div>
                    <div className="space-y-2">
                      <Label>Requires Visa Sponsorship Letter?</Label>
                      <select 
                        name="requiresVisaSponsorship" 
                        value={formData.requiresVisaSponsorship} 
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* STEP 5: Documents */}
                <div className={currentStep === 4 ? 'block animate-in fade-in slide-in-from-right-4 duration-500' : 'hidden'}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderFileInput('passportCopy', 'Passport Copy (Info pages)', true)}
                    {renderFileInput('photo', 'Recent Passport-size Photograph', true)}
                    {renderFileInput('academicTranscripts', 'Academic Transcripts', true)}
                    {renderFileInput('nominationLetter', 'Nomination Letter from Home University')}
                    {renderFileInput('statementOfPurpose', 'Statement of Purpose / Research Proposal')}
                    {renderFileInput('financialProof', 'Proof of Financial Support')}
                    {renderFileInput('recommendationLetter', 'Letter of Recommendation')}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="border-t bg-gray-50/80 backdrop-blur px-6 md:px-16 py-4 flex items-center justify-between z-10">
            <Button
              type="button"
              variant="ghost"
              onClick={handlePrev}
              disabled={currentStep === 0 || loading}
              className="text-gray-600 hover:text-gray-900"
            >
              Back
            </Button>
            <div className="flex items-center gap-3">
              {currentStep < STEPS.length - 1 ? (
                <Button
                  type="submit"
                  className="bg-brand-purple hover:bg-brand-purpleDark text-white px-8"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-brand-purple hover:bg-brand-purpleDark text-white px-8"
                >
                  {loading ? 'Submitting Application...' : 'Submit Exchange Application'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>

    </div>
  );
}
