import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PhotoFrame from '../components/ui/PhotoFrame';
import CTAButton from '../components/ui/CTAButton';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="bg-porcelain">
      <div className="mx-auto grid min-h-[75vh] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-12 lg:px-8">
        <div className="md:col-span-7">
          <p className="font-heading! text-2xl text-saffron-deep">404</p>
          <h1 className="mt-3 text-[2.6rem] sm:text-5xl font-medium leading-[1.05] tracking-[-0.02em] text-plum-deep">
            This door doesn't lead anywhere.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-body">
            The page you are looking for may have been moved, renamed, or no longer exists.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <CTAButton label="Return to Home" onClick={() => navigate('/')} size="lg" />
            <CTAButton label="Search the site" to="/search" variant="secondary" size="lg" />
          </div>

          <p className="mt-12 text-sm text-quiet">
            Need immediate assistance? Email us at{' '}
            <a href="mailto:office.iro@iitdh.ac.in" className="text-plum underline decoration-saffron underline-offset-4 hover:decoration-plum">
              office.iro@iitdh.ac.in
            </a>
            , or go to <Link to="/contact" className="text-plum underline decoration-saffron underline-offset-4 hover:decoration-plum">Contact Us</Link>.
          </p>
        </div>

        {/* The campus, as a reminder of where you are */}
        <div className="hidden md:col-span-5 md:flex md:justify-end">
          <PhotoFrame src="/institute/Institute1.jpg" className="aspect-[4/3] w-full max-w-[28rem]" />
        </div>
      </div>
    </div>
  );
}
