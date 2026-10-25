import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';

const TYPE_CONFIG = {
  NEW_INBOUND_APPLICATION: { label: 'New Degree Application', defaultPath: '/admin/applications' },
  NEW_EXCHANGE_APPLICATION: { label: 'New Exchange Application', defaultPath: '/admin/inbound-exchange' },
  NEW_VISITOR: { label: 'New Visiting Delegation', defaultPath: '/admin/visitors' },
  VISA_EXPIRING: { label: 'Visa Expiring', defaultPath: '/admin/applications' },
  PASSPORT_EXPIRING: { label: 'Passport Expiring', defaultPath: '/admin/applications' },
  MOU_EXPIRING: { label: 'MOU Expiring', defaultPath: '/admin/mous' },
  EXIT_DATE_APPROACHING: { label: 'Exit Date Approaching', defaultPath: '/admin/applications' },
  OTHER: { label: 'General Notification', defaultPath: null },
};

export default function Notifications() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  // Filters (5.28)
  const [readFilter, setReadFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (readFilter !== '') params.append('isRead', readFilter);
      if (typeFilter) params.append('type', typeFilter);
      if (severityFilter) params.append('severity', severityFilter);

      const res = await apiClient.get(`/notifications?${params.toString()}`);
      const notifs = res.data?.data?.notifications || res.data?.data || [];
      setData(notifs);
      const total = res.data?.data?.total || notifs.length;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      console.error(err);
      alert('Failed to load notifications: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, readFilter, typeFilter, severityFilter]);

  // 5.30 Scan with feedback
  const handleScan = async () => {
    try {
      const res = await apiClient.post('/notifications/scan');
      const { created, emailed } = res.data?.data || {};
      alert(`Scan complete: ${created ?? 0} reminders were created. ${emailed ? 'Digest email was dispatched.' : 'No email was dispatched.'}`);
      fetchNotifications();
      window.dispatchEvent(new Event('notifications-read'));
    } catch (err) {
      alert('Failed to run scan: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiClient.post('/notifications/read-all');
      fetchNotifications();
      window.dispatchEvent(new Event('notifications-read'));
    } catch (err) {
      alert('Failed to mark all as read: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      fetchNotifications();
      window.dispatchEvent(new Event('notifications-read'));
    } catch (err) {
      alert('Failed to mark as read: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this notification?')) return;
    try {
      await apiClient.delete(`/notifications/${id}`);
      fetchNotifications();
      window.dispatchEvent(new Event('notifications-read'));
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.message || err.message));
    }
  };

  const getRecordLink = (item) => {
    if (item.entityType === 'inbound-application' || item.entityType === 'admission') {
      return '/admin/applications';
    }
    if (item.entityType === 'inbound-exchange' || item.entityType === 'exchange') {
      return '/admin/inbound-exchange';
    }
    if (item.entityType === 'mou') {
      return '/admin/mous';
    }
    if (item.entityType === 'visitor') {
      return '/admin/visitors';
    }
    return TYPE_CONFIG[item.type]?.defaultPath || null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications & Alerts</h2>
          <p className="text-sm text-gray-500">System alerts for upcoming expiries, new applications, and administrative events.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleScan} variant="outline" className="border-brand-purple text-brand-purple hover:bg-brand-purple/10">
            Run Scan Now
          </Button>
          <Button onClick={handleMarkAllRead} className="bg-brand-purple hover:bg-brand-purpleDark">
            Mark All Read
          </Button>
        </div>
      </div>

      {/* 5.28 Filters */}
      <div className="bg-white p-4 border rounded-md shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div>
          <Label className="text-xs text-gray-600 mb-1 block">Read Status</Label>
          <select
            className="w-full p-2 border rounded-md bg-white text-sm"
            value={readFilter}
            onChange={(e) => { setReadFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Notifications</option>
            <option value="false">Unread Only</option>
            <option value="true">Read Only</option>
          </select>
        </div>

        <div>
          <Label className="text-xs text-gray-600 mb-1 block">Notification Type</Label>
          <select
            className="w-full p-2 border rounded-md bg-white text-sm"
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Types</option>
            <option value="NEW_INBOUND_APPLICATION">New Degree Application</option>
            <option value="NEW_EXCHANGE_APPLICATION">New Exchange Application</option>
            <option value="NEW_VISITOR">New Visitor Delegation</option>
            <option value="VISA_EXPIRING">Visa Expiring</option>
            <option value="PASSPORT_EXPIRING">Passport Expiring</option>
            <option value="MOU_EXPIRING">MOU Expiring</option>
            <option value="EXIT_DATE_APPROACHING">Exit Date Approaching</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <Label className="text-xs text-gray-600 mb-1 block">Severity</Label>
          <select
            className="w-full p-2 border rounded-md bg-white text-sm"
            value={severityFilter}
            onChange={(e) => { setSeverityFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Severities</option>
            <option value="INFO">Info</option>
            <option value="WARNING">Warning</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      <div className="bg-white border rounded-md shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title & Message</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-4">Loading...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-4">No notifications found.</TableCell></TableRow>
            ) : (
              data.map(item => {
                const recordLink = getRecordLink(item);
                const typeCfg = TYPE_CONFIG[item.type] || { label: item.type };

                return (
                  <TableRow key={item.id} className={item.isRead ? 'bg-gray-50/50 text-gray-500' : 'bg-white font-medium'}>
                    <TableCell className="max-w-md">
                      <div className="font-semibold text-gray-900 mb-0.5 flex items-center gap-2">
                        <span>{item.title || typeCfg.label}</span>
                        {recordLink && (
                          <Link
                            to={recordLink}
                            className="text-xs text-brand-purple hover:underline font-normal inline-flex items-center gap-0.5"
                          >
                            View Record &rarr;
                          </Link>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{item.message}</p>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {typeCfg.label}
                      </span>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase
                        ${item.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                          item.severity === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-700'}`}>
                        {item.severity || 'INFO'}
                      </span>
                    </TableCell>

                    <TableCell className="text-xs whitespace-nowrap">
                      {item.dueDate ? (
                        <span className="font-mono text-gray-700">
                          {new Date(item.dueDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>

                    <TableCell className="text-xs text-gray-600 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {item.isRead ? (
                        <span className="text-xs text-gray-400">Read</span>
                      ) : (
                        <span className="text-xs text-brand-purple font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                          Unread
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                      {!item.isRead && (
                        <Button variant="outline" size="sm" onClick={() => handleMarkRead(item.id)}>
                          Mark Read
                        </Button>
                      )}
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* 5.27 Pagination */}
      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          Previous
        </Button>
        <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
