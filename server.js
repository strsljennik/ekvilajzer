const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();
app.use(cors());

const ZENO_STREAM_URL = 'https://stream.zeno.fm/krdfduyswxhtv';

app.get('/radio', (req, res) => {
  console.log(`[${new Date().toISOString()}] Novi zahtev za stream`);

  const streamReq = request({
    url: ZENO_STREAM_URL,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Node.js proxy)'
    },
    timeout: 15000
  });

  streamReq.on('response', (response) => {
    console.log(`[${new Date().toISOString()}] Stream status: ${response.statusCode}`);
    res.writeHead(response.statusCode, response.headers);
  });

  streamReq.on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Greška na stream-u:`, err.message);
    if (!res.headersSent) {
      res.status(500).send('Greška prilikom dohvata stream-a.');
    }
  });

  streamReq.pipe(res);

  req.on('close', () => {
    console.log(`[${new Date().toISOString()}] Veza sa klijentom prekinuta`);
    streamReq.abort();
  });
});

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Proxy server startovan na portu ${PORT}`);
});
