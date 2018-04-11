var mongoose = require('mongoose');

var Product = mongoose.model('Product');
var Cart = mongoose.model('Cart');
var Coupon = mongoose.model('Coupon');

var sampleProducts = require('./data/products.js');
var sampleCart = {
		userId : 123456,
		items :  []
	}
var sampleCoupon = {
		couponCode: 'killingspree',
		description: 'Buy two get one.',
		couponType: 'B2G1'
}

module.exports = function(){

	//Clean the previous db
	Product.remove({},(err)=> {
		Product.insertMany(sampleProducts, (err,docs)=> {});
	});
	Coupon.remove({},(err)=> {
		Coupon.collection.insert(sampleCoupon, (err,docs)=> {});
	});
	Cart.remove({},(err)=> {
		Cart.collection.insert(sampleCart, (err,docs)=> {});
	});
	
}
