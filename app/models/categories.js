var mongoose = require('mongoose');
var businessTypeSchema = mongoose.Schema({
      type            : { type: String, required: true, unique: true },
	  	status          : { type: Boolean, default: true },
	  	is_deleted      : { type: Boolean, default: false },
	  	created_at      : { type: Date, default: Date.now },
	  	updated_at      : { type: Date, default: Date.now }
});

module.exports = mongoose.model('BusinessType', businessTypeSchema);
