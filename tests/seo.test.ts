import { describe, it, expect } from 'vitest';
import { checkPageTitle } from '../lib/checks/seo/pageTitle';
import { checkH1Heading } from '../lib/checks/seo/h1Heading';
import { PageData } from '../lib/crawler/types';

describe('SEO Checks', () => {
  it('should pass page title check with optimal length', () => {
    const mockData: PageData = {
      url: 'https://example.com',
      html: '<html><head><title>This is a perfectly sized title</title></head><body></body></html>',
      status: 200,
      headers: {},
      mobileLayoutResults: [],
      title: 'This is a perfectly sized title',
    };
    
    const result = checkPageTitle(mockData);
    expect(result.status).toBe('PASS');
    expect(result.score).toBe(100);
  });

  it('should fail page title check when missing', () => {
    const mockData: PageData = {
      url: 'https://example.com',
      html: '<html><head></head><body></body></html>',
      status: 200,
      headers: {},
      mobileLayoutResults: [],
      title: '',
    };
    
    const result = checkPageTitle(mockData);
    expect(result.status).toBe('FAIL');
    expect(result.score).toBe(0);
  });

  it('should pass H1 heading check with one H1', () => {
    const mockData: PageData = {
      url: 'https://example.com',
      html: '<html><body><h1>Main Title</h1></body></html>',
      status: 200,
      headers: {},
      mobileLayoutResults: [],
      title: '',
    };
    
    const result = checkH1Heading(mockData);
    expect(result.status).toBe('PASS');
    expect(result.score).toBe(100);
  });
});
