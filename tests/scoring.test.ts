import { describe, it, expect } from 'vitest';
import { calculateAuditScore } from '../lib/scoring/scoring';
import { CheckResult } from '../types/audit';

describe('Scoring Engine', () => {
  it('should calculate 100% score for all perfect results', () => {
    const results: CheckResult[] = [
      { id: '1', category: 'Technical', title: '', description: '', status: 'PASS', severity: 'INFO', score: 100, maxScore: 100 },
      { id: '2', category: 'Links', title: '', description: '', status: 'PASS', severity: 'INFO', score: 100, maxScore: 100 },
    ];
    
    const { overallScore, launchStatus, summary } = calculateAuditScore(results);
    
    expect(overallScore).toBe(100);
    expect(launchStatus).toBe('READY TO LAUNCH');
    expect(summary.passed).toBe(2);
    expect(summary.critical).toBe(0);
  });

  it('should override to NEEDS FIXES if critical issues exist despite high score', () => {
    const results: CheckResult[] = [
      { id: '1', category: 'Technical', title: '', description: '', status: 'FAIL', severity: 'CRITICAL', score: 0, maxScore: 100 },
    ];
    // Add many passing tests to artificially inflate the weighted score
    for (let i = 0; i < 20; i++) {
      results.push({ id: `pass-${i}`, category: 'SEO Essentials', title: '', description: '', status: 'PASS', severity: 'INFO', score: 100, maxScore: 100 });
    }
    
    const { overallScore, launchStatus, summary } = calculateAuditScore(results);
    
    expect(overallScore).toBeGreaterThan(70); // Score will be high
    expect(summary.critical).toBe(1);
    expect(launchStatus).toBe('NEEDS FIXES'); // But status MUST be needs fixes due to critical
  });

  it('should correctly classify ALMOST READY', () => {
    const results: CheckResult[] = [
      { id: '1', category: 'Technical', title: '', description: '', status: 'WARNING', severity: 'WARNING', score: 50, maxScore: 100 },
      { id: '2', category: 'Links', title: '', description: '', status: 'WARNING', severity: 'WARNING', score: 50, maxScore: 100 },
      { id: '3', category: 'Forms', title: '', description: '', status: 'PASS', severity: 'INFO', score: 100, maxScore: 100 },
      { id: '4', category: 'SEO Essentials', title: '', description: '', status: 'PASS', severity: 'INFO', score: 100, maxScore: 100 },
      { id: '5', category: 'Images', title: '', description: '', status: 'PASS', severity: 'INFO', score: 100, maxScore: 100 },
    ];
    
    const { overallScore, launchStatus, summary } = calculateAuditScore(results);
    
    // Score should be somewhere in the 75-89 range depending on weights, with 0 critical
    expect(overallScore).toBeGreaterThanOrEqual(75);
    expect(overallScore).toBeLessThan(90);
    expect(summary.critical).toBe(0);
    expect(launchStatus).toBe('ALMOST READY');
  });
});
