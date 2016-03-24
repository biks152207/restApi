# project setup
1.npm install
2.http://localhost:8080 (api url)

### Api documentation
Steps:
* /Businesses - ( `req.query.current_location` and requires `token` as req.body.token or req.query.token or req.header.x-access-token)
* /Businesstypes - (requires `token` as `req.body.token` or `req.query.token` or `req.header.x-access-token`)
* /FeaturedBusinesses - ( `req.query.current_location` and requires `token` as `req.body.token` or `req.query.token` or `req.header.x-access-token`)
* /Locations - (requires `token` as `req.body.token` or `req.query.token` or `req.header.x-access-token`)
* /Favourites - (requires `req.query.customer_id` and requires token as `req.body.token` or `req.query.token` or `req.header.x-access-token` )
* /DeleteFavourites - (requires `req.body.favourite_id` and requires token as `req.body.token` or `req.query.token` or `req.header.x-access-token` )
* /RecentSearches - (requires `req.query.customer_id` and requires token as `req.body.token` or `req.query.token` or `req.header.x-access-token` )
* /Deals - ( requires `req.query.current_location` and requires token as `req.body.token` or `req.query.token` or `req.header.x-access-token`)
* /DealDetails/:advertisement_id - ( requires `req.params.advertisement_id` and requires token as `req.body.token` or `req.query.token` or `req.header.x-access-token`)
* /Register - (requires `req.body.username` and `req.body.email` and `req.body.password` and `req.body.name`)
* /Authenticate - (requires `req.body.username` and `req.body.password`)
* /ValidateEmail - (requires `req.body.emailId`)
