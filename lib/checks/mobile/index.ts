import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';
import { checkMobileLayout } from './mobileLayout';
import { checkSmallText } from './smallText';
import { checkTouchTargets } from './touchTargets';

export async function runMobileChecks(pageData: PageData): Promise<CheckResult[]> {
  return [
    checkMobileLayout(pageData),
    checkSmallText(pageData),
    checkTouchTargets(pageData),
  ];
}
