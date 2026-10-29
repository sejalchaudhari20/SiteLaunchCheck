import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';
import { checkFormExists } from './formExists';
import { checkFormAction } from './formAction';
import { checkSubmitButton } from './submitButton';
import { checkEmailField } from './emailField';
import { checkFormLabels } from './formLabels';

export async function runFormChecks(pageData: PageData): Promise<CheckResult[]> {
  return [
    checkFormExists(pageData),
    checkFormAction(pageData),
    checkSubmitButton(pageData),
    checkEmailField(pageData),
    checkFormLabels(pageData),
  ];
}
