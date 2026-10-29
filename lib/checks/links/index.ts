import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';
import { checkBrokenLinks } from './brokenLinks';
import { checkEmptyLinks } from './emptyLinks';
import { checkPlaceholderLinks } from './placeholderLinks';
import { checkHttpOnHttps } from './httpOnHttps';

export async function runLinkChecks(pageData: PageData): Promise<CheckResult[]> {
  const syncChecks = [
    checkEmptyLinks(pageData),
    checkPlaceholderLinks(pageData),
    checkHttpOnHttps(pageData),
  ];

  const asyncChecks = await checkBrokenLinks(pageData);

  return [...syncChecks, ...asyncChecks];
}
