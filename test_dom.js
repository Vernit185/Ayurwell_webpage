import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log("Navigating to Amazon...");
    await page.goto("https://www.amazon.in/s?k=ashwagandha", { waitUntil: 'domcontentloaded', timeout: 45000 });
    
    console.log("Waiting for results...");
    await page.waitForSelector('div[data-component-type="s-search-result"]');
    
    console.log("Extracting HTML...");
    const html = await page.evaluate(() => {
        const item = document.querySelector('div[data-component-type="s-search-result"]');
        return item ? item.innerHTML : "No item found";
    });
    
    import('fs').then(fs => fs.writeFileSync('amazon_item.html', html));
    console.log("Saved to amazon_item.html");
    await browser.close();
})();
