import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';
import { checkImageAccessibility } from './imageAccessibility';
import { checkFormAccessibility } from './formAccessibility';
import { checkHeadingHierarchy } from './headingHierarchy';
import { checkButtonLinkNames } from './buttonLinkNames';

export async function runAccessibilityChecks(pageData: PageData): Promise<CheckResult[]> {
  return [
    checkImageAccessibility(pageData),
    checkFormAccessibility(pageData),
    checkHeadingHierarchy(pageData),
    checkButtonLinkNames(pageData),
  ];
}
