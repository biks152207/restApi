var mongoose = require('mongoose');
var customerFavoriteSchema = mongoose.Schema({
		customer_id     : { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
		business_id     : { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
  	status          : { type: Boolean, default: true },
  	is_deleted      : { type: Boolean, default: false },
  	created_at      : { type: Date, default: Date.now },
  	updated_at      : { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomerFavorite', customerFavoriteSchema);
