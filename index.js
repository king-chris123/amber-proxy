const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Get your Amber API key from environment variable or fallback to your key here (only for local testing)
const AMBER_API_KEY = process.env.AMBER_API_KEY || 'psk_c97ca862a28306694cbd262795ed7cc4';

console.log('Using Amber API Key:', AMBER_API_KEY);

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
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch Amber price' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
