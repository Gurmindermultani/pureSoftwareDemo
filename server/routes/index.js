var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = require('mongoose').Types.ObjectId; 
var Product = mongoose.model('Product');
var Cart = mongoose.model('Cart');
var Coupon = mongoose.model('Coupon');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET PRODUCTS */
router.get('/products', function(req, res, next){
	Product.find({},(err,docs)=>{
		//Lets assume its a perfect world
		//where nothing ever goes wrong.
		res.send(docs);
	})
});


/* Add ITEM to cart 
   We can have multiple endpoints for
   adding, updating and removing items
   here we will make do with a single endpoint
   to keep things simple

   Plus use the same gall to GET cart items
   as this simply return the cart
*/
router.post('/cart/update', function(req,res,next){

	//Check if there is any coupon applied
	var couponCodeForUser = req.body.couponCode;
	var cartForDb = { items : []};
	var cartFromUser = req.body.items;

	var total = 0;

	var promiseArray = []
	//Cross check and update 
	// in db
	cartFromUser.forEach((item) => {
	
		//Get the price from db		
		var quantity = item.quantity;
		var promise = Product.findOne({_id : new ObjectId(item._id)}).then((product) => {
			var p = product.toJSON();
			total += quantity * p.price;
			item = p;
			item.quantity = quantity;
			cartForDb.items.push(item);
		})

		promiseArray.push(promise);

	})	

	Promise.all(promiseArray).then(function(){

		cartForDb.total = total;
		cartForDb.userId = 123456;
		//Remove existing cart for current user and update new once
		Cart.remove({userId: 123456}, (err) => {});
		
		//apply coupon now!! YAY DISCOUNT
		if(couponCodeForUser)
			cartForDb = applyCoupon(cartForDb,couponCodeForUser );

		//Save new cart to db and send a response back to user
		var cart = new Cart(cartForDb);
		cart.save(function(err, cart){
			res.send(cart)
		})
	})
})

/* Apply coupon on CART */
router.post('/cart/apply-coupon',function(req,res,next){
	var userCode = req.body.couponCode;
	var validCoupon;
	//First things first
	// Check if this is a valid coupon

	Coupon.findOne({couponCode: userCode}, (err,coupon)=> {
		if( coupon== null || !coupon ||  coupon.length == 0 ){
			res.send("Invalid coupon, such sadness");
		}
		else{
			validCoupon = coupon.toJSON();
			//Get the cart of the user on which coupon has to be applied
			Cart.findOne({userId: 123456}, function(err,cart){
				var userCart = cart.toJSON();
				applyCoupon(userCart, validCoupon);
				//Update Cart In Db
				Cart.update({
					couponCode: userCart.couponCode ,
					discount: userCart.discount,
					amountPayable: userCart.amountPayable
				}).then(function(cart){
					Cart.findOne({userId: 123456}, function(err,cart){
						res.send(cart)
					})
				})
			})
		}
		
	})	

})

//Function to handle different type of coupons
// This will not update to db that need to be done by the calling function
function applyCoupon (cart, coupon){
	cart.couponCode = coupon.couponCode;
	switch(coupon.couponType){
		case 'B2G1' : 
			//apply buy 2 get one
			applyB2G1(cart);
			break;
		case 'B1G1' :
			//apply buy 1 get one
			break;
		default: 
			//Return cart as such
			return cart;
	}
}


function applyB2G1(cart){
	var totalDiscount = 0;
	cart.items.forEach((item)=> {
		var freeItems = 0;
		freeItems = Math.floor(item.quantity / 3);
		totalDiscount += item.price * freeItems;
	})
	cart.discount = totalDiscount;
	cart.amountPayable = cart.total - cart.discount;
}

module.exports = router;
