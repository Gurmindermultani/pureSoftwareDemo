var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartSchema = mongoose.Schema({
	userId: Number,
	items: [Schema.Types.Mixed],
	total: Number,
	couponCode: String,
	discount: Number,
	amountPayable: Number
})


mongoose.model("Cart",cartSchema);
