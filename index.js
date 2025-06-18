const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const AMBER_API_KEY = 'psk_c97ca862a28306694cbd262795ed7cc4';
let cachedSiteId = null;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/amber-price', async (req, res) => {
  try {
    // Get Site ID if not already cached
    if (!cachedSiteId) {
      const siteRes = await fetch('https://api.amber.com.au/v1/sites', {
        headers: { 'x-api-key': AMBER_API_KEY }
      });
      const sites = await siteRes.json();
      cachedSiteId = sites[0]?.id;

      if (!cachedSiteId) {
        return res.status(500).json({ error: 'Could not fetch site ID' });
      }
    }

    // Get Price
    const priceRes = await fetch(`https://api.amber.com.au/v1/sites/${cachedSiteId}/prices/current`, {
      headers: { 'x-api-key': AMBER_API_KEY }
    });

    if (!priceRes.ok) {
      const text = await priceRes.text();
      return res.status(500).json({ error: text });
    }

    const price = await priceRes.json();
    res.json(price);
  } catch (error) {
    console.error('Amber price error:', error);
    res.status(500).json({ error: 'Amber price fetch failed' });
  }
});

app.get('/get-site-id', async (req, res) => {
  try {
    const response = await fetch('https://api.amber.com.au/v1/sites', {
      headers: {
        'x-api-key': AMBER_API_KEY
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching site ID:', error);
    res.status(500).json({ error: 'Could not fetch site ID' });
  }
});

// Other routes (BTC, CRO, weather) can remain the same

app.listen(PORT, () => {
  console.log(`✅ Dashboard server running on port ${PORT}`);
});
