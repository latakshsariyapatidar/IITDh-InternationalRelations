import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
  '/visitors/register': `Visitor Registration | ${BASE_TITLE}`,
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

export default function TitleAndScrollManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll window to top on route navigation
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

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

  return null;
}
