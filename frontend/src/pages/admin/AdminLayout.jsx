import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../api/client';
import { Bell } from 'lucide-react';

const AdminLayout = () => {
  const { logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await apiClient.get('/notifications/unread-count');
        setUnreadCount(res.data?.data?.unread || 0);
      } catch (err) {
        console.error('Failed to fetch unread notifications count');
      }
    };
    fetchUnreadCount();
    // optionally could poll, but we'll just fetch once on mount for now
  }, []);

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r flex flex-col h-full shrink-0 shadow-sm z-10">
        <div className="p-4 border-b shrink-0 bg-brand-purpleDark text-white flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-wider">IRO ADMIN</h1>
          <Link to="/admin/notifications" className="relative text-white hover:text-gray-200">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-sm">
          <Link to="/admin" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">Dashboard</Link>
          <div className="pt-4 pb-2 px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">CMS & Applications</div>
          <Link to="/admin/site-content" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">Site Content</Link>
          <Link to="/admin/applications" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">Inbound Apps</Link>
          <Link to="/admin/outbound-applications" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">Outbound Apps</Link>
          <Link to="/admin/inbound-exchange" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">Inbound Exchange</Link>
          
          <div className="pt-6 pb-2 px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Resources</div>
          <Link to="/admin/announcements" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">Announcements</Link>
          <Link to="/admin/contacts" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">Contacts</Link>
          <Link to="/admin/downloads" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">Downloads</Link>
          <Link to="/admin/events" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">Events</Link>
          <Link to="/admin/faculty" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">Faculty</Link>
          <Link to="/admin/faqs" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">FAQs</Link>
          <Link to="/admin/gallery" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">Gallery</Link>
          <Link to="/admin/mous" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">MOUs</Link>
          <Link to="/admin/opportunities" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">Opportunities</Link>
          <Link to="/admin/partners" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">Partners</Link>
          <Link to="/admin/programs" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">Programs</Link>
          <Link to="/admin/reports" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">Reports</Link>
          <Link to="/admin/team" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">Team</Link>
          <Link to="/admin/testimonials" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">Testimonials</Link>
          <Link to="/admin/visitors" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">Visitors</Link>
        </nav>
        <div className="p-4 border-t shrink-0">
          <button 
            onClick={logout} 
            className="w-full text-left p-2 rounded-md hover:bg-red-50 text-red-600 font-semibold transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 md:p-8 overflow-y-auto h-full relative">
        <div className="max-w-6xl mx-auto pb-24">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
