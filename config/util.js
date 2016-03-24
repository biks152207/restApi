var jwt = require('jsonwebtoken');
var config = require('../config/config');
function SaveToken(newCustomer){
    var token;
    this.setToken = function(){
      console.log(newCustomer);
      console.log('setting tokne');
      token = jwt.sign(newCustomer, config.secret, {
          expiresInMinutes: 1440 //expires in 24 hrs
      });
    }
    this.getToken = function(){
      console.log('getting tokne');
      return token;
    }


}
module.exports = SaveToken;
