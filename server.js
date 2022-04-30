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
    id++;
    let urls = {
      original_url: url,
      short_url: id
    }
    links.push(urls);
    
    return res.json(urls);
  })
})
app.get('/api/shorturl/:inputId', function(req, res) {
  let {inputId} = req.params;
  console.log("inputId:", inputId)
  let urlObject = links.find((link)=> link.short_url.toString() === inputId);
  console.log('url:' ,urlObject.original_url);
  if(urlObject){
    return res.status(301).redirect(urlObject.original_url);
  }
  
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
