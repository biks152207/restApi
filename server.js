// Server setup for token based authentication

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var config = require('./config');
var User = require('./app/models/user');

var port = process.env.Port || 8080;
mongoose.connect(config.database);
app.set('secret', config.secret);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.get('/', function(req, res){
  res.send('Hello! welcome to token based authentication.available routes \'/setup\' to add new user, \'api/authenticate\' to login, \'/api\'');
});

app.get('/setup', function(req, res){
  var user = new User({
    name: 'Bikram',
    password: 'password',
    admin: true
  })

  user.save(function(err){
    if (err) throw err;
    console.log('User saved!!');
    res.json({success: true});
  })
});

var apiRoutes = express.Router();

require('./routes.js')(apiRoutes);

app.use('/api', apiRoutes);

app.listen(port);
console.log('Server listening on port ' + port);