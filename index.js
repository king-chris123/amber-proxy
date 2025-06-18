const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Your Amber API key
const AMBER_API_KEY = 'psk_c97ca862a28306694cbd262795ed7cc4';

app.use(express.static(__dirname));

// Serve dashboard.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// 🔌 Amber electricity price
app.get('/amber-price', async (req, res) => {
  try {
    const response = await fetch('https://api.amber.com.au/v1/currentPrice', {
      headers: {
        'x-api-key': AMBER_API_KEY
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Amber error:', error);
    res.status(500).json({ error: 'Failed to fetch Amber price' });
  }
});

// 💰 Bitcoin price in AUD
app.get('/bitcoin', async (req, res) => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=aud');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Bitcoin error:', error);
    res.status(500).json({ error: 'Failed to fetch BTC price' });
  }
});

// 🪙 CRO price in AUD
app.get('/cro', async (req, res) => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=crypto-com-chain&vs_currencies=aud');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('CRO error:', error);
    res.status(500).json({ error: 'Failed to fetch CRO price' });
  }
});

// 🌤️ Melbourne weather
app.get('/weather', async (req, res) => {
  try {
    const response = await fetch('https://wttr.in/Melbourne?format=%C+%t');
    const text = await response.text();
    res.send(text);
  } catch (error) {
    console.error('Weather error:', error);
    res.status(500).send('Error fetching weather');
  }
});

app.listen(PORT, () => {
  console.log(`Dashboard running on port ${PORT}`);
});
