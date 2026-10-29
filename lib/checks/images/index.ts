import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';
import { checkBrokenImages } from './brokenImages';
import { checkMissingAlt } from './missingAlt';
import { checkDimensions } from './dimensions';
import { checkModernFormat } from './modernFormat';
import { checkLargeImages } from './largeImages';

export async function runImageChecks(pageData: PageData): Promise<CheckResult[]> {
  const syncChecks = [
    checkMissingAlt(pageData),
    checkDimensions(pageData),
    checkModernFormat(pageData),
  ];

  const asyncChecks = await Promise.all([
    checkBrokenImages(pageData),
    checkLargeImages(pageData),
  ]);

  return [...syncChecks, ...asyncChecks];
}
