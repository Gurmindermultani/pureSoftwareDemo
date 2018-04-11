var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
	name: String,
	price: Number,
	currency: String
})


mongoose.model("Product",productSchema);
