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
  links.map((link)=> {
    if(link[short_url] === short_url){
      res.redirect(link[original_url]);
    }
  })
});

app.use(bodyParser.urlencoded({extended: false}));

let links = [];
let id = 0; 

app.post('/api/shorturl', (req, res)=>{
  let {url} = req.body;
  let dnsUrl = url.replace(/^https\:\/\//, '').replace(/\/$/, '');

  dns.lookup(dnsUrl, (err, address)=>{
    if(err)return res.json({
      error: "invalid url"
    });
    let urls = {
      original_url: url,
      short_url: id
    }
    links.push(urls);
    id++;
    
    res.json(urls);
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
