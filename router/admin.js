import express from 'express';

const router = express.Router();

import * as adminController from '../controller/adminController.js';

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

export default router;