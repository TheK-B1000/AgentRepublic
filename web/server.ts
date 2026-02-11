import { createServer } from 'node:http';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'node:url';

const PORT = 3001;
const TRACE_DIR = join(process.cwd(), 'traces'); // Assuming run from project root

const server = createServer(async (req, res) => {
    // CORS for dev
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = parse(req.url || '', true);

    if (url.pathname === '/api/traces' && req.method === 'GET') {
        try {
            // Find latest trace file
            const files = await readdir(TRACE_DIR).catch(() => []);
            const jsonlFiles = files.filter(f => f.endsWith('.jsonl'));

            if (jsonlFiles.length === 0) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify([]));
                return;
            }

            // specific trace or latest? latest for now
            const latestFile = jsonlFiles.sort().pop()!;
            const content = await readFile(join(TRACE_DIR, latestFile), 'utf-8');

            // Parse lines
            const lines = content.trim().split('\n').map(line => {
                try { return JSON.parse(line); } catch { return null; }
            }).filter(Boolean);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(lines));
        } catch (err) {
            console.error(err);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
        return;
    }

    res.writeHead(404);
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`API Server running at http://localhost:${PORT}`);
});
