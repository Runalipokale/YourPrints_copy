const express = require('express');

const router = express.Router();

const adminController = require('../controller/adminController');

router.get('/admin/profile',adminController.getAdminProfile);

router.get('/admin/adminpannel',adminController.getAdminPannel);

router.get('/admin/products',adminController.getAllProducts);

router.post('/admin/deleteProduct',adminController.postDeleteProduct);

router.get('/admin/addProduct',adminController.getAddProduct);

router.post('/admin/product',adminController.postAddProduct);

router.get('/admin/editProduct/:productId',adminController.getEditProduct);

router.post('/admin/editProduct/:productId',adminController.postEditProduct);

router.get('/admin/orders',adminController.getOrders);

router.get('/admin/payments',adminController.getPayment);

module.exports = router;