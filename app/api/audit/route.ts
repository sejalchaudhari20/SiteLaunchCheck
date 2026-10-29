import { NextResponse } from 'next/server';
import { crawlPage, isSafeUrl } from '@/lib/crawler/crawler';
import { runSeoChecks } from '@/lib/checks/seo';
import { runTechnicalChecks } from '@/lib/checks/technical';
import { runLinkChecks } from '@/lib/checks/links';
import { runImageChecks } from '@/lib/checks/images';
import { runFormChecks } from '@/lib/checks/forms';
import { runContentChecks } from '@/lib/checks/content';
import { runAccessibilityChecks } from '@/lib/checks/accessibility';
import { runMobileChecks } from '@/lib/checks/mobile';
import { calculateAuditScore } from '@/lib/scoring/scoring';
import { reportRepository } from '@/lib/reports/repository';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const parsedUrl = new URL(url);
    if (!isSafeUrl(url)) {
      return NextResponse.json({ error: 'Invalid or unsafe URL provided.' }, { status: 400 });
    }

    // 1. Crawl the page
    const pageData = await crawlPage(url);

    // 2. Run checks concurrently
    const [
      seoResults, 
      techResults, 
      linkResults, 
      imageResults,
      formResults,
      contentResults,
      a11yResults,
      mobileResults
    ] = await Promise.all([
      runSeoChecks(pageData),
      runTechnicalChecks(pageData),
      runLinkChecks(pageData),
      runImageChecks(pageData),
      runFormChecks(pageData),
      runContentChecks(pageData),
      runAccessibilityChecks(pageData),
      runMobileChecks(pageData),
    ]);

    const allResults = [
      ...seoResults, 
      ...techResults, 
      ...linkResults,
      ...imageResults,
      ...formResults,
      ...contentResults,
      ...a11yResults,
      ...mobileResults
    ];

    // 3. Calculate score
    const scoreData = calculateAuditScore(allResults);

    // 4. Save to repository to generate reportId
    const reportData = await reportRepository.createReport({
      url: pageData.url,
      timestamp: new Date().toISOString(),
      ...scoreData,
      results: allResults,
    });

    // 5. Return structured ReportData
    return NextResponse.json(reportData);

  } catch (error: any) {
    console.error('Audit Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to analyze website.' }, { status: 500 });
  }
}
