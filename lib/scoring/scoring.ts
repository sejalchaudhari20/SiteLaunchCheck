import { Category, CheckResult, AuditResult, CategoryScore } from '@/types/audit';

const CATEGORY_WEIGHTS: Record<Category, number> = {
  'Technical': 15,
  'Links': 15,
  'Forms': 15,
  'Mobile / UX': 15,
  'SEO Essentials': 12,
  'Images': 10,
  'Accessibility Basics': 10,
  'Content / Client Delivery': 8,
};

export function calculateAuditScore(results: CheckResult[]): Pick<AuditResult, 'overallScore' | 'launchStatus' | 'summary' | 'categoryScores'> {
  let passed = 0;
  let warnings = 0;
  let critical = 0;
  
  const categoryTotals: Record<Category, { earned: number; possible: number }> = {
    'Technical': { earned: 0, possible: 0 },
    'Links': { earned: 0, possible: 0 },
    'Forms': { earned: 0, possible: 0 },
    'Mobile / UX': { earned: 0, possible: 0 },
    'SEO Essentials': { earned: 0, possible: 0 },
    'Images': { earned: 0, possible: 0 },
    'Accessibility Basics': { earned: 0, possible: 0 },
    'Content / Client Delivery': { earned: 0, possible: 0 },
  };

  // Process individual check results
  for (const result of results) {
    if (result.status === 'NA') continue;

    if (result.status === 'PASS') passed++;
    else if (result.status === 'WARNING') warnings++;
    else if (result.status === 'FAIL') {
      if (result.severity === 'CRITICAL') {
        critical++;
      }
    }

    categoryTotals[result.category].earned += result.score;
    categoryTotals[result.category].possible += result.maxScore;
  }

  // Calculate category scores (0-100)
  const categoryScores: CategoryScore[] = Object.entries(categoryTotals).map(([cat, totals]) => {
    const category = cat as Category;
    const score = totals.possible > 0 ? (totals.earned / totals.possible) * 100 : 100;
    return {
      category,
      score: Math.round(score),
      weight: CATEGORY_WEIGHTS[category],
    };
  });

  // Calculate weighted overall score
  let totalWeightedScore = 0;
  let totalWeightPossible = 0;

  for (const catScore of categoryScores) {
    const weight = catScore.weight;
    totalWeightedScore += (catScore.score * weight) / 100;
    totalWeightPossible += weight;
  }

  const overallScore = totalWeightPossible > 0 ? Math.round((totalWeightedScore / totalWeightPossible) * 100) : 0;

  // Determine Launch Status
  let launchStatus: AuditResult['launchStatus'] = 'NEEDS FIXES';
  
  if (overallScore >= 90 && critical === 0) {
    launchStatus = 'READY TO LAUNCH';
  } else if (overallScore >= 75 && critical === 0) {
    launchStatus = 'ALMOST READY';
  } else {
    // Covers (60-89 with critical issues) and (0-59)
    launchStatus = 'NEEDS FIXES';
  }

  return {
    overallScore,
    launchStatus,
    summary: {
      passed,
      warnings,
      critical,
    },
    categoryScores,
  };
}
