import { CheckResult, CategoryScore } from '@/types/audit';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface CategoryScoresProps {
  categories: CategoryScore[];
  results: CheckResult[];
}

export default function CategoryScores({ categories, results }: CategoryScoresProps) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Category Scores</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((scoreObj) => {
          const cat = scoreObj.category;
          const score = scoreObj;
          const categoryResults = results.filter(r => r.category === cat);
          const hasCritical = categoryResults.some(r => r.severity === 'CRITICAL');
          const hasWarning = categoryResults.some(r => r.severity === 'WARNING');
          
          let icon = <CheckCircle2 className="w-5 h-5 text-green-500" />;
          let barColor = 'bg-green-500';
          
          if (hasCritical) {
            icon = <XCircle className="w-5 h-5 text-red-500" />;
            barColor = 'bg-red-500';
          } else if (hasWarning) {
            icon = <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            barColor = 'bg-yellow-500';
          }

          return (
            <div key={cat} className="flex flex-col">
              <div className="flex justify-between items-end mb-2">
                <span className="font-medium text-gray-700">{cat}</span>
                <span className="text-sm font-bold text-gray-900">{Math.round(score.score)}%</span>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
                <div 
                  className={`h-2 rounded-full ${barColor} transition-all duration-1000`} 
                  style={{ width: `${Math.max(score.score, 5)}%` }}
                ></div>
              </div>
              
              <div className="flex items-center space-x-3 text-xs text-gray-500 font-medium">
                {hasCritical && (
                  <span className="flex items-center text-red-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
                    Critical
                  </span>
                )}
                {hasWarning && (
                  <span className="flex items-center text-yellow-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5"></span>
                    Warning
                  </span>
                )}
                {!hasCritical && !hasWarning && (
                  <span className="flex items-center text-green-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                    Passed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
