var User = require('./app/models/user');
var jwt = require('jsonwebtoken'); // used to generate and verify the token

module.exports = function(route) {

    route.post('/authenticate', function(req, res) {
        User.findOne({
            name: req.body.name
        }, function(err, user) {
            if (err) throw err;
            if (!user) {

                res.json({
                    sucess: false,
                    message: 'Authentication failed'
                });

            } else if (user) {

                if (user.password != req.body.password) {
                    res.json({
                        sucess: false,
                        message: 'Authentication password doesnt match.'
                    });

                } else {

                    var token = jwt.sign(user, app.get('secret'), {
                        expiresInMinutes: 1440 //expires in 24 hrs
                    });
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    })
                }
            }
        })

    });

    route.use(function(req, res, next) {

        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, app.get('secret'), function(err, decoded) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {

            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    });
    route.get('/', function(req, res) {
        res.json({
            message: 'Welcome to the cooles api in the world!'
        });
    });

    route.get('/users', function(req, res) {
        User.find({}, function(err, users) {
            res.json(users);
        });
    });

}