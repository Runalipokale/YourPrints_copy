const Product = require('../models/product');
const Wishlist = require('../models/wishlist');
const User = require('../models/user');
const Cart = require('../models/cart');

exports.getIndex = (req,res,next)=>{
  Product.findAll()
  .then(products=>{
    res.render('index', {
        path: '/',
        pageTitle: 'Home',
        prods:products
    });
  })
  }

//product-page
exports.getProducts = (req,res,next) =>{
  Product.findAll()
  .then(products => {
      res.render('product',{
        prods:products,
        path:'/product',
        pageTitle:'All Products' 
      })
  })
  .catch(err=>console.log(err))
}

//gender vice product showcase
exports.postProductViaGender = (req,res,next) =>{
  const gen = req.body.gender;
  console.log(req.body);
  Product.findAll({where:{gender:gen}})
  .then(products => {
    res.render('product',{
      prods:products,
      path:'/product/gender',
      pageTitle:gen+''+'Products'
    })
  })
  .catch(err=>console.log(err))
}

//categories vice product showcase
//hoodie
exports.postProductCategory =(req,res,next)=>{
   const category = req.body.type;
   console.log(req.body);
   Product.findAll({where:{type:category}})
   .then(products => {
    res.render('product',{
      prods:products,
      path:'/product/category',
      pageTitle:category 
    })
  })
  .catch(err=>console.log(err))
}

//select size of the product 
// exports.postSizeSelect=(req,res,next)=> {
//     const size = req.body.size;


// }
//getwishlist
exports.getWishlist =(req,res,next)=>{
    Wishlist.findAll()
    .then(wishlist=>{
        res.render('wishlist',{
            pageTitle:'shopping list',
            path:'/wishlist',
            list:wishlist,
     })
 })

}

//postwishlist
exports.postWishlist = (req, res, next) => {
  const prodId= req.body.productId;
  const title = req.body.title;
  const  price = req.body.price;
  const  imageUrl = req.body.imageUrl;
  const description = req.body.description;

console.log(req.body)

  // condition for checking if product is alredy present in wishlist
  Wishlist.findOne({ where: { productId: prodId } })
  .then(existingProduct=>{
    if(existingProduct){
      res.send("Product alredy exist in wishlist!!!")
      res.redirect('/products');
    }
  })
  

  // if product is not present then create new product 
  return Wishlist.create({
    productId: prodId,
    productTitle: title,
    productPrice: price,
    productDescription: description,
    productImg: imageUrl,
  })

  .then(result => {
    console.log("Added to wishlist:", result);
    res.redirect('/wishlist');
  })
  .catch(err => {
    console.error(err);
    res.send("Internal Server Error");
  });
}

exports.postRemoveWishlistItem=(req,res,next)=>{
  const prodId = req.body.productId;
  console.log(req.body);
  Wishlist.destroy({where:{productId:prodId}})
  .then('wishlist',{
     path:'/removeWishlist'
  })
  .then(result=>{
     res.redirect('/wishlist')
  })
  .catch(err=>console.log(err))
}


// view product detail 
exports.getProduct = (req,res,next)=>{
    const prodId= req.params.productId
    Product.findByPk(prodId)
      .then(product => {
      res.render('product-detail', {
        prod:product,
        pageTitle: 'products',
        path: '/products'
      })
    })
    .catch(err => console.log(err))
      
}

//cart 
exports.getCart =(req,res,next)=>{
    Cart.findAll()
    .then(carts=>{ 
      res.render('cart',{
         pageTitle:'Shopping Bag',
         path: "/cart",
         cart:carts
      })
    })
    .catch(err=> console.log(err));
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  let quantity=1;
  let productsTotal;
  let GST;
  let total;

  // Check if the product already exists in the cart
  Cart.findOne({ where: { productId: prodId } })
      .then(existingProduct => {
          if (existingProduct) {
              // If the product exists, update the quantity
              existingProduct.quantity += 1; // Increase quantity by 1
              return existingProduct.save();
          } else {
              // If the product does not exist, create a new entry in the cart
              return Cart.create({
                  productId: prodId, // Correct field name
                  productTitle: title,
                  productImg: imageUrl,
                  productPrice: price,
                  productDescription: description,
                  size: 'S', // Assuming size is a fixed value
                  quantity: quantity,// Initial quantity for a new product
                  productsTotal: price* quantity,
                  GST : Math.round(0.18*productsTotal),
                  total: productsTotal+GST
              });
          }
      })
      .then(() => {
        // Calculate total cost of all products in the cart
        return Cart.sum('productsTotal', { where: {} });
    })
    .then(productsTotal => {
        // Calculate GST (18%)
        const GST = Math.round(0.15 * productsTotal);
        // Calculate total amount user has to pay
        const total = productsTotal + GST;
    })
      .then(result => {
          console.log("Product added to cart:", result);
          res.redirect('/cart');
      })
      .catch(err => {
          console.error("Error adding product to cart:", err);
          res.status(500).send("Internal Server Error");
      });
}

exports.postRemoveCartItem=(req,res,next)=>{
  const prodId = req.body.productId;
  Cart.destroy({where:{productId:prodId}})
  .then('cart',{
     path:'/remove'
  })
  .then(result=>{
     res.redirect('/cart')
  })
  .catch(err=>console.log(err))
}


//search functionality
exports.postSearchProducts = async (req, res, next) => {
  try {
      const searchItem = req.query.Item;
      console.log(searchItem);

      // Find all products matching the search query
      const searchResults = await Product.findAll({ where: { title: searchItem } });

      if (searchResults.length === 0) {
          // If no products found, send a message
          res.render('/', { message: 'Product Not Found', path: '/searchProducts' });
      } else {
          // If products found, render the product page with search results
          res.render('/product', { prods: searchResults, path: '/searchProducts' });
      }
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
};

//customise
exports.getCustomise=(req,res,next)=>{
     res.render('customise',{
        pageTitle:'customise',
        path:'/cutomise'
     }) 
}


//payment page
exports.getCheckout=(req,res,next)=>{
   res.render('checkout',{
      path:'/checkout',
      pageTitle:'checkout'
   })
}


//user orders history
// exports.getOrderHistory= (req,res,next)=>{
    
// }





// user query sending via email to admin 
exports.getContact=(req,res,next)=>{
  res.render('contact',{
      pageTitle:'contact us',
      path:'/contact'
  }) 
}

// exports.postContact=(req,res,next)=>{
//    let message= erq.body.message;

// }