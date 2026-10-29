import { CheckResult } from '@/types/audit';
import { XCircle, AlertTriangle, CheckCircle2, Info, ExternalLink } from 'lucide-react';

interface IssueCardProps {
  issue: CheckResult;
  isCollapsedMode?: boolean;
}

export default function IssueCard({ issue, isCollapsedMode = false }: IssueCardProps) {
  let bgColor = 'bg-gray-50';
  let borderColor = 'border-gray-200';
  let iconColor = 'text-gray-500';
  let Icon = Info;
  let badgeColor = 'bg-gray-200 text-gray-800';

  if (issue.severity === 'CRITICAL') {
    bgColor = 'bg-red-50';
    borderColor = 'border-red-200';
    iconColor = 'text-red-500';
    Icon = XCircle;
    badgeColor = 'bg-red-100 text-red-700';
  } else if (issue.severity === 'WARNING') {
    bgColor = 'bg-yellow-50';
    borderColor = 'border-yellow-200';
    iconColor = 'text-yellow-500';
    Icon = AlertTriangle;
    badgeColor = 'bg-yellow-100 text-yellow-700';
  } else if (issue.status === 'PASS') {
    bgColor = 'bg-white';
    borderColor = 'border-gray-200';
    iconColor = 'text-green-500';
    Icon = CheckCircle2;
    badgeColor = 'bg-green-100 text-green-700';
  }

  // Simplified view for Passed checks to keep UI light
  if (isCollapsedMode && issue.status === 'PASS') {
    return (
      <div className={`p-4 rounded-xl border ${borderColor} ${bgColor} flex items-center justify-between`}>
        <div className="flex items-center space-x-3">
          <Icon size={18} className={iconColor} />
          <h3 className="font-bold text-gray-900 text-sm">{issue.title}</h3>
        </div>
        <span className="text-xs text-gray-500 font-medium">{issue.category}</span>
      </div>
    );
  }

  return (
    <div className={`p-5 md:p-6 rounded-xl border ${borderColor} ${bgColor} transition-shadow hover:shadow-sm`}>
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        
        {/* Left Side: Identity */}
        <div className="md:w-1/3 shrink-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${badgeColor}`}>
              {issue.severity === 'INFO' && issue.status === 'PASS' ? 'PASS' : issue.severity}
            </span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{issue.category}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight flex items-start gap-2">
            <Icon size={20} className={`${iconColor} mt-0.5 shrink-0`} />
            <span>{issue.title}</span>
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">{issue.description}</p>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="md:w-2/3 bg-white p-4 md:p-5 rounded-lg border border-gray-100 shadow-sm flex flex-col gap-4">
          
          {issue.details && (
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">What happened</h4>
              <p className="text-sm text-gray-700">{issue.details}</p>
            </div>
          )}

          {issue.recommendation && issue.status !== 'PASS' && (
            <div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">How to fix it</h4>
              <p className="text-sm text-gray-700">{issue.recommendation}</p>
            </div>
          )}

          {issue.affectedUrls && issue.affectedUrls.length > 0 && issue.status !== 'PASS' && (
            <div className="mt-2 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Affected URL(s)</h4>
              <div className="space-y-2">
                {issue.affectedUrls.slice(0, 3).map((url, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    <span className="text-sm text-gray-600 truncate mr-3 font-mono text-xs" title={url}>{url}</span>
                    {url.startsWith('http') && (
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary shrink-0 flex items-center gap-1 text-xs font-medium">
                        View <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))}
                {issue.affectedUrls.length > 3 && (
                  <div className="text-xs text-gray-500 italic mt-1">
                    + {issue.affectedUrls.length - 3} more URLs affected
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
