'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, Activity, BarChart, Clock, Lock } from 'lucide-react';
import { AnalyticsEvent } from '@/lib/analytics/repository';

// Hardcoded for demonstration as requested
const ADMIN_PASSWORD = 'admin';

export default function AdminAnalyticsDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Authentication Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  // Fetch events once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      fetch('/api/analytics')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setEvents(data);
          } else {
            console.error('Invalid analytics data format:', data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load analytics:', err);
          setLoading(false);
        });
    }
  }, [isAuthenticated]);

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 mb-8">Enter the master password to view internal analytics.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center text-lg tracking-widest"
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <button
              type="submit"
              className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary-dark transition-colors"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard View
  const totalAuditsStarted = events.filter(e => e.name === 'audit_started').length;
  const totalAuditsCompleted = events.filter(e => e.name === 'audit_completed').length;
  const totalReportsDownloaded = events.filter(e => e.name === 'report_downloaded').length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <span className="font-heading font-bold text-lg text-gray-900">Admin Analytics</span>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            Lock Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Audits Started</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalAuditsStarted}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <BarChart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Audits Completed</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalAuditsCompleted}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <BarChart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Reports Downloaded</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalReportsDownloaded}</h3>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Event History</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Real-time tracking</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Event Name</th>
                  <th className="px-6 py-4">Properties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      Loading analytics data...
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                      No events recorded yet. Run an audit to generate data!
                    </td>
                  </tr>
                ) : (
                  events.map(event => (
                    <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {event.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 font-mono text-xs overflow-x-auto">
                          {Object.keys(event.properties).length > 0 ? (
                            <pre>{JSON.stringify(event.properties, null, 2)}</pre>
                          ) : (
                            <span className="text-gray-400 italic">No properties</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
