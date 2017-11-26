const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const express_enforces_ssl = require("express-enforces-ssl");
const app = express();
const request = require('request');

app.set('view engine', 'ejs');

app.use(express.static("views"));

app.use(helmet());
app.use(helmet.noCache());
app.enable("trust proxy");
app.use(express_enforces_ssl());

app.use(session({
  secret: "123456",
  resave: true,
  saveUninitialized: true,
  proxy: true,
  cookie: {
    httpOnly: true,
    secure: false
  }
}));

///--- INDEX PAGE ---///
app.get('/',function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

///--- REGISTERED LOGIN ---///
app.get('/login',function(req, res) {

  request({
    headers: {
      'ZUMO-API-VERSION': '2.0.0',
      'Content-Type': 'application/json'
    },
    uri: 'http://contoso-lisa-mobile.azurewebsites.net/tables/CustomerTable',
    method: 'GET'
  }, function (error, response, body) {
    if(error != null) {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', body);
    } else {
      var customers = JSON.parse(body);
      var success = false;
      for(var index in customers) {
        console.log(customers[index].username);
        console.log(customers[index].password);
        if((customers[index].username == req.query.username) && (customers[index].password == req.query.password)) {
          req.session.username = req.query.username;
          res.contentType('application/json');
          res.send("{\"login\":\"success\"}");
          success = true;
          break;
        }
      }
    }
    
    if(!success) {
      req.session.username = "";
      res.contentType('application/json');
      res.send("{\"login\":\"error\"}");
    }
  });
});

///--- SUBMIT ---///
app.get('/submit',function(req, res) {

  var data = '{' + 
  '"username": "' + req.query.username + '",' + 
  '"firstname": "' + req.query.firstname + '",' + 
  '"lastname": "' + req.query.lastname + '",' + 
  '"email": "' + req.query.email + '",' + 
  '"tel": "' + req.query.tel + '",' + 
  '"password": "' + req.query.password + '"}';

  request({
    headers: {
      'ZUMO-API-VERSION': '2.0.0',
      'Content-Type': 'application/json'
    },
    uri: 'http://contoso-lisa-mobile.azurewebsites.net/tables/CustomerTable',
    body: data,
    method: 'POST'
  }, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    res.contentType('application/json');
    res.send("{\"submit\":\"success\"}");
  });
});

app.get('/botchat',function(req, res) {
  if(!req.session.username || req.session.username == '') {
    res.send('<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Error</title></head><body><pre>Cannot GET /botchat</pre></body></html>');
  } else {
    res.render('botchat', {
      username: req.session.username
    });
  }
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on http://localhost:" + port);
});
