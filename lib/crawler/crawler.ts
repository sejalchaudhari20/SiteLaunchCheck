import { chromium, Browser, Page } from 'playwright';
import { PageData } from './types';

// Helper for SSRF protection
export function isSafeUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    
    const hostname = url.hostname;
    // Basic protections against localhost and private ranges
    if (
      hostname === 'localhost' ||
      hostname.startsWith('127.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.local')
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function crawlPage(targetUrl: string): Promise<PageData> {
  if (!isSafeUrl(targetUrl)) {
    throw new Error('URL is not safe to crawl.');
  }

  let browser: Browser | null = null;
  
  try {
    browser = await chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const context = await browser.newContext({
      userAgent: 'SiteLaunchCheck-Crawler/1.0',
      ignoreHTTPSErrors: true, // We want to check HTTPS errors manually, so we ignore them here to let the page load
    });
    
    const page = await context.newPage();
    
    // Setup request interception for SSRF protection
    await page.route('**/*', route => {
      const reqUrl = route.request().url();
      if (!isSafeUrl(reqUrl)) {
        route.abort();
      } else {
        route.continue();
      }
    });

    const response = await page.goto(targetUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    if (!response) {
      throw new Error('No response received from target URL.');
    }

    const html = await page.content();
    const title = await page.title();
    const status = response.status();
    const headers = response.headers();

    // Perform mobile layout tests
    const viewports = [375, 390, 768];
    const mobileLayoutResults = [];

    for (const width of viewports) {
      await page.setViewportSize({ width, height: 800 });
      await page.waitForTimeout(100); // Give layout a tiny bit of time to recalculate

      const layoutData = await page.evaluate(() => {
        const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;
        
        let smallTextNodes = 0;
        let smallTouchTargets = 0;

        const elements = document.body.querySelectorAll('*');
        for (const el of elements) {
          const style = window.getComputedStyle(el);
          
          // Check text size for elements that contain direct text nodes
          const hasDirectText = Array.from(el.childNodes).some(n => n.nodeType === Node.TEXT_NODE && (n.textContent?.trim().length ?? 0) > 0);
          if (hasDirectText) {
            const fontSize = parseFloat(style.fontSize);
            if (fontSize > 0 && fontSize < 12) {
              smallTextNodes++;
            }
          }

          // Check touch targets for interactive elements
          if (el.tagName === 'A' || el.tagName === 'BUTTON' || (el.tagName === 'INPUT' && style.cursor === 'pointer')) {
            const rect = el.getBoundingClientRect();
            // We consider it a small target if both width and height > 0 but < 44px
            // Sometimes inline links are naturally small in height, but width should be checked.
            // A more strict UX guideline requires at least 44x44px. We will check if area is too small.
            if (rect.width > 0 && rect.height > 0) {
              if (rect.width < 44 && rect.height < 44) {
                smallTouchTargets++;
              }
            }
          }
        }

        return { hasHorizontalOverflow, smallTextNodes, smallTouchTargets };
      });

      mobileLayoutResults.push({ width, ...layoutData });
    }

    return {
      url: targetUrl,
      html,
      status,
      headers,
      title,
      mobileLayoutResults,
    };
  } catch (error: any) {
    throw new Error(`Crawling failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
