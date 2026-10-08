import { asc, desc, eq } from 'drizzle-orm';
import { db } from '../db/index.ts';
import { products, orders, admins, payments } from '../db/schema.ts';

export const getAdminProfile = async (req, res, next) => {
  try {
    const [admin] = await db.select().from(admins).limit(1);
    res.render('adminProfile', {
      path: '/admin/profile',
      pageTitle: 'Admin profile',
      admins: admin
    });
  } catch (err) {
    next(err);
  }
}

//admin pannel
export const getAdminPannel = (req, res, next) => {
  res.render('admin', {
    path: '/admin/adminpannel',
    pageTitle: 'Admin Pannel'
  })
}

//all products
export const getAllProducts = async (req, res, next) => {
  try {
    const prods = await db.select().from(products).orderBy(asc(products.productId));
    res.render('adminproducts', {
      prods,
      path: '/admin/products',
      pageTitle: 'All Products'
    });
  } catch (err) {
    next(err);
  }
}

//delete product
export const postDeleteProduct = async (req, res, next) => {
  try {
    await db.delete(products).where(eq(products.productId, Number(req.body.productId)));
    res.redirect('/admin/products');
  } catch (err) {
    next(err);
  }
};

//add product
export const getAddProduct = (req, res, next) => {
  res.render('addProduct', {
    pageTitle: 'Add Product',
    path: '/admin/addProduct',
  })
}

export const postAddProduct = async (req, res, next) => {
  try {
    const { title, price, imageUrl, description, gender, category } = req.body;
    await db.insert(products).values({
      title,
      price: Number(price) || 0,
      imageUrl: imageUrl || '',
      description: description || '',
      gender: gender || null,
      type: category || null,
    });
    res.redirect('/admin/products');
  } catch (err) {
    next(err);
  }
}

//update product
export const getEditProduct = async (req, res, next) => {
  try {
    const prodId = Number(req.params.productId);
    if (!Number.isInteger(prodId)) return next();
    const [prod] = await db.select().from(products).where(eq(products.productId, prodId));
    if (!prod) return next();
    res.render('edit-product', {
      path: '/admin/editProduct/:productId',
      pageTitle: 'update Product',
      prods: prod,
    });
  } catch (err) {
    next(err);
  }
}

export const postEditProduct = async (req, res, next) => {
  try {
    const prodId = Number(req.params.productId);
    const { title, price, imageUrl, description } = req.body;

    // only overwrite the fields that were filled in
    const updates = {};
    if (title) updates.title = title;
    if (price) updates.price = Number(price);
    if (imageUrl) updates.imageUrl = imageUrl;
    if (description) updates.description = description;

    if (Object.keys(updates).length > 0) {
      await db.update(products).set({ ...updates, updatedAt: new Date() }).where(eq(products.productId, prodId));
    }
    res.redirect('/admin/products');
  } catch (err) {
    next(err);
  }
}

//all orders
export const getOrders = async (req, res, next) => {
  try {
    const order = await db.select().from(orders).orderBy(desc(orders.createdAt));
    res.render('order', {
      pageTitle: 'All Orders',
      order,
      path: '/admin/orders'
    });
  } catch (err) {
    next(err);
  }
}

export const getPayment = async (req, res, next) => {
  try {
    const payment = await db.select().from(payments).orderBy(desc(payments.createdAt));
    res.render('payment', {
      path: '/admin/payments',
      pageTitle: 'Transactions',
      payment
    });
  } catch (err) {
    next(err);
  }
}
