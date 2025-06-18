const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/amber-price', async (req, res) => {
  try {
    const response = await fetch("https://api.amber.com.au/v1/sites", {
      headers: {
        Authorization: "Bearer psk_c97ca862a28306694cbd262795ed7cc4"
      }
    });

    const sites = await response.json();
    const siteId = sites[0]?.id;

    if (!siteId) {
      return res.status(500).json({ error: "No site ID found." });
    }

    const priceResponse = await fetch(`https://api.amber.com.au/v1/sites/${siteId}/prices/current`, {
      headers: {
        Authorization: "Bearer psk_c97ca862a28306694cbd262795ed7cc4"
      }
    });

    const priceData = await priceResponse.json();
    res.json(priceData);
  } catch (error) {
    console.error("Error fetching Amber price:", error);
    res.status(500).json({ error: "Failed to fetch Amber price." });
  }
});

app.get("/", (req, res) => {
  res.send("Amber proxy is running!");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
