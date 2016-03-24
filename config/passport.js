var configAuth = require('../config/config');
// var FacebookTokenStrategy = require('passport-facebook-token');
var Token = require('./util');
var customer = require('../app/models/user.js');
var FacebookStrategy = require('passport-facebook').Strategy;
module.exports = function(passport) {
    // console.log(passport);
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    passport.use(new FacebookStrategy({
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields: ['email', 'profileUrl', 'gender', 'displayName','photos']

    },
    function(token, refreshToken, profile, done) {

          process.nextTick(function() {
            customer.findOne({ email : profile._json.email }, function(err, user) {
                console.log(user);
                console.log(err);
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    new Token.setToken(user);
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser  = new customer();

                    // set all of the facebook information in our user model
                    newUser.email    = profile._json.email; // set the users facebook id
                    newUser.name = profile._json.name; // we will save the token that facebook provides to the user
                    newUser.profileImageURL  = profile._json.picture.data.url;
                    newUser.social_links.fb_url = profile._json.link; // facebook can return multiple emails so we'll take the first
                    console.log('new user....');
                    // save our user to the database
                    newUser.save(function(err) {
                        console.log(err);
                        if (err)
                            throw err;

                        // if successful, return the new user
                        Token.setToken(newUser);
                        return done(null, newUser);
                    });
                }
              });
            });

    }));

};
