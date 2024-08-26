require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const url = require('url');
const path = require('path');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
let nextId = 1; // Counter for generating short URLs
const urlMapping = {}; // Store mappings of short URLs to original URLs

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// POST endpoint to create a shortened URL
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  const parsedUrl = url.parse(originalUrl);

  // Simple URL validation using dns.lookup
  if (!parsedUrl.hostname) {
    return res.json({ error: 'invalid url' });
  }

  dns.lookup(parsedUrl.hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    // Create a short URL using the incremented counter
    const shortUrl = nextId++;
    urlMapping[shortUrl] = originalUrl; // Store the mapping

    res.json({ original_url: originalUrl, short_url: shortUrl });
  });
});

// GET endpoint to redirect to the original URL
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url, 10);

  if (urlMapping[shortUrl]) {
    res.redirect(urlMapping[shortUrl]); // Redirect to the original URL
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
