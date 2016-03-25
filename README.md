# project setup
1.npm install
2.http://localhost:8080 (api url)

### Api documentation
Steps:
* /Businesses - ( get request with `req.query.current_location` and `token` as req.body.token or req.query.token or req.header.x-access-token)
* /Businesstypes - (get requrest with `token` as `req.body.token` or `req.query.token` or `req.header.x-access-token`)
* /FeaturedBusinesses - (get request with  `req.query.current_location` and  `token` as `req.body.token` or `req.query.token` or `req.header.x-access-token`)
* /Locations - (get request with `token` as `req.body.token` or `req.query.token` or `req.header.x-access-token`)
* /Favourites - (get request with as `req.body.token` or `req.query.token` or `req.header.x-access-token` )
* /DeleteFavourites - (delete request with  `req.body.favourite_id` and token as `req.body.token` or `req.query.token` or `req.header.x-access-token` )
* /RecentSearches - (get request with  `req.query.customer_id` and  token as `req.body.token` or `req.query.token` or `req.header.x-access-token` )
* /Deals - (get request with `req.query.current_location` and  token as `req.body.token` or `req.query.token` or `req.header.x-access-token`)
* /DealDetails/:advertisement_id - (get request with `req.params.advertisement_id` and  token as `req.body.token` or `req.query.token` or `req.header.x-access-token`)
* /Register - (post request with `req.body.username` and `req.body.email` and `req.body.password` and `req.body.name`)
* /Authenticate - (post request `req.body.email` and `req.body.password`)
* /ValidateEmail - (post request with `req.body.emailId`)
* /NearByBussiness - (post request with `req.query.lang` , `req.query.lat` and requires token as `req.body.token` or `req.query.token` or `req.header.x-access-token`)
*  /Favourites (post request with `req.body.business_id` and requires token as `req.body.token` or `req.query.token` or `req.header.x-access-token`)
*  /resetPassword (post request with `req.body.email`)
*  /reset/:token (post request with `req.params.token` and  `req.body.password`)
