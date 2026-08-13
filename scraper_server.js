import http from 'http';
import url from 'url';
import amazonHandler from './api/scrape-amazon.js';
import flipkartHandler from './api/scrape-flipkart.js';

const port = 5174;

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // Mock express res.status and res.json
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
    };
    
    // Mock req.query
    req.query = parsedUrl.query;

    try {
        if (parsedUrl.pathname === '/api/scrape-amazon') {
            await amazonHandler(req, res);
        } else if (parsedUrl.pathname === '/api/scrape-flipkart') {
            await flipkartHandler(req, res);
        } else {
            res.status(404).json({ error: 'Not found' });
        }
    } catch (e) {
        console.error("Server error:", e);
        if (!res.headersSent) res.status(500).json({ products: [] });
    }
});

server.listen(port, () => {
    console.log(`Scraper standalone server running on http://localhost:${port}`);
});
