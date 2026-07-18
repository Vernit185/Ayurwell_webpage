import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Mock Vercel Serverless API environment for local Vite Dev Server
import { pathToFileURL } from 'url';

const vercelApiPlugin = () => ({
  name: 'vercel-api',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url && req.url.startsWith('/api/scrape')) {
        try {
          // Dynamic import of the Vercel serverless function with proper Windows path handling
          const apiPath = req.url.split('?')[0].replace('/api/', '');
          const absolutePath = path.resolve(__dirname, `./api/${apiPath}.js`);
          const handler = await import(`${pathToFileURL(absolutePath).href}?update=${Date.now()}`);
          
          // Mock Express-like response methods for the serverless function
          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          };
          
          // Parse query string manually for req.query
          req.query = Object.fromEntries(new URLSearchParams(req.url.split('?')[1]));
          
          await handler.default(req, res);
        } catch (err) {
          console.error(err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Local API emulator failed', details: err.message }));
        }
      } else {
        next();
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // We removed the old proxy because we now use our native Node scraper
})
