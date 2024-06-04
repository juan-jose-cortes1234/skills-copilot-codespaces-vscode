// Create web server
// 1. Import required modules
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const comments = require('./comments.json');

// 2. Create server
http.createServer((req, res) => {
    const uri = url.parse(req.url).pathname;
    const filename = path.join(process.cwd(), uri);

    let stats;

    try {
        stats = fs.lstatSync(filename);
    } catch (e) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('404 Not Found\n');
        res.end();
        return;
    }

    if (stats.isFile()) {
        const mimeType = {
            '.ico': 'image/x-icon',
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.css': 'text/css',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.wav': 'audio/wav',
            '.mp3': 'audio/mpeg',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
            '.doc': 'application/msword'
        };
        const ext = path.parse(filename).ext;
        res.writeHead(200, { 'Content-Type': mimeType[ext] || 'application/octet-stream' });

        const fileStream = fs.createReadStream(filename);
        fileStream.pipe(res);
    } else if (stats.isDirectory()) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('Index of ' + uri + '\n');
        res.write('TODO, show files?');
        res.end();
    } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.write('500 Internal server error\n');
        res.end();
    }
}).listen(8125);

// 3. Output message to console
console.log('Server running at http://')
