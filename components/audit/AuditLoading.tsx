import { useState, useEffect } from 'react';

const LOADING_STAGES = [
  "Initializing audit...",
  "Fetching website structure...",
  "Checking SEO and Meta tags...",
  "Testing internal and external links...",
  "Analyzing image dimensions and accessibility...",
  "Evaluating forms and inputs...",
  "Testing mobile layout and UX...",
  "Calculating final launch score..."
];

export default function AuditLoading() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    // Cycle through stages to keep user engaged while Playwright runs
    const interval = setInterval(() => {
      setStageIndex(prev => {
        if (prev < LOADING_STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50 flex flex-col pt-12 pb-24 h-full min-h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4 max-w-6xl animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-96 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="h-12 bg-gray-200 rounded w-40"></div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right hidden md:block">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2 ml-auto"></div>
              <div className="h-8 bg-gray-200 rounded w-32 ml-auto"></div>
            </div>
            <div className="w-28 h-28 rounded-full bg-gray-200"></div>
          </div>
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-28 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Real Loading Indicator */}
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center pointer-events-none">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center max-w-sm w-full mx-4">
          <div className="inline-block w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Running Checks</h2>
          <p className="text-sm font-medium text-primary text-center h-5 transition-all">
            {LOADING_STAGES[stageIndex]}
          </p>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-6 overflow-hidden">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(((stageIndex + 1) / LOADING_STAGES.length) * 100, 95)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
