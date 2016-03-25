var customer = require('../app/models/user.js');
var _ = require('lodash');
var async = require('async');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var config = require('../config/config');
var crypto = require('crypto');
var smtpTransport = require("nodemailer-smtp-transport");
var smtpTransport = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  auth: {
      user: config.gmailUser, // my mail
      pass: config.gmailPassword
  }
}));
var tokenData = require('../config/util')();
module.exports = function(route, passport){
  route.post('/Register', function(req, res){
    if (!req.body.username || !req.body.email || !req.body.password || !req.body.name || !req.body.location){
      res.json({success: 0, message: 'Please enter username ,password , email, name, location'});
      return;
    }
    customer.findOne({ email: req.body.email}, function(err, result){
      if(err){
        return res.json({ success: 0, message: 'Error occurred!'});

      }
      if (result === null){
        var newCustomer = new customer({
          username: req.body.username,
          email: req.body.email,
          password:req.body.password,
          location: req.body.name,
          name: req.body.name
        })
        newCustomer.save(function(err){
          console.log(err);
          if(err) {
            if (err.code == 11000){
              return res.json({success: 0, message: 'Username already exists'});
            }
            return res.json({success: 0, message: err});

          }
          var token = jwt.sign(newCustomer, config.secret, {
              expiresInMinutes: 1440 //expires in 24 hrs
          });
          return res.json({
              success: 1,
              message: 'User successfully registerd!',
              token: token,
              data: newCustomer
          })
        })
      }else{
        return res.json({ success: 0, message: 'Email already exists!'});

      }
    })

  })

  route.post('/Authenticate', function(req, res){
    if (req.body.username && req.body.password){
      customer.findOne({username: req.body.username}, function(err, result){
        if(err){
          res.json({success: 0, message: 'Something went wrong!'})
        }else{
          var hashPassword = result.password;
          result.comparePassword(req.body.password, function(err, isMatch){
            if(err){
              res.json({success: 0, message: 'Something went wrong' });
            }
            if (isMatch){
              res.status(200)
              return res.json({
                success: 1,
                message: 'Successfully logged In',
                data: result
              });
            }else{
              res.json({
                success: 0,
                message: 'Invalid password or username'
              })
            }
          })
        }
      })
    }
  })
  route.post('/resetPassword', function(req, res){
    if (req.body.email){
      async.waterfall(
        [
          function(callback){
            crypto.randomBytes(20, function(err, buf) {
              var token = buf.toString('hex');
              callback(null, token);
            });
          }, function(token, callback){
            customer.findOne({email: req.body.email}, function(err, user){
              if (!user){
                return res.json({
                  success: 0,
                  message: 'User with the email ' + req.body.email + ' doesn\'t exist'
                })
              }else{
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hr
                user.save(function(err){
                  callback(null, token, user);
                })
              }
            })
          }, function(token, user ,done){
            // var smtpTransport = nodemailer.createTransport("SMTP",{
            //    host: 'smtp.gmail.com',
            //    port: 465,
            //    secure: true,
            //    service: "gmail",
            //    auth: {
            //        user: config.gmailUser,
            //        pass: config.gmailPassword
            //    }
            //  })
             var mailOptions = {
                to: user.email,
                from: config.gmailUser,
                subject: 'Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                  'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
              };
              smtpTransport.sendMail(mailOptions, function(err) {
                console.log(err);
                if (err){
                  done(new Error("Unable to send mail"));
                }else{
                  return res.json({
                    success:1,
                    message: 'Successfully sent email for password.Please check your email'
                  })
                  done(null, 'done');
                }

              });
          }
        ], function(err){
            console.log(err);
          }
      )

    }else{
      return res.json({
        success: 0,
        message: 'Please enter your email address.'
      })
    }
  })
  route.post('/ValidateEmail', function(req, res){
    if (req.body.emailId){
      customer.findOne({email: req.body.emailId}, function(err, result){
        if (err){
          return res.json({
            success: 0,
            message: 'Something went wrong!'
          })
        }
        if (result === null){
          return res.json({
            success: 0,
            message: 'User doesnt exists with this email'
          })
        }else{
          return res.json({
            success: 1,
            data: result
          })
        }
      })
    }else{
      return res.json({
        success: 0,
        message: 'Please provide emailId'
      })
    }
  })
  route.get('/reset/:token', function(req, res){
    res.sendfile('public/index.html');
  })
  route.post('/reset/:token', function(req, res){

    async.waterfall([
      function(done) {
        customer
          .findOne({ resetPasswordToken: req.params.token , resetPasswordExpires: { $gt: Date.now() }} )
          .exec(function(err, user) {
            if (err) {
              return next(err);
            }
            if (!user) {
              return res.json({
                success: 1,
                message: 'Password reset token is invalid or has expired'
              })

            }
            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.passwordResetExpires = undefined;
            user.save(function(err) {
              if (err) {
                return res.json({
                  success : 0,
                  message: 'Something went wrong'
                })
              }
              done(null, user)
            });
          });
      },
      function(user, done) {
        var mailOptions = {
          to: user.email,
          from: config.gmailUser,
          subject: 'Your  password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          return res.json({
            success:1,
            message: 'Success! Your password has been changed.'
          })
          // done(err);
        });
    }
  ], function(err) {
    if (err) {
      return next(err);
    }

  });
  })
  route.get('/auth/facebook', passport.authenticate('facebook', {scope : 'email'}), function(req, res) {
    console.log('testdfsdfsdf')
  });
  route.get('/auth/facebook/callbackURL',   passport.authenticate('facebook', {
    successRedirect : '/facebook',
    failureRedirect : '/'
  }))
  route.get('/facebook', function(req, res){
    console.log('here we are');
  })

}
