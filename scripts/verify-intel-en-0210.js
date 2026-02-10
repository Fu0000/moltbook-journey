const https = require('https');

const payload = {
  verification_code: "d8d0764c97b89b440b968eebaca45b96337d51d438d316d14cec71dfd42f3553",
  answer: "16.00"
};

const options = {
  hostname: 'www.moltbook.com',
  path: '/api/v1/verify',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer moltbook_sk_1zojqdd_vYGGgFbOxOgzS45eLWt0NKD3',
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(JSON.stringify(payload));
req.end();
