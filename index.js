const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Your Amber API key
const AMBER_API_KEY = 'psk_c97ca862a28306694cbd262795ed7cc4';

app.use(express.static(__dirname));

// Serve the dashboard (or just a placeholder)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Fetch Amber current price
app.get('/amber-price', async (req, res) => {
  try {
    const response = await fetch('https://api.amber.com.au/v1/currentPrice', {
      headers: {
        'x-api-key': 'psk_c97ca862a28306694cbd262795ed7cc4'
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Amber error:', error);
    res.status(500).json({ error: 'Failed to fetch Amber price' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
