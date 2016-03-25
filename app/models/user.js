var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
// mongoose setup for users

// var mongoose = require('mongoose');
var customerSchema = mongoose.Schema({
      name            : { type: String, required: true },
      email           : { type: String, required: true },
	  	username        : { type: String, unique: true },
	  	password        : { type: String },
	  	location        : { type: String},
	  	latlng          : mongoose.Schema.Types.Mixed,
	  	phone_no        : String,
	  	gender          : String,
	  	profileImageURL : String,
      resetPasswordToken : String,
      resetPasswordExpires: String,
	  	social_links: {
	    	fb_url: String,
	    	twitter_url: String,
	    	google_url: String
	  	},
	  	status          : { type: Boolean, default: true },
	  	is_deleted      : { type: Boolean, default: false },
	  	created_at      : { type: Date, default: Date.now },
	  	updated_at      : { type: Date, default: Date.now }
});

// module.exports = mongoose.model('Customer', customerSchema);
customerSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt,function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

customerSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
var Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
