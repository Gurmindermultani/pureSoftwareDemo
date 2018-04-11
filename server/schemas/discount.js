var mongoose = require('mongoose');

var discountSchema = mongoose.Schema({
	couponCode: String,
	description: String,
	couponType: {
		type:String,
		enum: ['Percentage','FixedPrice','B1G1','B2G1']	
	}
})


mongoose.model("Coupon",discountSchema);
