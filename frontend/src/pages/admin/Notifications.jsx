import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';

export default function Notifications() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/notifications');
      // The API might just return an array directly under data, or data.notifications
      setData(res.data?.data?.notifications || res.data?.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleScan = async () => {
    try {
      await apiClient.post('/notifications/scan');
      fetchNotifications();
    } catch (err) {
      alert('Failed to run scan');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiClient.post('/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      alert('Failed to mark all as read');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      alert('Failed to mark as read');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this notification?')) return;
    try {
      await apiClient.delete(`/notifications/${id}`);
      fetchNotifications();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <div className="space-x-2">
          <Button onClick={handleScan} variant="outline" className="border-brand-purple text-brand-purple">
            Run Scan Now
          </Button>
          <Button onClick={handleMarkAllRead} className="bg-brand-purple hover:bg-brand-purpleDark">
            Mark All Read
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-md shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Message</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-4">Loading...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-4">No notifications.</TableCell></TableRow>
            ) : (
              data.map(item => (
                <TableRow key={item.id} className={item.isRead ? 'bg-gray-50/50 text-gray-500' : 'bg-white font-medium'}>
                  <TableCell>{item.message}</TableCell>
                  <TableCell>
                    <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">{item.type}</span>
                  </TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {item.isRead ? 'Read' : <span className="text-brand-purple font-bold">Unread</span>}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {!item.isRead && (
                      <Button variant="outline" size="sm" onClick={() => handleMarkRead(item.id)}>Mark Read</Button>
                    )}
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
