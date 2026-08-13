import handler from './api/scrape-amazon.js';

const req = { query: { q: 'all' } };
const res = {
    json: (data) => console.log("JSON:", data),
    status: (code) => ({ json: (data) => console.log("STATUS", code, data) })
};

handler(req, res).then(() => console.log("Done"));
