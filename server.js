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
  
  res.json({ greeting: 'hello API' });
});

app.use(bodyParser.urlencoded({extended: false}));

app.post('/api/shorturl', (req, res)=>{
  let {url} = req.body

  dns.lookup(url, (err, address)=>{
    if(err)return console.log(err);
    res.json({
      original_url: address
    })
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
