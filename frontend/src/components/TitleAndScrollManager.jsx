import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { headerOffset } from '../utils/scroll';

const BASE_TITLE = 'IIT Dharwad';

const ROUTE_TITLES = {
  '/': `International Relations Office | ${BASE_TITLE}`,
  '/about': `About Us | IRO ${BASE_TITLE}`,
  '/international-admissions': `International Admissions | ${BASE_TITLE}`,
  '/international-admissions/apply': `Apply Online - International Admissions | ${BASE_TITLE}`,
  '/admission': `International Admissions | ${BASE_TITLE}`,
  '/apply': `Apply Online - International Admissions | ${BASE_TITLE}`,
  '/international-mobility': `International Mobility | ${BASE_TITLE}`,
  '/international-mobility/apply': `Apply Online - International Mobility | ${BASE_TITLE}`,
  '/collaboration': `International Mobility | ${BASE_TITLE}`,
  '/inbound-exchange/apply': `Apply Online - International Mobility | ${BASE_TITLE}`,
  '/partners': `Global Partners & Collaborations | ${BASE_TITLE}`,
  '/visa': `Visa & Immigration Guidance | ${BASE_TITLE}`,
  '/downloads': `Downloads & Resources | IRO ${BASE_TITLE}`,
  '/life': `Campus Life at IIT Dharwad | ${BASE_TITLE}`,
  '/visits': `International Delegations & Visits | ${BASE_TITLE}`,
  '/gallery': `Campus & Delegation Gallery | ${BASE_TITLE}`,
  '/contact': `Contact Us | IRO ${BASE_TITLE}`,
  '/search': `Search Portal | IRO ${BASE_TITLE}`,
  '/opportunities': `Global Opportunities | ${BASE_TITLE}`,
  '/iro/delegate-registration': `Visiting Delegation Registration | ${BASE_TITLE}`,
  '/students': `Outbound Mobility Portal | IITDh Students`,
  '/students/apply': `Apply for Outbound Mobility | ${BASE_TITLE}`,
  '/students/track': `Track Outbound Application | ${BASE_TITLE}`,
  '/faculty-portal': `Faculty Portal | IRO ${BASE_TITLE}`,
  '/admin/login': `Admin Login | IRO ${BASE_TITLE}`,
  '/admin': `Admin Dashboard | IRO ${BASE_TITLE}`,
  '/admin/applications': `Degree Applications | Admin IRO`,
  '/admin/inbound-exchange': `Inbound Exchange Applications | Admin IRO`,
  '/admin/outbound-applications': `Outbound Applications | Admin IRO`,
  '/admin/site-content': `Site Content Manager | Admin IRO`,
  '/admin/announcements': `Announcements | Admin IRO`,
  '/admin/contacts': `Directory & Contacts | Admin IRO`,
  '/admin/downloads': `Downloads Manager | Admin IRO`,
  '/admin/events': `Events Manager | Admin IRO`,
  '/admin/faculty': `Faculty Profiles | Admin IRO`,
  '/admin/faqs': `FAQs Management | Admin IRO`,
  '/admin/gallery': `Gallery Management | Admin IRO`,
  '/admin/mous': `MOUs Management | Admin IRO`,
  '/admin/opportunities': `Opportunities Management | Admin IRO`,
  '/admin/partners': `Partners Management | Admin IRO`,
  '/admin/programs': `Academic Programs | Admin IRO`,
  '/admin/reports': `Analytics & Reports | Admin IRO`,
  '/admin/team': `Team Management | Admin IRO`,
  '/admin/testimonials': `Testimonials | Admin IRO`,
  '/admin/visitors': `Visitors Log | Admin IRO`,
  '/admin/notifications': `Notifications | Admin IRO`,
};

// Many sections (FAQs, faculty, MOUs) render only after their data loads, so a
// #hash target is looked for, and re-aligned as content above it settles, for
// this long.
const HASH_WAIT_MS = 3000;
const HASH_RETRY_MS = 100;
// Breathing room between the sticky header and the section heading.
const HASH_GAP_PX = 8;
// Input that means the visitor is moving the page themselves. Scroll position
// alone can't tell: the browser also shifts it when content above loads.
const USER_SCROLL_EVENTS = ['wheel', 'touchstart', 'keydown', 'mousedown'];

const decodeHash = (hash) => {
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return hash.slice(1);
  }
};

export default function TitleAndScrollManager() {
  const { pathname, hash } = useLocation();
  const lastPathnameRef = useRef(null);

  useEffect(() => {
    // Normalize path by stripping trailing slash (unless root '/')
    const cleanPath = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

    if (ROUTE_TITLES[cleanPath]) {
      document.title = ROUTE_TITLES[cleanPath];
    } else if (cleanPath.startsWith('/admin')) {
      document.title = `Admin Portal | IRO ${BASE_TITLE}`;
    } else if (cleanPath.startsWith('/students')) {
      document.title = `Student Portal | IRO ${BASE_TITLE}`;
    } else {
      document.title = `404 - Page Not Found | IRO ${BASE_TITLE}`;
    }
  }, [pathname]);

  useEffect(() => {
    // A new page starts at the top. A hash change on the same page keeps the
    // current position until its target is found.
    const pathnameChanged = lastPathnameRef.current !== pathname;
    lastPathnameRef.current = pathname;
    if (pathnameChanged) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    if (!hash || hash === '#') return undefined;
    const id = decodeHash(hash);
    const startedAt = Date.now();
    let userTookOver = false;
    let timer;

    // Once the visitor scrolls, clicks or types, leave the page where they put it.
    const stopAligning = () => {
      userTookOver = true;
      window.clearTimeout(timer);
    };
    USER_SCROLL_EVENTS.forEach((type) => window.addEventListener(type, stopAligning, { passive: true }));

    const alignToTarget = () => {
      if (userTookOver) return;
      const target = document.getElementById(id);
      if (target) {
        const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset() - HASH_GAP_PX);
        if (Math.abs(top - window.scrollY) > 2) {
          window.scrollTo({ top, left: 0, behavior: 'instant' });
        }
      }
      if (Date.now() - startedAt < HASH_WAIT_MS) {
        timer = window.setTimeout(alignToTarget, HASH_RETRY_MS);
      }
    };

    alignToTarget();
    return () => {
      window.clearTimeout(timer);
      USER_SCROLL_EVENTS.forEach((type) => window.removeEventListener(type, stopAligning));
    };
  }, [pathname, hash]);

  return null;
}
