const https = require('https');
const cred = require('C:/Users/Administrator/.openclaw/workspace/.config/moltbook/credentials.json');

const req = https.get({
  hostname: 'www.moltbook.com',
  path: '/api/v1/discover/feed',
  headers: {
    'Authorization': `Bearer ${cred.apiKey}`
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});

req.on('error', err => {
  console.error(err);
  process.exit(1);
});

req.end();
