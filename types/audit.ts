export type Status = 'PASS' | 'WARNING' | 'FAIL' | 'INFO' | 'NA';
export type Severity = 'CRITICAL' | 'WARNING' | 'INFO';
export type Category = 
  | 'SEO Essentials'
  | 'Links'
  | 'Images'
  | 'Forms'
  | 'Technical'
  | 'Content / Client Delivery'
  | 'Accessibility Basics'
  | 'Mobile / UX';

export interface CheckResult {
  id: string;
  category: Category;
  title: string;
  description: string;
  status: Status;
  severity: Severity;
  score: number; // 0 to 100
  maxScore: number;
  details?: string;
  affectedUrls?: string[];
  recommendation?: string;
}

export interface CategoryScore {
  category: Category;
  score: number; // 0 to 100
  weight: number;
}

export type LaunchStatus = 'READY TO LAUNCH' | 'ALMOST READY' | 'NEEDS FIXES';

export interface AuditResult {
  url: string;
  timestamp: string;
  overallScore: number; // 0 to 100
  launchStatus: LaunchStatus;
  summary: {
    passed: number;
    warnings: number;
    critical: number;
  };
  categoryScores: CategoryScore[];
  results: CheckResult[];
}

export interface ReportData extends AuditResult {
  reportId: string;
}
