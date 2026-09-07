import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { useStudentAuth } from '../../contexts/StudentAuthContext';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';

export default function OutboundTrack() {
  const { logout } = useStudentAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await apiClient.get('/outbound-applications/mine');
        setApplications(res.data?.data || []);
      } catch (err) {
        console.error('Failed to load applications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/students');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
      case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'NOMINATED': return 'bg-purple-100 text-purple-800';
      case 'ACCEPTED_BY_PARTNER': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'WITHDRAWN': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-brand-purpleDark text-white px-6 py-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-4">
          <img src="/IITDh Logo.svg" alt="IITDh Logo" className="h-10" />
          <h1 className="text-xl font-bold hidden sm:block">Student Portal</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="text-brand-purpleDark border-transparent bg-brand-marigold hover:bg-brand-marigoldDark" onClick={() => navigate('/students/apply')}>
            New Application
          </Button>
          <Button variant="ghost" className="text-brand-purpleLight hover:text-white hover:bg-white/10" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-6 mt-8">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">My Applications</h2>
          <p className="text-gray-500 mt-2">Track the status of your outbound mobility applications.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead>Program Type</TableHead>
                <TableHead>Partner University</TableHead>
                <TableHead>Intended Semester</TableHead>
                <TableHead>Submitted On</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">Loading applications...</TableCell>
                </TableRow>
              ) : applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-gray-500 flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    You haven't submitted any outbound applications yet.
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium text-gray-900">{app.programType.replace('_', ' ')}</TableCell>
                    <TableCell>{app.partner?.name || 'Unknown Partner'}</TableCell>
                    <TableCell>{app.intendedSemester}</TableCell>
                    <TableCell>{new Date(app.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                        {app.status.replace(/_/g, ' ')}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
