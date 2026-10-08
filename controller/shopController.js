import { asc, eq, ilike, sql } from 'drizzle-orm';
import { db } from '../db/index.ts';
import { products, wishlistItems, cartItems } from '../db/schema.ts';

export const getIndex = async (req, res, next) => {
  try {
    const prods = await db.select().from(products).orderBy(asc(products.productId));
    res.render('index', {
      path: '/',
      pageTitle: 'Home',
      prods
    });
  } catch (err) {
    next(err);
  }
}

//product-page
export const getProducts = async (req, res, next) => {
  try {
    const prods = await db.select().from(products).orderBy(asc(products.productId));
    res.render('product', {
      prods,
      path: '/product',
      pageTitle: 'All Products'
    });
  } catch (err) {
    next(err);
  }
}

//gender vice product showcase
export const postProductViaGender = async (req, res, next) => {
  try {
    const gen = (req.body.gender || '').trim();
    const prods = await db.select().from(products).where(ilike(products.gender, gen));
    res.render('product', {
      prods,
      path: '/product/gender',
      pageTitle: gen + ' Products'
    });
  } catch (err) {
    next(err);
  }
}

//categories vice product showcase
export const postProductCategory = async (req, res, next) => {
  try {
    const category = (req.body.type || '').trim();
    const prods = await db.select().from(products).where(ilike(products.type, category));
    res.render('product', {
      prods,
      path: '/product/category',
      pageTitle: category
    });
  } catch (err) {
    next(err);
  }
}

//getwishlist
export const getWishlist = async (req, res, next) => {
  try {
    const list = await db.select().from(wishlistItems);
    res.render('wishlist', {
      pageTitle: 'shopping list',
      path: '/wishlist',
      list
    });
  } catch (err) {
    next(err);
  }
}

//postwishlist
export const postWishlist = async (req, res, next) => {
  try {
    const { productId, title, price, imageUrl, description } = req.body;

    // only add the product if it isn't already in the wishlist
    await db.insert(wishlistItems).values({
      productId: Number(productId),
      productTitle: title,
      productPrice: Number(price),
      productDescription: description,
      productImg: imageUrl,
    }).onConflictDoNothing();

    res.redirect('/wishlist');
  } catch (err) {
    next(err);
  }
}

export const postRemoveWishlistItem = async (req, res, next) => {
  try {
    await db.delete(wishlistItems).where(eq(wishlistItems.productId, Number(req.body.productId)));
    res.redirect('/wishlist');
  } catch (err) {
    next(err);
  }
}

// view product detail
export const getProduct = async (req, res, next) => {
  try {
    const prodId = Number(req.params.productId);
    if (!Number.isInteger(prodId)) return next();
    const [prod] = await db.select().from(products).where(eq(products.productId, prodId));
    if (!prod) return next();
    res.render('product-detail', {
      prod,
      pageTitle: 'products',
      path: '/products'
    });
  } catch (err) {
    next(err);
  }
}

//cart
export const getCart = async (req, res, next) => {
  try {
    const cart = await db.select().from(cartItems);
    res.render('cart', {
      pageTitle: 'Shopping Bag',
      path: '/cart',
      cart
    });
  } catch (err) {
    next(err);
  }
}

export const postCart = async (req, res, next) => {
  try {
    const { productId, title, price, imageUrl, description } = req.body;

    // add the product, or increase its quantity by 1 if it's already in the cart
    await db.insert(cartItems).values({
      productId: Number(productId),
      productTitle: title,
      productImg: imageUrl,
      productPrice: Number(price),
      productDescription: description,
      size: 'S',
      quantity: 1,
    }).onConflictDoUpdate({
      target: cartItems.productId,
      set: { quantity: sql`${cartItems.quantity} + 1`, updatedAt: sql`now()` },
    });

    res.redirect('/cart');
  } catch (err) {
    next(err);
  }
}

export const postRemoveCartItem = async (req, res, next) => {
  try {
    await db.delete(cartItems).where(eq(cartItems.productId, Number(req.body.productId)));
    res.redirect('/cart');
  } catch (err) {
    next(err);
  }
}

//search functionality
export const postSearchProducts = async (req, res, next) => {
  try {
    const searchItem = (req.query.Item || req.body.Item || '').trim();
    const prods = searchItem
      ? await db.select().from(products).where(ilike(products.title, `%${searchItem}%`))
      : [];

    res.render('product', {
      prods,
      path: '/searchProducts',
      pageTitle: searchItem ? `Search: ${searchItem}` : 'Search'
    });
  } catch (err) {
    next(err);
  }
};

//customise
export const getCustomise = (req, res, next) => {
  res.render('customise', {
    pageTitle: 'customise',
    path: '/cutomise'
  })
}

//payment page
export const getCheckout = (req, res, next) => {
  res.render('checkout', {
    path: '/checkout',
    pageTitle: 'checkout'
  })
}

// user query sending via email to admin
export const getContact = (req, res, next) => {
  res.render('contact', {
    pageTitle: 'contact us',
    path: '/contact'
  })
}
