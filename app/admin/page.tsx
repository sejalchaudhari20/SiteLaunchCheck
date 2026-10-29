import { reportRepository } from '@/lib/reports/repository';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Fetch aggregate data safely from in-memory repository
  let totalAudits = 0;
  let completedAudits = 0;
  let totalUsers = 0; // In-memory won't track users easily, we'll default to 0 or mock
  let recentAudits: any[] = [];

  let recentFeedback: any[] = [];

  try {
    const allReports = await reportRepository.getAllReports();
    totalAudits = allReports.length;
    completedAudits = allReports.filter(r => r.launchStatus === 'READY TO LAUNCH' || r.launchStatus === 'ALMOST READY' || r.launchStatus === 'NEEDS FIXES').length; // Assuming all generated reports are completed
    
    // Sort and get recent 5
    recentAudits = allReports.slice(0, 5).map(report => ({
      id: report.reportId,
      domain: new URL(report.url).hostname,
      score: report.overallScore,
      status: 'Completed',
      createdAt: report.timestamp,
    }));
    
    const allFeedback = await reportRepository.getAllFeedback();
    recentFeedback = allFeedback.slice(0, 5);
  } catch (error) {
    console.error("Failed to load reports.", error);
  }
  
  const completionRate = totalAudits > 0 ? ((completedAudits / totalAudits) * 100).toFixed(1) : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading text-dark">SiteLaunchCheck Admin</h1>
        <p className="text-muted mt-2 text-lg">Monitor product usage (Data resets on Vercel redeploys since no DB is used).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <p className="text-sm text-muted font-medium uppercase tracking-wider">Total Audits</p>
          <p className="text-3xl font-bold mt-2 text-dark">{totalAudits}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <p className="text-sm text-muted font-medium uppercase tracking-wider">Completed</p>
          <p className="text-3xl font-bold mt-2 text-dark">{completedAudits}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <p className="text-sm text-muted font-medium uppercase tracking-wider">Completion Rate</p>
          <p className="text-3xl font-bold mt-2 text-dark">{completionRate}%</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <p className="text-sm text-muted font-medium uppercase tracking-wider">Total Users</p>
          <p className="text-3xl font-bold mt-2 text-dark">N/A</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-bold text-dark">Recent Audits</h2>
            <Link href="/admin/audits" className="text-sm font-medium text-primary hover:underline">View All</Link>
          </div>
          <div className="p-6 flex-1">
            {recentAudits.length === 0 ? (
              <p className="text-muted">No audits yet. Once users start auditing websites, activity will appear here.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-sm text-muted">
                      <th className="pb-3 font-medium">Domain</th>
                      <th className="pb-3 font-medium">Score</th>
                      <th className="pb-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {recentAudits.map((audit: any) => (
                      <tr key={audit.id} className="border-b border-border/50 hover:bg-gray-50">
                        <td className="py-3 font-medium text-dark">{audit.domain}</td>
                        <td className="py-3">{Math.round(audit.score) || 'N/A'}</td>
                        <td className="py-3 text-muted">{new Date(audit.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-bold text-dark">Recent Feedback</h2>
            <Link href="/admin/feedback" className="text-sm font-medium text-primary hover:underline">View All</Link>
          </div>
          <div className="p-6 flex-1">
            {recentFeedback.length === 0 ? (
              <p className="text-muted">No feedback yet. Once users submit feedback, it will appear here.</p>
            ) : (
              <div className="space-y-4">
                {recentFeedback.map((fb: any) => (
                  <div key={fb.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      {fb.source === 'landing_page' ? (
                        <div className="flex items-center text-yellow-500 font-bold text-sm">
                          {'★'.repeat(fb.rating || 0)}{'☆'.repeat(5 - (fb.rating || 0))}
                        </div>
                      ) : (
                        <div className={`font-bold text-xs px-2 py-0.5 rounded-full ${fb.helpful ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {fb.helpful ? 'HELPFUL' : 'NEEDS WORK'}
                        </div>
                      )}
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs font-medium text-gray-500">{fb.feedbackType || (fb.source === 'landing_page' ? 'General' : 'Report Feedback')}</span>
                    </div>
                    <p className="text-gray-800 text-sm italic mb-1">"{fb.message}"</p>
                    <div className="text-xs text-gray-400">{new Date(fb.createdAt || fb.timestamp).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
