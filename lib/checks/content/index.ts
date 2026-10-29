import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';
import { checkLoremIpsum } from './loremIpsum';
import { checkPlaceholderText } from './placeholderText';
import { checkPlaceholderImages } from './placeholderImages';
import { checkCopyrightYear } from './copyrightYear';

export async function runContentChecks(pageData: PageData): Promise<CheckResult[]> {
  return [
    checkLoremIpsum(pageData),
    checkPlaceholderText(pageData),
    checkPlaceholderImages(pageData),
    checkCopyrightYear(pageData),
  ];
}
