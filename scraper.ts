/* ===== SCRAPER ENGINE — SalesRadar AI ===== */
/* Fallback for competitor data when APIs don't provide it */
/* Uses Playwright for browser automation */

import { chromium, Browser, Page } from 'playwright';
import { Comment } from '@/types';

// Proxy pool for rotation (placeholder - in production, use Bright Data or similar)
const PROXIES = [
  null, // No proxy for testing
  // Add proxy URLs here
];

// User agents for rotation
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
];

let browser: Browser | null = null;

/**
 * Initialize browser instance with rotation
 */
async function getBrowser(): Promise<Browser> {
  if (browser) return browser;

  const proxy = PROXIES[Math.floor(Math.random() * PROXIES.length)];
  const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

  browser = await chromium.launch({
    headless: true,
    proxy: proxy ? { server: proxy } : undefined,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
    ],
  });

  return browser;
}

/**
 * Scrape comments from Instagram post
 * Note: Instagram requires login for most content, this is for public posts
 */
export async function scrapeInstagramComments(postUrl: string): Promise<Comment[]> {
  const browser = await getBrowser();
  const context = await browser.newContext({
    userAgent: USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
  });
  const page = await context.newPage();

  try {
    await page.goto(postUrl, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for comments to load
    await page.waitForTimeout(2000);

    // Extract comments
    const comments = await page.evaluate(() => {
      const commentElements = document.querySelectorAll('[role="button"] div[dir="auto"]');
      const results: any[] = [];

      commentElements.forEach((el, index) => {
        if (index > 50) return; // Limit to 50 comments

        const text = el.textContent?.trim();
        if (text && text.length > 5) {
          results.push({
            id: `ig_scraped_${index}`,
            text,
            authorHandle: `@scraped_user_${index}`,
            category: 'neutral', // Will be classified by NLP later
            priority: 5,
            platform: 'instagram',
            publishedAt: new Date().toISOString(),
          });
        }
      });

      return results;
    });

    return comments.slice(0, 50); // Limit results
  } catch (error) {
    console.error('[Scraper] Instagram scrape error:', error);
    return [];
  } finally {
    await page.close();
    await context.close();
  }
}

/**
 * Scrape comments from TikTok video
 * TikTok scraping is challenging due to anti-bot measures
 */
export async function scrapeTikTokComments(videoUrl: string): Promise<Comment[]> {
  const browser = await getBrowser();
  const context = await browser.newContext({
    userAgent: USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
  });
  const page = await context.newPage();

  try {
    await page.goto(videoUrl, { waitUntil: 'networkidle', timeout: 30000 });

    // TikTok loads comments dynamically
    await page.waitForTimeout(3000);

    // Scroll to load more comments
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(2000);

    const comments = await page.evaluate(() => {
      // TikTok comment selectors (may change)
      const commentElements = document.querySelectorAll('[data-testid="comment-text"]');
      const results: any[] = [];

      commentElements.forEach((el, index) => {
        if (index > 50) return;

        const text = el.textContent?.trim();
        if (text && text.length > 5) {
          results.push({
            id: `tt_scraped_${index}`,
            text,
            authorHandle: `@scraped_user_${index}`,
            category: 'neutral',
            priority: 5,
            platform: 'tiktok',
            publishedAt: new Date().toISOString(),
          });
        }
      });

      return results;
    });

    return comments.slice(0, 50);
  } catch (error) {
    console.error('[Scraper] TikTok scrape error:', error);
    return [];
  } finally {
    await page.close();
    await context.close();
  }
}

/**
 * Close browser instance
 */
export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

// Auto-close on process exit
process.on('exit', closeBrowser);
process.on('SIGINT', closeBrowser);
process.on('SIGTERM', closeBrowser);
