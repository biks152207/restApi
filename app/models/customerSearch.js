var mongoose = require('mongoose');
var searchSchema = mongoose.Schema({
		customer_id     : { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
		search          : { type: String, required : true},
		location        : { type: String, required: true },
  	latlng          : mongoose.Schema.Types.Mixed,
  	status          : { type: Boolean, default: true },
  	is_deleted      : { type: Boolean, default: false },
  	created_at      : { type: Date, default: Date.now },
  	updated_at      : { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomerSearch', searchSchema);
