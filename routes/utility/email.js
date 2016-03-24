var validator = require("email-validator");
module.exports = function(route){

  route.post('/ValidateEmail', function(req, res){
    if (req.body.emailId){
      var isValid = validator.validate("test@email.com");
      if (isValid){
        res.json({
          succss: 1,
          message: 'Valid email'
        })
      }
    }
  })
}
