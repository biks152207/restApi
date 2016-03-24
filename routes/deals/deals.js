var tokenMiddleware = require('../../config/token');
var Deals = require('../../app/models/deals');
module.exports = function(route){
  route.get('/Deals', tokenMiddleware, function(req, res){
    if (req.query.current_location){
      Deals.find({location: new RegExp(req.query.current_location, "i")})
        .populate('business_id')
         .exec(function(err, docs) {
           if (docs){
             return res.json({
               success: 1,
               data: docs
             })
           }else{
             return res.json({
               success: 0,
               message: 'Not found!'
             })
           }
        });
    }else{
      return res.json({
        success: 0,
        message: 'current_location is required!'
      })
    }
  });

  route.get('/DealDetails/:advertisement_id', tokenMiddleware, function(req, res){
    if (req.params.advertisement_id){
      Deals.findOne({_id: req.params.advertisement_id})
       .populate('business_id').exec(function(err, result){
        if(result){
          return res.json({
            success:1,
            data: result
          })
        }else{
          return res.json({
            success: 0,
            message: 'Not found!'
          })
        }
      })
    }else{
      return res.json({
        success: 0,
        message: 'advertisement_id missing!'
      })
    }
  })

}
