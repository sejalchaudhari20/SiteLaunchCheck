import { CheckResult } from '@/types/audit';
import IssueCard from './IssueCard';
import { FilterStatus } from './IssueFilters';
import { useState } from 'react';
import { ChevronDown, ChevronRight, XCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface IssueListProps {
  issues: CheckResult[];
  selectedStatus: FilterStatus;
  selectedCategory: string;
  searchQuery: string;
}

export default function IssueList({ issues, selectedStatus, selectedCategory, searchQuery }: IssueListProps) {
  const [passedExpanded, setPassedExpanded] = useState(false);

  // Apply filters and search
  const filteredIssues = issues.filter(issue => {
    if (selectedStatus === 'CRITICAL' && issue.severity !== 'CRITICAL') return false;
    if (selectedStatus === 'WARNING' && issue.severity !== 'WARNING') return false;
    if (selectedStatus === 'PASS' && issue.status !== 'PASS') return false;
    
    if (selectedCategory !== 'ALL' && issue.category !== selectedCategory) return false;
    
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = issue.title.toLowerCase().includes(q);
      const matchDesc = issue.description.toLowerCase().includes(q);
      const matchDetails = issue.details?.toLowerCase().includes(q) || false;
      const matchUrls = issue.affectedUrls?.some(url => url.toLowerCase().includes(q));
      
      if (!matchTitle && !matchDesc && !matchDetails && !matchUrls) return false;
    }

    return true;
  });

  const criticalIssues = filteredIssues.filter(i => i.severity === 'CRITICAL');
  const warningIssues = filteredIssues.filter(i => i.severity === 'WARNING');
  const passedIssues = filteredIssues.filter(i => i.status === 'PASS');

  if (filteredIssues.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-2">No matching checks</h3>
        <p className="text-gray-500">Adjust your search or filters to see more results.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      
      {/* Fix Before Launch (Critical) */}
      {(criticalIssues.length > 0 || selectedStatus === 'CRITICAL') && (
        <section>
          <div className="flex items-center space-x-3 mb-6 border-b border-gray-200 pb-2">
            <XCircle size={24} className="text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">Fix Before Launch</h2>
            <span className="bg-red-100 text-red-700 py-0.5 px-2 rounded-full text-xs font-bold">{criticalIssues.length}</span>
          </div>
          
          {criticalIssues.length === 0 ? (
            <div className="bg-green-50 text-green-800 p-6 rounded-xl border border-green-200 text-center">
              Great — there are no critical issues.
            </div>
          ) : (
            <div className="space-y-4">
              {criticalIssues.map(issue => <IssueCard key={issue.id} issue={issue} />)}
            </div>
          )}
        </section>
      )}

      {/* Recommended Improvements (Warnings) */}
      {(warningIssues.length > 0 || selectedStatus === 'WARNING') && (
        <section>
          <div className="flex items-center space-x-3 mb-6 border-b border-gray-200 pb-2">
            <AlertTriangle size={24} className="text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">Recommended Improvements</h2>
            <span className="bg-yellow-100 text-yellow-700 py-0.5 px-2 rounded-full text-xs font-bold">{warningIssues.length}</span>
          </div>
          
          {warningIssues.length === 0 ? (
            <div className="bg-gray-50 text-gray-500 p-6 rounded-xl border border-gray-200 text-center">
              No additional recommendations.
            </div>
          ) : (
            <div className="space-y-4">
              {warningIssues.map(issue => <IssueCard key={issue.id} issue={issue} />)}
            </div>
          )}
        </section>
      )}

      {/* Passed Checks */}
      {(passedIssues.length > 0 || selectedStatus === 'PASS') && (
        <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <button 
            onClick={() => setPassedExpanded(!passedExpanded)}
            className="w-full flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle2 size={24} className="text-green-500" />
              <h2 className="text-xl font-bold text-gray-900">Passed Checks</h2>
              <span className="bg-green-100 text-green-700 py-0.5 px-2 rounded-full text-xs font-bold">{passedIssues.length}</span>
            </div>
            {passedExpanded ? <ChevronDown size={20} className="text-gray-500" /> : <ChevronRight size={20} className="text-gray-500" />}
          </button>
          
          {passedExpanded && (
            <div className="p-6 bg-white border-t border-gray-100">
              {passedIssues.length === 0 ? (
                <div className="text-gray-500 text-center py-4">No passed checks match your criteria.</div>
              ) : (
                <div className="space-y-4 opacity-80">
                  {passedIssues.map(issue => <IssueCard key={issue.id} issue={issue} isCollapsedMode={true} />)}
                </div>
              )}
            </div>
          )}
        </section>
      )}

    </div>
  );
}
