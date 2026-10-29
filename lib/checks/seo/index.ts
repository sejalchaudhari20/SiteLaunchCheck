import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';
import { checkPageTitle } from './pageTitle';
import { checkMetaDescription } from './metaDescription';
import { checkH1Heading } from './h1Heading';
import { checkCanonical } from './canonical';
import { checkRobotsTxt } from './robots';
import { checkSitemap } from './sitemap';
import { checkOpenGraph } from './openGraph';

export async function runSeoChecks(pageData: PageData): Promise<CheckResult[]> {
  const syncChecks = [
    checkPageTitle(pageData),
    checkMetaDescription(pageData),
    checkH1Heading(pageData),
    checkCanonical(pageData),
    checkOpenGraph(pageData),
  ];

  const asyncChecks = await Promise.all([
    checkRobotsTxt(pageData),
    checkSitemap(pageData),
  ]);

  return [...syncChecks, ...asyncChecks];
}
