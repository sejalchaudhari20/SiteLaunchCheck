import { reportRepository } from '@/lib/reports/repository';
import Link from 'next/link';
import { FileSearch } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminAuditsPage() {
  let allAudits: any[] = [];

  try {
    const allReports = await reportRepository.getAllReports();
    allAudits = allReports.map(report => ({
      id: report.reportId,
      url: report.url,
      domain: new URL(report.url).hostname,
      score: report.overallScore,
      status: report.launchStatus,
      createdAt: report.timestamp,
    }));
  } catch (error) {
    console.error("Failed to load reports.", error);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading text-dark">Audits</h1>
        <p className="text-muted mt-2 text-lg">View all website audits performed by users.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-gray-500" /> All Audits
          </h2>
        </div>
        <div className="p-0">
          {allAudits.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No audits found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-sm text-gray-500 bg-white">
                    <th className="py-3 px-6 font-medium">Domain</th>
                    <th className="py-3 px-6 font-medium">Full URL</th>
                    <th className="py-3 px-6 font-medium">Score</th>
                    <th className="py-3 px-6 font-medium">Launch Status</th>
                    <th className="py-3 px-6 font-medium">Date</th>
                    <th className="py-3 px-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {allAudits.map((audit: any) => (
                    <tr key={audit.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-900">{audit.domain}</td>
                      <td className="py-4 px-6 text-gray-500 max-w-[250px] truncate" title={audit.url}>
                        <a href={audit.url} target="_blank" rel="noreferrer" className="hover:underline">{audit.url}</a>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-bold ${audit.score >= 80 ? 'text-green-600' : audit.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {Math.round(audit.score)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                          audit.status === 'READY TO LAUNCH' ? 'bg-green-100 text-green-700' :
                          audit.status === 'ALMOST READY' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {audit.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500">{new Date(audit.createdAt).toLocaleString()}</td>
                      <td className="py-4 px-6 text-right">
                        <Link href={`/report/${audit.id}`} className="text-primary hover:text-primary-dark font-medium text-sm">
                          View Report
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
