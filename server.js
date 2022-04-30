require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/shorturl/:short_url', function(req, res) {
  let {short_url} = req.query;
  res.json({ greeting: 'hello API' });
});

app.use(bodyParser.urlencoded({extended: false}));

app.post('/api/shorturl', (req, res)=>{
  let {url} = req.body;
  url = url.replace(/^https\:\/\//, '');
  console.log(url);
  dns.lookup(url, (err, address)=>{
    if(err)return res.json({
      error: "invalid url"
    });
    res.json({
      original_url: url,
      short_url: 1
    })
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
