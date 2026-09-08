import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { useStudentAuth } from '../contexts/StudentAuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/shadcn-card';

export default function Opportunities() {
  const { isStudentAuthenticated } = useStudentAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpps = async () => {
      setLoading(true);
      try {
        let endpoint = '/opportunities';
        if (isStudentAuthenticated) {
          endpoint = '/opportunities/feed';
        }

        const res = await apiClient.get(endpoint);
        setOpportunities(res.data?.data?.opportunities || res.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch opportunities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpps();
  }, [isStudentAuthenticated]);

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Opportunities</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover scholarships, internships, exchanges, and research opportunities available through the International Relations Office.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border shadow-sm">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Opportunities Found</h3>
            <p className="text-gray-500">Check back later for new postings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map(opp => (
              <Card key={opp.id} className="flex flex-col h-full hover:shadow-md transition-shadow duration-200 border-t-4 border-t-brand-purple">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-brand-purple bg-brand-purple/10 px-2 py-1 rounded-md mb-2 inline-block">
                      {opp.category}
                    </span>
                    {opp.audience && opp.audience !== 'BOTH' && (
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        {opp.audience}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-tight">{opp.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1 whitespace-pre-wrap">
                    {opp.description || 'No description provided.'}
                  </p>

                  <div className="mt-auto space-y-4">
                    {opp.visibleUntil && (
                      <p className="text-xs text-red-500 font-medium">
                        Closes: {new Date(opp.visibleUntil).toLocaleDateString()}
                      </p>
                    )}

                    {(opp.externalUrl || opp.url) && (
                      <a
                        href={opp.externalUrl || opp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-purple hover:bg-brand-purpleDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple transition-colors"
                      >
                        View & Apply
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
