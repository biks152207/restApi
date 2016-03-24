var mongoose = require('mongoose');
var businessSchema = mongoose.Schema({
    	name            : { type: String, required: true }, // Owner's name
    	business_name   : { type: String, required: true }, // business's name
    	email           : { type: String, required: true }, // Owner's email
    	business_email  : { type: String, required: true }, // business's email
	  	username        : { type: String, required: true, unique: true },
	  	password        : { type: String, required: true },
	  	location        : { type: String, required: true },
	  	latlng          : mongoose.Schema.Types.Mixed,
	  	phone_no        : String,
	  	gender          : String,
	  	profileImageURL : String,
	  	website_url     : String,
	  	social_links    : {
	    	fb_url      : String,
	    	twitter_url : String,
	    	google_url  : String
	  	},
	  	opening_hours   : [mongoose.Schema.Types.Mixed],
	  	method_payment  : [String],
	  	languages       : [String],
	  	images          : [mongoose.Schema.Types.Mixed],
	  	videos          : [mongoose.Schema.Types.Mixed],
	  	business_type   : { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessType' },
	  	specialities    : [mongoose.Schema.Types.Mixed],
	  	status          : { type: Boolean, default: true },
	  	is_deleted      : { type: Boolean, default: false },
	  	created_at      : { type: Date, default: Date.now },
	  	updated_at      : { type: Date, default: Date.now },
      featured_business : {
          status: Boolean,
          start_date: Date,
          end_date: Date,
          date_created: Date,
  	      date_modified: Date
      }
});

businessSchema.index({ "latlng" : "2dsphere"});

module.exports = mongoose.model('Business', businessSchema);
