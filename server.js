const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();

app.use(cors());

const ZENO_STREAM_URL = 'https://stream.zeno.fm/krdfduyswxhtv';

app.get('/radio', (req, res) => {
  req.pipe(request(ZENO_STREAM_URL)).pipe(res);
});

app.use(express.static('public'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy server radi na http://localhost:${PORT}`);
});
