
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var methodOverride = require('method-override');


var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');

var config = require('./config/config');
require('./config/passport')(passport);
var User = require('./app/models/user');

var port = process.env.Port || 8080;
mongoose.connect(config.database);
app.use(cors());
app.set('secret', config.secret);
app.use('/static', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(passport.initialize());
app.use(morgan('dev'));

app.get('/', function(req, res){
  res.send('Hello!');
});

require('./config/passport')(passport);
var apiRoutes = express.Router();
var registrationRoute = express.Router();
require('./routes/customer/customerSearch')(registrationRoute);
require('./routes/registration')(registrationRoute, passport);
require('./routes/deals/deals')(registrationRoute);
require('./routes/utility/email')(registrationRoute);
app.use('/', registrationRoute);
app.use('/api', apiRoutes);


app.listen(port);
console.log('Server listening on port ' + port);
