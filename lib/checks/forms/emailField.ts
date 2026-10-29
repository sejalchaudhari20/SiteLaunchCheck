import * as cheerio from 'cheerio';
import { PageData } from '@/lib/crawler/types';
import { CheckResult } from '@/types/audit';

export function checkEmailField(pageData: PageData): CheckResult {
  const $ = cheerio.load(pageData.html);
  
  // Find inputs that look like email fields but lack type="email"
  let invalidEmailCount = 0;
  
  $('input[type="text"]').each((_, el) => {
    const name = $(el).attr('name')?.toLowerCase() || '';
    const id = $(el).attr('id')?.toLowerCase() || '';
    const placeholder = $(el).attr('placeholder')?.toLowerCase() || '';
    
    if (name.includes('email') || id.includes('email') || placeholder.includes('email')) {
      invalidEmailCount++;
    }
  });

  return {
    id: 'forms-email-field',
    category: 'Forms',
    title: 'Email Field Type',
    description: 'Checks if fields requesting email addresses use type="email".',
    status: invalidEmailCount > 0 ? 'WARNING' : 'PASS',
    severity: invalidEmailCount > 0 ? 'WARNING' : 'INFO',
    score: invalidEmailCount > 0 ? 50 : 100,
    maxScore: 100,
    details: invalidEmailCount > 0 
      ? `Found ${invalidEmailCount} text input(s) that appear to be for email but lack type="email".`
      : 'All email fields appear to use the correct input type.',
    recommendation: 'Use <input type="email"> for email fields to trigger the correct mobile keyboard and built-in validation.',
    affectedUrls: [pageData.url]
  };
}
