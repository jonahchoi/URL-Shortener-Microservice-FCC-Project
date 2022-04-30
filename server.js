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
let http = /^https?\:\/\//;

app.post('/api/shorturl', (req, res)=>{
  let {url} = req.body;
  console.log('original url', url);
  let dnsUrl = url.replace(http, '').replace(/\/$/, '');
  console.log('dnsUrl', dnsUrl)
  dns.lookup(dnsUrl, (err, address)=>{
    if(err)return res.json({
      error: "invalid url"
    });
    id++;
    let urls = {
      original_url: url,
      short_url: id
    }
    console.log(urls);
    links.push(urls);
    console.log('before json', urls)
    return res.json(urls);
  })
})
app.get('/api/shorturl/:inputId', function(req, res) {
  let {inputId} = req.params;
  let urlObject = links.find((link)=> link.short_url.toString() === inputId);
  
  if(urlObject){
    if(!http.test(urlObject.original_url)){
      urlObject.original_url = urlObject.original_url.replace('', 'http://');
    }
    return res.status(301).redirect(urlObject.original_url);
  }
  else{
    return res.json({
      error: "invalid url"
    })
  }
  
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
