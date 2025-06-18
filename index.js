const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Updated Amber API key
const AMBER_API_KEY = 'psk_90d6f5af768f7a9930de1b1cfc1fce87';

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/amber-price', async (req, res) => {
  try {
    const response = await fetch('https://api.amber.com.au/v1/currentPrice', {
      headers: {
        'x-api-key': AMBER_API_KEY
      }
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Amber API error:', errorText);
      return res.status(response.status).json({ error: errorText });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Amber fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch Amber price' });
  }
});

// ... other routes for crypto and weather can stay the same

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
