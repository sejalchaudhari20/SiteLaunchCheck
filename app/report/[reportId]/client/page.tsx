'use client';

import { useEffect, useState, use } from 'react';
import { ReportData } from '@/types/audit';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, ExternalLink, Calendar, Printer, ShieldAlert, AlertTriangle } from 'lucide-react';
import { FeedbackWidget } from '@/components/FeedbackWidget';

export default function ClientReportPage(props: { params: Promise<{ reportId: string }> }) {
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
    import('@/lib/analytics').then(m => m.trackReportDownloaded('client', 'pdf'));
    window.print();
  };

  const formattedDate = new Date(report.timestamp).toLocaleString(undefined, {
    dateStyle: 'long'
  });

  const issuesToReview = report.results.filter(r => r.status === 'FAIL' || r.status === 'WARNING');
  const criticalCount = report.summary.critical;
  const warningCount = report.summary.warnings;

  let statusColor = 'bg-red-100 text-red-700';
  let dynamicMessage = "Your website has issues that should be fixed before delivery.";
  
  if (report.launchStatus === 'READY TO LAUNCH') {
    statusColor = 'bg-green-100 text-green-700';
    dynamicMessage = "Excellent work. Your website passed all pre-launch checks and is ready for delivery.";
  } else if (report.launchStatus === 'ALMOST READY') {
    statusColor = 'bg-yellow-100 text-yellow-700';
    dynamicMessage = "Your website is close to launch, but a few recommendations should be reviewed before delivery.";
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation - Hidden in print */}
      <header className="border-b border-gray-100 bg-gray-50 sticky top-0 z-50 print:hidden">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="font-heading font-bold text-lg tracking-tight hidden sm:inline-block text-gray-900">
                SiteLaunchCheck
              </span>
            </Link>
            <Link href={`/report/${reportId}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium text-sm ml-4">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Detailed Report</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handlePrint} className="inline-flex items-center gap-2 bg-primary text-white px-4 py-1.5 rounded-md font-medium text-sm hover:bg-primary-dark mr-4">
              <Printer className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-16 print-p-0 print:py-10">
        
        {/* REPORT HEADER */}
        <div className="flex justify-between items-start mb-16 border-b border-gray-100 pb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-heading">Website Launch Report</h1>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-sm font-bold uppercase tracking-wider text-gray-400 w-24">Website:</span>
                <span className="font-medium">{report.url.replace(/^https?:\/\//, '')}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-sm font-bold uppercase tracking-wider text-gray-400 w-24">Audit Date:</span>
                <span className="font-medium">{formattedDate}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right flex flex-col items-end">
            <div className="text-6xl font-black text-gray-900 mb-2">
              {Math.round(report.overallScore)}<span className="text-2xl text-gray-300">/100</span>
            </div>
            <div className={`inline-flex items-center px-5 py-2 rounded-full text-sm font-bold ${statusColor}`}>
              {report.launchStatus}
            </div>
          </div>
        </div>

        {/* OVERALL RESULT */}
        <div className="mb-16 print-break-inside-avoid">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Overall Result</h2>
          <p className="text-2xl text-gray-800 leading-relaxed max-w-3xl">
            {dynamicMessage}
          </p>
        </div>

        {/* SUMMARY */}
        <div className="mb-16 bg-gray-50 rounded-2xl p-8 border border-gray-100 print-break-inside-avoid">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{report.summary.passed}</div>
              <div className="text-gray-600 font-medium">Checks Passed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{warningCount}</div>
              <div className="text-gray-600 font-medium">Recommendations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{criticalCount}</div>
              <div className="text-gray-600 font-medium">Issues Need Attention</div>
            </div>
          </div>
        </div>

        {/* CATEGORY OVERVIEW */}
        <div className="mb-16 print-break-inside-avoid">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Category Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.categoryScores.map((cat, idx) => {
              const isGood = cat.score >= 90;
              const isOk = cat.score >= 70 && cat.score < 90;
              
              let indicatorClass = "bg-red-500";
              if (isGood) indicatorClass = "bg-green-500";
              else if (isOk) indicatorClass = "bg-yellow-500";

              return (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                  <span className="font-medium text-gray-800">{cat.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-500">{Math.round(cat.score)}%</span>
                    <div className={`w-3 h-3 rounded-full ${indicatorClass}`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ISSUES TO REVIEW */}
        {issuesToReview.length > 0 && (
          <div className="mb-16 print-break-before">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Issues to Review</h2>
            <div className="space-y-6">
              {issuesToReview.map(issue => (
                <div key={issue.id} className="border border-gray-200 rounded-xl p-6 print-break-inside-avoid">
                  <div className="flex items-start gap-3 mb-4">
                    {issue.severity === 'CRITICAL' ? (
                      <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{issue.title}</h3>
                      <div className="text-sm text-gray-500">{issue.category}</div>
                    </div>
                  </div>
                  
                  <div className="ml-8 space-y-4">
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase mb-1">Why it matters</div>
                      <p className="text-sm text-gray-700">{issue.details || issue.description}</p>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase mb-1">Recommended Action</div>
                      <div className="bg-blue-50 text-blue-900 text-sm p-3 rounded-lg border border-blue-100">
                        {issue.recommendation || 'Review and apply best practices to resolve this issue.'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEXT STEPS */}
        <div className="mb-16 p-8 bg-gray-50 rounded-2xl border border-gray-100 print-break-inside-avoid text-center">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Next Step</h2>
          <p className="text-lg text-gray-800 mb-6 max-w-xl mx-auto">
            Review the issues above, make the recommended fixes, and run another SiteLaunchCheck audit before delivery.
          </p>
          <Link 
            href="/" 
            onClick={() => import('@/lib/analytics').then(m => m.trackAnotherAuditStarted('client_report'))}
            className="inline-block bg-primary text-white font-medium px-8 py-3 rounded-lg print:hidden"
          >
            Run Another Audit
          </Link>
        </div>

        {/* FEEDBACK WIDGET */}
        <div className="mb-16 print:hidden">
          <FeedbackWidget reportId={reportId} />
        </div>

        {/* FOOTER */}
        <footer className="pt-8 border-t border-gray-200 text-center text-gray-400 text-sm">
          <p>Generated with SiteLaunchCheck</p>
          <p>Catch issues before you launch.</p>
        </footer>
      </main>
    </div>
  );
}
