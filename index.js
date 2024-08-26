require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
let nextId = 1; // Counter for generating short URLs

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

  // Simple URL validation
  const urlPattern = /^https?:\/\/(www\.)?\w+\.\w+/;
  if (!urlPattern.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Create a short URL using the incremented counter
  const shortUrl = nextId++;

  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// GET endpoint to redirect to the original URL (non-functional in this case)
app.get('/api/shorturl/:short_url', (req, res) => {
  res.json({ error: 'No short URL found for the given input' });
});

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
