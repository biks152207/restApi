var mongoose = require('mongoose');
var dealSchema = mongoose.Schema({
		business_id    : { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
		title          : { type: String, required : true},
		reg_price      : { type: Number, required : true, min: 1},
		sale_price     : { type: Number, required : true, min: 1},
		image          : { type: String},
		location       : { type: String, required: true },
	  latlng         : mongoose.Schema.Types.Mixed,
		expiry_date    : { type: Date, required : true},
  	status         : { type: Boolean, default: true },
  	is_deleted     : { type: Boolean, default: false },
  	created_at     : { type: Date },
  	updated_at     : { type: Date, default: Date.now }
});

module.exports = mongoose.model('Deal', dealSchema);
