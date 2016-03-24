var jwt = require('jsonwebtoken');
var config = require('../config/config');
module.exports = function(req, res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.status(401);
                return res.json({
                    success: 0,
                    message: 'Failed to authenticate token.'
                });
            } else {
                req.user = decoded.$__.scope;
                next();
            }
        });
    } else {
        res.status(401);
        return res.json({
            success: 0,
            message: 'Token required!'
        });
    }
}
