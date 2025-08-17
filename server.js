// server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

// ROOT ROUTE
app.get('/', (req, res) => {
  res.json({ status: 'Proxy server running' });
});

app.get('/my-ip', async (req, res) => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    res.json({ ip: data.ip });
  } catch (error) {
    res.json({ error: 'Could not detect IP' });
  }
});

// Proxy all requests to Dynadot
app.all('/dynadot/*', async (req, res) => {
  const dynadotUrl = `https://api.dynadot.com/api3.json${req.url.replace('/dynadot', '')}`;
  
  const response = await fetch(dynadotUrl, {
    method: req.method,
    headers: req.headers,
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
  });
  
  const data = await response.json();
  res.json(data);
});

app.listen(process.env.PORT || 3000);
