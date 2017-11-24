const express = require("express");
const session = require("express-session");
const cfenv = require("cfenv");
const app = express();

app.set('view engine', 'ejs');

app.use(express.static("views"));

if (!cfenv.getAppEnv().isLocal) {
  app.use(helmet());
  app.use(helmet.noCache());
  app.enable("trust proxy");
  app.use(express_enforces_ssl());
}

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
  req.session.username = req.query.username;
  req.session.password = req.query.password;
  res.contentType('application/json');
  res.send("{\"login\":\"success\"}");
  // req.session.username = "";
  // req.session.password = "";
  // res.contentType('application/json');
  // res.send("{\"login\":\"error\"}");
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
