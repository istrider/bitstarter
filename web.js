var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
<<<<<<< HEAD
  response.send('Hello World 2!');
=======
  response.send('Hello World!');
>>>>>>> origin/master
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
<<<<<<< HEAD
});
=======
});
>>>>>>> origin/master
