var customer = require('../app/models/user.js');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
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
