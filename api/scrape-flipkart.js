import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

try {
    // Prevent "Plugin already registered" error on Vite HMR dynamic imports
    if (!puppeteer.plugins || !puppeteer.plugins.find(p => p.name === 'stealth')) {
        puppeteer.use(StealthPlugin());
    }
} catch (e) {}

export default async function handler(req, res) {
    let browser;
    try {
        const query = req.query.q || 'Ayurvedic products';
        const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
        
        browser = await puppeteer.launch({
            headless: 'new', // run in background
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        
        const page = await browser.newPage();
        
        // Setup reasonable viewport
        await page.setViewport({ width: 1280, height: 800 });
        
        // Speed up scraping by blocking resources
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });
        
        // Go to Flipkart Search
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
        
        // Wait for search results container
        await page.waitForSelector('div[data-id]', { timeout: 15000 });
        
        // Extract Data
        const products = await page.evaluate(() => {
            const items = document.querySelectorAll('div[data-id]');
            const results = [];
            
            items.forEach((item) => {
                if (results.length >= 10) return;
                
                // Flipkart has multiple layouts. We try to be robust.
                const titleEl = item.querySelector('a.wjcEIp') || item.querySelector('a.CGtC98') || item.querySelector('a[title]');
                const priceEl = item.querySelector('div.Nx9bqj');
                const urlEl = item.querySelector('a');
                const imgEl = item.querySelector('img.DByuf4') || item.querySelector('img');
                
                if (titleEl && priceEl && urlEl && imgEl) {
                    const titleStr = titleEl.getAttribute('title') || titleEl.innerText;
                    const priceStr = priceEl.innerText.replace(/[^0-9]/g, '');
                    let imgStr = imgEl.getAttribute('src') || imgEl.getAttribute('data-src');
                    
                    if (titleStr && priceStr && imgStr && !imgStr.includes('data:image')) {
                        results.push({
                            name: titleStr,
                            brand: 'Ayurvedic Brand',
                            price: parseInt(priceStr) || 200,
                            rating: 4.2, // Hard to extract reliably across all layouts
                            url: 'https://www.flipkart.com' + urlEl.getAttribute('href'),
                            image: imgStr
                        });
                    }
                }
            });
            return results;
        });
        
        await browser.close();
        
        res.json({ products: products });
    } catch (error) {
        if (browser) await browser.close();
        console.error("Flipkart Puppeteer Scrape Error:", error);
        res.status(500).json({ products: [] });
    }
}
