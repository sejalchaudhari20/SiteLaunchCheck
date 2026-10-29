'use client';

import { useEffect, useState, use } from 'react';
import { ReportData } from '@/types/audit';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, ExternalLink, Calendar, Printer, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
import CategoryScores from '@/components/audit/CategoryScores';
import { FeedbackWidget } from '@/components/FeedbackWidget';

export default function DetailedReportPage(props: { params: Promise<{ reportId: string }> }) {
  const { reportId } = use(props.params);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/report/${reportId}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to load report');
        }
        
        setReport(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReport();
  }, [reportId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Report Not Found</h1>
        <p className="text-gray-600 mb-6">{error || 'The requested report does not exist or has expired.'}</p>
        <Link href="/" className="bg-primary text-white px-6 py-2 rounded-lg font-medium">Go Home</Link>
      </div>
    );
  }

  const handlePrint = () => {
    import('@/lib/analytics').then(m => m.trackReportDownloaded('internal', 'pdf'));
    window.print();
  };

  const formattedDate = new Date(report.timestamp).toLocaleString(undefined, {
    dateStyle: 'long',
    timeStyle: 'short'
  });

  const criticalIssues = report.results.filter(r => r.status === 'FAIL' || r.severity === 'CRITICAL');
  const warnings = report.results.filter(r => r.status === 'WARNING' && r.severity !== 'CRITICAL');
  const passedChecks = report.results.filter(r => r.status === 'PASS');

  let statusColor = 'bg-red-100 text-red-700 border-red-200';
  if (report.launchStatus === 'READY TO LAUNCH') {
    statusColor = 'bg-green-100 text-green-700 border-green-200';
  } else if (report.launchStatus === 'ALMOST READY') {
    statusColor = 'bg-yellow-100 text-yellow-700 border-yellow-200';
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans print:bg-white">
      {/* Navigation - Hidden in print */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 print:hidden">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="font-heading font-bold text-lg tracking-tight hidden sm:inline-block text-gray-900">
                SiteLaunchCheck
              </span>
            </Link>
            <Link href={`/audit?url=${encodeURIComponent(report.url)}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium ml-4">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Results</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href={`/report/${reportId}/client`} className="text-sm font-medium text-primary hover:underline">
              View Client Report
            </Link>
            <button onClick={handlePrint} className="inline-flex items-center gap-2 text-gray-700 hover:text-primary font-medium mr-4">
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 print-p-0 print:py-8">
        
        {/* REPORT HEADER */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-8 print-shadow-none print-break-inside-avoid">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Detailed Launch Report</h1>
              <div className="flex items-center gap-4 text-gray-500">
                <div className="flex items-center gap-1">
                  <ExternalLink className="w-4 h-4" />
                  <a href={report.url} target="_blank" rel="noreferrer" className="hover:text-primary">{report.url.replace(/^https?:\/\//, '')}</a>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 text-right">
              <div className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-2">Launch Status</div>
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border ${statusColor}`}>
                {report.launchStatus}
              </div>
              <div className="mt-4">
                <span className="text-5xl font-black text-gray-900">{Math.round(report.overallScore)}</span>
                <span className="text-xl text-gray-400 font-bold">/100</span>
              </div>
            </div>
          </div>

          {/* SUMMARY GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="text-gray-500 text-sm font-medium mb-1">Total Checks</div>
              <div className="text-2xl font-bold text-gray-900">{report.results.length}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <div className="text-green-700 text-sm font-medium mb-1">Passed</div>
              <div className="text-2xl font-bold text-green-700">{report.summary.passed}</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
              <div className="text-yellow-700 text-sm font-medium mb-1">Warnings</div>
              <div className="text-2xl font-bold text-yellow-700">{report.summary.warnings}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <div className="text-red-700 text-sm font-medium mb-1">Critical Issues</div>
              <div className="text-2xl font-bold text-red-700">{report.summary.critical}</div>
            </div>
          </div>
        </div>

        {/* CATEGORY SCORES */}
        <div className="mb-12 print-break-inside-avoid">
          <h2 className="text-2xl font-bold mb-6">Category Scores</h2>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print-shadow-none">
            <CategoryScores categories={report.categoryScores} results={report.results} />
          </div>
        </div>

        {/* CRITICAL ISSUES */}
        {criticalIssues.length > 0 && (
          <div className="mb-12 print-break-before">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-red-700">
              <ShieldAlert className="w-6 h-6" />
              Critical Issues ({criticalIssues.length})
            </h2>
            <div className="space-y-4">
              {criticalIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} type="critical" />
              ))}
            </div>
          </div>
        )}

        {/* WARNINGS */}
        {warnings.length > 0 && (
          <div className="mb-12 print-break-before">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="w-6 h-6" />
              Warnings ({warnings.length})
            </h2>
            <div className="space-y-4">
              {warnings.map(issue => (
                <IssueCard key={issue.id} issue={issue} type="warning" />
              ))}
            </div>
          </div>
        )}

        {/* PASSED CHECKS */}
        {passedChecks.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-6 h-6" />
              Passed Checks ({passedChecks.length})
            </h2>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm print-shadow-none overflow-hidden">
              <div className="divide-y divide-gray-100">
                {passedChecks.map(check => (
                  <div key={check.id} className="p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{check.title}</h3>
                      <div className="text-sm text-gray-500">{check.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FEEDBACK WIDGET */}
        <div className="mb-12 print:hidden">
          <FeedbackWidget reportId={reportId} />
        </div>

        {/* FOOTER */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <div className="font-bold text-gray-900 mb-1">SiteLaunchCheck</div>
          <p>Catch issues before you launch.</p>
        </footer>
      </main>
    </div>
  );
}

function IssueCard({ issue, type }: { issue: any, type: 'critical' | 'warning' }) {
  const borderColor = type === 'critical' ? 'border-red-200' : 'border-yellow-200';
  const bgColor = type === 'critical' ? 'bg-red-50' : 'bg-yellow-50';
  const iconColor = type === 'critical' ? 'text-red-500' : 'text-yellow-500';
  const Icon = type === 'critical' ? ShieldAlert : AlertTriangle;

  return (
    <div className={`rounded-xl border ${borderColor} overflow-hidden bg-white shadow-sm print-break-inside-avoid print-shadow-none`}>
      <div className={`${bgColor} px-6 py-4 border-b ${borderColor} flex items-start justify-between`}>
        <div className="flex items-start gap-3">
          <Icon className={`w-6 h-6 ${iconColor} flex-shrink-0`} />
          <div>
            <h3 className="font-bold text-lg text-gray-900">{issue.title}</h3>
            <div className="text-sm text-gray-600 font-medium">{issue.category}</div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">What happened</h4>
            <p className="text-gray-800 text-sm">{issue.description}</p>
          </div>
          
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Why it matters</h4>
            <p className="text-gray-800 text-sm">
              {issue.details || 'This issue can negatively impact user experience, accessibility, or search engine visibility.'}
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">How to fix</h4>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p className="text-gray-800 text-sm font-medium">
                {issue.recommendation || 'Review the affected elements and update according to best practices.'}
              </p>
            </div>
          </div>
        </div>
        
        {issue.affectedUrls && issue.affectedUrls.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Affected Elements / URLs</h4>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              {issue.affectedUrls.map((url: string, idx: number) => (
                <li key={idx} className="break-all">{url}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
