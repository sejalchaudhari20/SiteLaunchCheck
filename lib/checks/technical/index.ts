import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';
import { checkHttps } from './https';
import { checkViewport } from './viewport';
import { checkCharset } from './charset';
import { checkLanguage } from './language';
import { checkFavicon } from './favicon';
import { check404Page } from './page404';

export async function runTechnicalChecks(pageData: PageData): Promise<CheckResult[]> {
  const syncChecks = [
    checkHttps(pageData),
    checkViewport(pageData),
    checkCharset(pageData),
    checkLanguage(pageData),
  ];

  const asyncChecks = await Promise.all([
    checkFavicon(pageData),
    check404Page(pageData),
  ]);

  return [...syncChecks, ...asyncChecks];
}
