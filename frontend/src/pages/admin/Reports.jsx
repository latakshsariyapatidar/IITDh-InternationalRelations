import React, { useState } from 'react';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export default function Reports() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [reportType, setReportType] = useState('inbound');
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!from || !to) {
      alert("Please select both 'from' and 'to' dates.");
      return;
    }

    setLoading(true);
    try {
      const url = `/reports/${reportType}?from=${from}&to=${to}&format=xlsx`;
      const res = await apiClient.get(url, { responseType: 'blob' });
      
      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${reportType}_report_${from}_to_${to}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error(err);
      alert('Failed to generate report. Ensure dates are valid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reports</h2>
      </div>

      <div className="bg-white border rounded-md shadow-sm p-6 max-w-xl">
        <h3 className="text-lg font-semibold mb-4">Generate Excel Report</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Report Type</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple"
              value={reportType}
              onChange={e => setReportType(e.target.value)}
            >
              <option value="inbound">Inbound Applications</option>
              <option value="visitors">Visitors</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Input 
                type="date" 
                value={from} 
                onChange={e => setFrom(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Input 
                type="date" 
                value={to} 
                onChange={e => setTo(e.target.value)} 
              />
            </div>
          </div>

          <Button 
            onClick={handleDownload} 
            disabled={loading}
            className="w-full mt-4 bg-brand-purple hover:bg-brand-purpleDark"
          >
            {loading ? 'Generating...' : 'Download Report'}
          </Button>
        </div>
      </div>
    </div>
  );
}
