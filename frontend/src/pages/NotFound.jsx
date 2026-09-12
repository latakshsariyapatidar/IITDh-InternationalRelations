import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { RiHome4Line } from '@remixicon/react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-neutral-canvas relative overflow-hidden">
      {/* Decorative ambient background blur orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-marigold/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Large 404 Badge */}
        <h1 className="text-7xl sm:text-9xl font-extrabold tracking-tight text-brand-purpleDark mb-4">
          4<span className="text-brand-marigold">0</span>4
        </h1>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Oops! Looks like you've ventured off the map.
        </h2>

        <p className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto mb-10 leading-relaxed">
          The page you are looking for may have been moved, renamed, or no longer exists.
        </p>


        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto flex items-center gap-2 bg-brand-purple hover:bg-brand-purpleDark text-white px-6"
          >
            <RiHome4Line size={16} />
            <span>Return to Home</span>
          </Button>
        </div>

        {/* Assistance footer */}
        <p className="mt-12 text-xs text-gray-500">
          Need immediate assistance? Email us at{' '}
          <a href="mailto:iro@iitdh.ac.in" className="text-brand-purple underline hover:text-brand-purpleDark font-medium">
            iro@iitdh.ac.in
          </a>
        </p>
      </div>
    </div>
  );
}
