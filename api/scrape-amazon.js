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
        const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
        
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
        
        // Go to Amazon Search
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
        
        // Wait for search results
        try {
            await page.waitForSelector('div[data-component-type="s-search-result"]', { timeout: 15000 });
        } catch (e) {
            console.error("Timeout waiting for selector, taking screenshot");
            await page.screenshot({ path: 'amazon-debug.png' });
        }
        
        // Extract Data
        const products = await page.evaluate(() => {
            const items = document.querySelectorAll('div[data-component-type="s-search-result"]');
            const results = [];
            
            items.forEach((item) => {
                if (results.length >= 10) return;
                
                const titleEl = item.querySelector('h2 span') || item.querySelector('h2 a span') || item.querySelector('h2');
                const priceEl = item.querySelector('.a-price-whole');
                const imgEl = item.querySelector('.s-image');
                let urlEl = item.querySelector('h2 a');
                if (!urlEl) {
                    const h2 = item.querySelector('h2');
                    if (h2 && h2.closest('a')) urlEl = h2.closest('a');
                    else urlEl = item.querySelector('a.a-link-normal');
                }
                
                if (titleEl && urlEl) {
                    const priceStr = priceEl ? priceEl.innerText.replace(/[^0-9]/g, '') : '200';
                    results.push({
                        name: titleEl.innerText,
                        brand: 'Ayurvedic Brand',
                        price: parseInt(priceStr) || 200,
                        rating: 4.5,
                        url: 'https://www.amazon.in' + urlEl.getAttribute('href'),
                        image: imgEl ? imgEl.getAttribute('src') : 'https://images.unsplash.com/photo-1596462502278?auto=format&fit=crop&w=400&q=80'
                    });
                }
            });
            return results;
        });
        
        await browser.close();
        
        res.json({ products: products });
    } catch (error) {
        if (browser) await browser.close();
        console.error("Amazon Puppeteer Scrape Error:", error);
        res.status(500).json({ products: [] });
    }
}
