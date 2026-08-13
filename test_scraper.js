import http from 'http';

http.get('http://localhost:5174/api/scrape-flipkart?q=ashwagandha', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log("Status:", res.statusCode);
        console.log("Data length:", data.length);
        const json = JSON.parse(data);
        console.log("Products found:", json.products?.length || 0);
    });
}).on('error', (err) => {
    console.error("Error:", err.message);
});
