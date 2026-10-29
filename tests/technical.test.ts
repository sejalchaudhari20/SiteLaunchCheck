import { describe, it, expect } from 'vitest';
import { checkHttps } from '../lib/checks/technical/https';
import { checkViewport } from '../lib/checks/technical/viewport';
import { PageData } from '../lib/crawler/types';

describe('Technical Checks', () => {
  it('should pass HTTPS check for https URLs', () => {
    const mockData: PageData = {
      url: 'https://example.com',
      html: '',
      status: 200,
      headers: {},
      mobileLayoutResults: [],
      title: '',
    };
    
    const result = checkHttps(mockData);
    expect(result.status).toBe('PASS');
    expect(result.score).toBe(100);
  });

  it('should fail HTTPS check for http URLs', () => {
    const mockData: PageData = {
      url: 'http://example.com',
      html: '',
      status: 200,
      headers: {},
      mobileLayoutResults: [],
      title: '',
    };
    
    const result = checkHttps(mockData);
    expect(result.status).toBe('FAIL');
    expect(result.score).toBe(0);
  });

  it('should pass viewport check when present', () => {
    const mockData: PageData = {
      url: 'https://example.com',
      html: '<html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body></body></html>',
      status: 200,
      headers: {},
      mobileLayoutResults: [],
      title: '',
    };
    
    const result = checkViewport(mockData);
    expect(result.status).toBe('PASS');
  });
});
