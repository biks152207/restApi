var tokenMiddleware = require('../../config/token');
var jwt = require('jsonwebtoken');
var config = require('../../config/config');
var customer = require('../../app/models/customerSearch');
var faker = require('faker');
var category = require('../../app/models/categories');
var bussiness = require('../../app/models/bussiness');
var Favourites = require('../../app/models/favourites');
var CustomerSearch = require('../../app/models/customerSearch')
module.exports = function(route){
  route.get('/Businesses', tokenMiddleware, function(req, res){
    if (req.query.current_location){
      customer.find({location: new RegExp(req.query.current_location, "i")})
        .populate('customer_id')
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
        status: 0,
        message: 'Please provide query string current_location'
      })
    }
  })

  route.get('/NearByBussiness', tokenMiddleware, function(req, res){
    if (req.query.lat && req.query.long){
      var coords = [];
      coords[0] = Number(req.query.lat);
      coords[1] = Number(req.query.long);
      bussiness.find(
       { latlng :
           { $near :
              {
                $geometry : { coordinates : coords}}
           }
        },
        function(err,staches) {
            return res.json({
              success: 1,
              data: staches
            })
        }
    );
    }else{
      return res.json({
        success: 0,
        message: 'Please provide langitude and latitude'
      })
    }
  })

  route.get('/FeaturedBusinesses', tokenMiddleware, function(req, res){
    if (req.query.current_location){
      bussiness.find({location:{ "$regex": req.query.current_location, "$options": "i" }})
        .populate('business_type')
         .exec(function(err, docs) {
           if (docs){
             return res.json({
               success: 1,
               data: docs
             })
           }
        });
    }else{

      return res.json({
        status: 0,
        message: 'Please provide query string current_location'
      })
    }
  })

  route.get('/Favourites', tokenMiddleware, function(req, res){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    jwt.verify(token, config.secret, function(err, decoded) {
        req.user = decoded.$__.scope;
        Favourites.find({customer_id: req.user.id}, function(err, result){
          if (result){
            return res.json({
              success: 1,
              data: result
            })
          }
        })

    });

  });

  route.post('/Favourites', tokenMiddleware, function(req, res){
    if (req.body.business_id){
      var fav = new Favourites({
        customer_id: req.user._id,
        business_id: req.body.business_id
      })
      fav.save(function(err){
        if (err){
          return res.json({
            success: 0,
            message: 'Something went wrong'
          })
        }else{
          return res.json({
            success:1,
            message: 'Successfully added to favourite list'
          })
        }
      })
    }else{
      return res.json({
        success:0,
        message: 'Please provide business id'
      })
    }
  })

  route.delete('/DeleteFavourites', tokenMiddleware, function(req, res){
    if (req.body.favourite_id){
      Favourites.findByIdAndRemove(req.body.favourite_id, function(err){
        if (err){
          return res.json({
            status: 0,
            message: 'Something went wrong'
          })
        }
        else{
          return res.json({
            status: 1,
            message: 'Successfully Deleted!'
          })
        }
      })
    }else{
      return res.json({
        status: 0,
        message: 'Please provide favourite_id'
      })
    }
  });

  route.get('/RecentSearches', tokenMiddleware, function(req, res){
    if (req.query.customer_id){
      customer.findOne({customer_id: req.query.customer_id }, 'search', function(err, result){
        if (err){
          return res.json({
            success: 0,
            message: 'Something went wrong'
          })
        }else{
          return res.json({
            success: 1,
            data: result
          })
        }
      })
    }
  });

  route.get('/Locations', tokenMiddleware, function(req, res){
    bussiness.find({}, 'location', function(err, data){
      if (err){
        return res.json({
          success: 0,
          message: 'Something went wrong!'
        })
      }
      return res.json({
        success: 1,
        data: data
      })
    })
  });

  route.get('/Businesstypes', tokenMiddleware, function(req, res){

    category.find({}, function(err, result){
      if(err){
        res.json({success: 0, message: 'Something went wrong'});
      }else{
        res.json({success: 1, data:result});
      }
    })
  })


}
