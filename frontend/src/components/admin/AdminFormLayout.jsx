import React from 'react';
import { Button } from '../ui/button';

export default function AdminFormLayout({ title, subtitle, stepName, onCancel, onSave, loading, children }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col md:flex-row bg-gray-50 overflow-hidden font-sans animate-in fade-in duration-300">
      
      {/* LEFT SIDEBAR: Branding */}
      <div className="hidden md:flex flex-col w-1/3 max-w-sm bg-brand-purpleDark text-white p-10 relative shadow-xl z-10">
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="mb-12">
            <img src="/IITDh Logo.svg" alt="IITDh Logo" className="h-16 mb-4" />
            <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
            <p className="text-brand-purpleLight/70 mt-2 text-sm">International Relations Office</p>
          </div>
          
          <div className="flex-1 space-y-8 mt-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-brand-marigold text-brand-purpleDark shadow-[0_0_15px_rgba(255,184,28,0.5)]">
                1
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-white text-lg">
                  {stepName || 'Entity Details'}
                </span>
                <span className="text-white/60 text-sm mt-1">
                  Fill out the required information
                </span>
              </div>
            </div>
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
        <div className="flex flex-col h-full">
          
          {/* Header for mobile (hidden on desktop) */}
          <div className="md:hidden bg-brand-purpleDark text-white p-6 shrink-0 flex items-center justify-between shadow-md z-10">
            <span className="font-bold">Admin Portal</span>
            <span className="text-brand-marigold font-semibold">{stepName || 'Entity Details'}</span>
          </div>

          {/* Form Content Area */}
          <div className="flex-1 p-8 md:p-12 lg:p-16 overflow-y-auto custom-scrollbar">
            <div className="max-w-3xl mx-auto h-full flex flex-col">
              
              <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{title}</h2>
                {subtitle && <p className="text-gray-500">{subtitle}</p>}
              </div>

              <div className="animate-in fade-in slide-in-from-right-4 duration-500 delay-150 fill-mode-both flex-1">
                {children}
              </div>

            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="shrink-0 border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm p-6 md:px-16 flex items-center justify-between z-10">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel} 
              disabled={loading}
              className="w-32 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold"
            >
              Cancel
            </Button>
            
            <Button 
              type="button" 
              onClick={onSave}
              disabled={loading}
              className="w-32 bg-brand-purple hover:bg-brand-purpleDark text-white font-semibold shadow-md"
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>

        </div>
      </div>
      
    </div>
  );
}
