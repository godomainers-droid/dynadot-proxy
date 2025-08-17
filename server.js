const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

// Root route (you already have this)
app.get('/', (req, res) => {
  res.json({ status: 'Proxy server running' });
});

// MISSING PROXY ROUTE - Add this!
app.all('/dynadot', async (req, res) => {
  try {
    // Get query parameters from the request
    const queryString = req.url.split('?')[1] || '';
    const dynadotUrl = `https://api.dynadot.com/api3.json?${queryString}`;
    
    console.log('Proxying request to Dynadot:', dynadotUrl);
    
    const response = await fetch(dynadotUrl);
    const data = await response.text();
    
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy error: ' + error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
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
