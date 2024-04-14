
const express = require('express');

const shopController = require('../controller/shopController');

const router = express.Router();

router.get('/',shopController.getIndex);

router.get('/product',shopController.getProducts);

//product details
router.get('/products/:productId',shopController.getProduct);

//edit size 

//wishlist
router.get('/wishlist',shopController.getWishlist);

router.post('/wishlist',shopController.postWishlist);

router.get('/contact',shopController.getContact);

router.get('/cart',shopController.getCart);

router.post('/cart',shopController.postCart);

router.post('/product/gender',shopController.postProductViaGender)

router.post('/product/category',shopController.postProductCategory);

router.get('/customise',shopController.getCustomise);
//searching functionality 
router.post("/searchProducts",shopController.postSearchProducts);

// router.post('/searchProducts',shopController.postSearchProducts);

//postcontactpage for sending query to admin email

//payment gateway
router.get('/checkout',shopController.getCheckout);

router.post('/remove',shopController.postRemoveCartItem);

router.post('/removeWishlist',shopController.postRemoveWishlistItem);
module.exports = router;