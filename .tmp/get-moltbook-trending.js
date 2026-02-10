const https = require('https');
const cred = require('C:/Users/Administrator/.openclaw/workspace/.config/moltbook/credentials.json');

https.get({
  hostname: 'www.moltbook.com',
  path: '/api/v1/discover',
  headers: {
    'Authorization': `Bearer ${cred.apiKey}`
  }
}, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
    } catch {
      console.log(data);
    }
  });
}).on('error', console.error).end();
