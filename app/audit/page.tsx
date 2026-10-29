'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuditHeader from '@/components/audit/AuditHeader';
import AuditSummary from '@/components/audit/AuditSummary';
import CategoryScores from '@/components/audit/CategoryScores';
import IssueFilters, { FilterStatus } from '@/components/audit/IssueFilters';
import IssueList from '@/components/audit/IssueList';
import AuditLoading from '@/components/audit/AuditLoading';
import AuditError from '@/components/audit/AuditError';
import { trackAuditCompleted, trackAuditFailed } from '@/lib/analytics';

function AuditDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlParam = searchParams.get('url');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isReloading, setIsReloading] = useState(false);

  const hasFetched = useRef<string | null>(null);

  const fetchAudit = async (targetUrl: string) => {
    try {
      const res = await fetch(`/api/audit?url=${encodeURIComponent(targetUrl)}`);
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.error || 'Failed to analyze website.');
      }
      
      setData(json);
      setError(null);
      trackAuditCompleted(json);
    } catch (err: any) {
      setError(err.message);
      
      // Basic error classification for analytics
      const errorMsg = err.message.toLowerCase();
      let errorType = 'unknown';
      if (errorMsg.includes('invalid') || errorMsg.includes('url')) errorType = 'invalid_url';
      else if (errorMsg.includes('timeout')) errorType = 'timeout';
      else if (errorMsg.includes('network') || errorMsg.includes('fetch')) errorType = 'network_error';
      else if (errorMsg.includes('blocked')) errorType = 'blocked';
      
      trackAuditFailed(errorType, 'results');
    } finally {
      setLoading(false);
      setIsReloading(false);
    }
  };

  useEffect(() => {
    if (!urlParam) {
      router.push('/');
      return;
    }
    
    // Prevent duplicate fetch in React Strict Mode (Dev)
    if (hasFetched.current === urlParam) return;
    hasFetched.current = urlParam;
    
    setLoading(true);
    fetchAudit(urlParam);
  }, [urlParam, router]);

  const handleRunAgain = () => {
    if (urlParam) {
      setIsReloading(true);
      fetchAudit(urlParam);
    }
  };

  if (loading) return <AuditLoading />;
  if (error) return <AuditError message={error} />;
  if (!data) return null;

  // Extract unique categories from results dynamically
  const categories = Array.from(new Set(data.results.map((r: any) => r.category))) as string[];
  
  return (
    <div className="bg-gray-50 pb-24 pt-8 h-full min-h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4 max-w-5xl">
        <AuditHeader 
          url={data.url} 
          score={data.overallScore} 
          status={data.launchStatus} 
          timestamp={data.timestamp}
          criticalCount={data.summary.critical}
          warningCount={data.summary.warnings}
          onRunAgain={handleRunAgain}
          isReloading={isReloading}
          reportId={data.reportId}
        />
        
        <AuditSummary 
          passed={data.summary.passed} 
          warnings={data.summary.warnings} 
          critical={data.summary.critical}
          total={data.results.length}
        />
        
        <CategoryScores categories={data.categoryScores} results={data.results} />
        
        <div className="mt-12">
          <IssueFilters 
            categories={categories}
            selectedStatus={selectedStatus}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onStatusChange={setSelectedStatus}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchQuery}
          />
          
          <IssueList 
            issues={data.results} 
            selectedStatus={selectedStatus} 
            selectedCategory={selectedCategory} 
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Simple Top Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="font-heading font-bold text-lg tracking-tight hidden sm:inline-block text-gray-900">
              SiteLaunchCheck
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Suspense fallback={<AuditLoading />}>
          <AuditDashboardContent />
        </Suspense>
      </main>
    </div>
  );
}
