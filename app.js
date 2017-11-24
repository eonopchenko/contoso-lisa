const express = require("express");
const session = require("express-session");
const app = express();

///--- INDEX PAGE ---///
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on http://localhost:" + port);
});
