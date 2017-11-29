const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const express_enforces_ssl = require("express-enforces-ssl");
const app = express();
const request = require('request');
const swagger_client = require('swagger-client');
const request_promise = require('request-promise');

const directLineSecret = 'o9ArxmBKa40.cwA.YoQ.PPlKQ9qrH99zhhtu6uWqWRIUhLrmYDGME2lew3pUwpg';
const directLineClientName = 'DirectLineClient';
const directLineSpecUrl = 'https://docs.botframework.com/en-us/restapi/directline3/swagger.json';

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
  res.sendFile(__dirname + '/views/home.html');
});

///--- REGISTERED LOGIN ---///
app.get('/login',function(req, res) {

  req.session.username = '';
  req.session.password = '';
  req.session.anonymous = req.query.anonymous;

  var directLineClient = request_promise(directLineSpecUrl)
  .then(function (spec) {
    return new swagger_client({
      spec: JSON.parse(spec.trim()),
      usePromise: true
    });
  })
  .then(function (client) {
    client.clientAuthorizations.add('AuthorizationBotConnector', new swagger_client.ApiKeyAuthorization('Authorization', 'Bearer ' + directLineSecret, 'header'));
    return client;
  })
  .catch(function (error) {
    console.error('Error initializing DirectLine client', error);
  });

  if (req.query.anonymous === 'true') {
    directLineClient.then(function (client) {
      client.Conversations.Conversations_StartConversation()
      .then(function (response) {
        return response.obj.conversationId;
      })
      .then(function (conversationId) {
          client.Conversations.Conversations_PostActivity({
            conversationId: conversationId,
            activity: {
              textFormat: 'plain',
              text: '{"username":"","password":""}',
              type: 'message',
              from: {
                id: directLineClientName,
                name: directLineClientName
              }
            }
          }).catch(function (error) {
            console.error('Error sending message:', error);
          });
      });
    });        

    res.contentType('application/json');
    res.send("{\"login\":\"success\"}");
  } else {
    request({
      headers: {
        'ZUMO-API-VERSION': '2.0.0',
        'Content-Type': 'application/json'
      },
      uri: 'http://contoso-lisa-mobile.azurewebsites.net/tables/CustomerTable',
      method: 'GET'
    }, function (error, response, body) {
      var success = false;
      if (error) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
      } else {
        var customers = JSON.parse(body);
        for (var index in customers) {
          if ((customers[index].username == req.query.username) && (customers[index].password == req.query.password)) {

            req.session.username = req.query.username;
            req.session.password = req.query.password;

            directLineClient.then(function (client) {
              client.Conversations.Conversations_StartConversation()
              .then(function (response) {
                return response.obj.conversationId;
              })
              .then(function (conversationId) {
                  client.Conversations.Conversations_PostActivity({
                    conversationId: conversationId,
                    activity: {
                      textFormat: 'plain',
                      text: '{"username":"' + req.session.username + '","password":"' + req.session.password + '"}',
                      type: 'message',
                      from: {
                        id: directLineClientName,
                        name: directLineClientName
                      }
                    }
                  }).catch(function (error) {
                    console.error('Error sending message:', error);
                  });
              });
            });        

            res.contentType('application/json');
            res.send("{\"login\":\"success\"}");
            success = true;
            break;
          }
        }
      }
      
      if (!success) {
        req.session.username = "";
        res.contentType('application/json');
        res.send("{\"login\":\"error\"}");
      }
    });
  }
});

///--- SUBMIT ---///
app.get('/submit',function(req, res) {

  var data = '{' + 
  '"username": "' + req.query.username + '",' + 
  '"firstname": "' + req.query.firstname + '",' + 
  '"lastname": "' + req.query.lastname + '",' + 
  '"email": "' + req.query.email + '",' + 
  '"tel": "' + req.query.tel + '",' + 
  '"password": "' + req.query.password + '",' + 
  '"birthdate": "' + req.query.birthdate + '",' + 
  '"balance" : "' + '0' + '"}';

  request({
    headers: {
      'ZUMO-API-VERSION': '2.0.0',
      'Content-Type': 'application/json'
    },
    uri: 'http://contoso-lisa-mobile.azurewebsites.net/tables/CustomerTable',
    body: data,
    method: 'POST'
  }, function (error, response, body) {
    if (error) {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', body);
      res.contentType('application/json');
      res.send("{\"submit\":\"error\"}");
    } else {
      res.contentType('application/json');
      res.send("{\"submit\":\"success\"}");
    }
  });
});

app.get('/botchat',function(req, res) {
  if ((!req.session.username || req.session.username == '') && (req.session.anonymous === 'false')) {
    res.send('<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Error</title></head><body><pre>Cannot GET /botchat1</pre></body></html>');
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
