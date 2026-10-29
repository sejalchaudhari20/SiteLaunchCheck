import { describe, it, expect } from 'vitest';
import { checkEmptyLinks } from '../lib/checks/links/emptyLinks';
import { checkPlaceholderLinks } from '../lib/checks/links/placeholderLinks';
import { PageData } from '../lib/crawler/types';

describe('Link Checks', () => {
  it('should detect empty links', () => {
    const mockData: PageData = {
      url: 'https://example.com',
      html: '<html><body><a href="https://example.com"></a><a>Text</a><a href="https://example.com" aria-label="Label"></a></body></html>',
      status: 200,
      headers: {},
      mobileLayoutResults: [],
      title: '',
    };
    
    const result = checkEmptyLinks(mockData);
    // <a href="https://example.com"></a> is empty (no text/label)
    // <a>Text</a> is empty (no href)
    // <a href="..." aria-label="..."></a> is NOT empty
    expect(result.status).toBe('WARNING');
    expect(result.details).toContain('2 empty link');
  });

  it('should detect placeholder links', () => {
    const mockData: PageData = {
      url: 'https://example.com',
      html: '<html><body><a href="#">Link 1</a><a href="javascript:void(0)">Link 2</a><a href="">Link 3</a><a href="/about">Valid</a></body></html>',
      status: 200,
      headers: {},
      mobileLayoutResults: [],
      title: '',
    };
    
    const result = checkPlaceholderLinks(mockData);
    expect(result.status).toBe('FAIL');
    expect(result.details).toContain('3 placeholder link');
  });
});
