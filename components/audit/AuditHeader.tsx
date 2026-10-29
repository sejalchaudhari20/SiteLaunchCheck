import Link from 'next/link';
import { RefreshCw, ExternalLink, Calendar, FileText, Download, Share2, Check } from 'lucide-react';
import { LaunchStatus } from '@/types/audit';
import { useState } from 'react';
import { 
  trackReportGenerated, 
  trackReportDownloaded, 
  trackReportShared, 
  trackAnotherAuditStarted 
} from '@/lib/analytics';

interface AuditHeaderProps {
  url: string;
  score: number;
  status: LaunchStatus;
  timestamp: string;
  criticalCount: number;
  warningCount: number;
  onRunAgain: () => void;
  isReloading: boolean;
  reportId?: string;
}

export default function AuditHeader({ url, score, status, timestamp, criticalCount, warningCount, onRunAgain, isReloading, reportId }: AuditHeaderProps) {
  const [copied, setCopied] = useState(false);
  let statusColor = 'bg-red-100 text-red-700 border-red-200';
  let scoreColor = 'text-red-500';
  let ringColor = 'stroke-red-500';
  
  if (status === 'READY TO LAUNCH') {
    statusColor = 'bg-green-100 text-green-700 border-green-200';
    scoreColor = 'text-green-500';
    ringColor = 'stroke-green-500';
  } else if (status === 'ALMOST READY') {
    statusColor = 'bg-yellow-100 text-yellow-700 border-yellow-200';
    scoreColor = 'text-yellow-500';
    ringColor = 'stroke-yellow-500';
  }

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let summaryText = "Your website passed all launch checks.";
  if (criticalCount > 0) {
    summaryText = "Your website has critical issues that should be fixed before delivery.";
  } else if (warningCount > 0) {
    summaryText = "Your website is close to launch, but a few issues should be reviewed.";
  }

  const formattedDate = new Date(timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const handleShare = () => {
    if (reportId) {
      const shareUrl = `${window.location.origin}/report/${reportId}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      trackReportShared('internal', 'copy_link');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPdf = () => {
    if (reportId) {
      trackReportDownloaded('client', 'pdf');
      const reportUrl = `${window.location.origin}/report/${reportId}/client`;
      window.open(reportUrl, '_blank');
      // In a more complex setup, we could trigger print on load in the new tab
      // For now, we instruct the user, or let them just use print there
    }
  };

  const handleRunAgain = () => {
    trackAnotherAuditStarted('results');
    onRunAgain();
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
      <div className="mb-6 md:mb-0 w-full md:w-auto">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2 font-medium">
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center space-x-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900 truncate max-w-xl" title={url}>
            {url.replace(/^https?:\/\//, '')}
          </h1>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
            <ExternalLink size={20} />
          </a>
        </div>
        <p className="text-gray-600 mb-6 max-w-xl text-lg">{summaryText}</p>
        
        <div className="flex flex-wrap gap-3 items-center">
          {reportId && (
            <Link 
              href={`/report/${reportId}`}
              onClick={() => trackReportGenerated('internal')}
              className="inline-flex items-center justify-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-sm"
            >
              <FileText size={18} />
              <span>View Full Report</span>
            </Link>
          )}

          {reportId && (
            <button 
              onClick={handleDownloadPdf}
              className="inline-flex items-center justify-center space-x-2 bg-white text-gray-700 border border-gray-200 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
              title="Download Client Report"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
          )}

          {reportId && (
            <button 
              onClick={handleShare}
              className="inline-flex items-center justify-center space-x-2 bg-white text-gray-700 border border-gray-200 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm min-w-[120px]"
            >
              {copied ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
              <span>{copied ? 'Copied!' : 'Share Report'}</span>
            </button>
          )}

          <button 
            onClick={handleRunAgain}
            disabled={isReloading}
            className="inline-flex items-center justify-center space-x-2 bg-gray-100 text-gray-600 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={18} className={isReloading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{isReloading ? 'Running...' : 'Re-run'}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-right">
          <p className="text-sm text-gray-500 font-medium mb-2 uppercase tracking-wider">Launch Status</p>
          <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${statusColor}`}>
            {status}
          </div>
        </div>
        
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="transform -rotate-90 w-28 h-28">
            <circle cx="56" cy="56" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={`transition-all duration-1000 ease-out ${ringColor}`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className={`text-3xl font-black ${scoreColor}`}>{Math.round(score)}</span>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">/ 100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
