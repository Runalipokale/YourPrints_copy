const Product = require('../models/product');
const Order = require('../models/order');
const Admin = require('../models/admin');
const Payment = require('../models/payment');

exports.getAdminProfile =(req,res,next)=>{
    Admin.findAll()
    .then(admin=>{
        res.render('adminProfile',{
            path:'/admin/profile',
            pageTitle:'Admin profile',
            admins:admin
        })
    })
    .catch(err=>console.log(err));
}

//admin pannel
exports.getAdminPannel = (req,res,next)=>{
    //condition if user == admin then => show admin pannel else render index page
    res.render('admin',{
        path:'/admin/adminpannel',
        pageTitle:'Admin Pannel'
    })
}

//all products
exports.getAllProducts =(req,res,next)=>{
    Product.findAll()
    .then(products =>{
        res.render('adminproducts',{
            prods:products,
            path:'/admin/products',
            pageTitle:'All Products'
        })
    })
    .catch(err=> console.log(err))
}


//delete product
exports.postDeleteProduct = (req, res, next) => {
    const prodID = req.body.productId;

    Product.destroy({ where :{ productId: prodID } })
        .then(products=>{
            res.render('adminproducts',{
                path:'/admin/deleteProduct',
                pageTitle:'All Products',
                prods:products
            })
        })
        .then(result => {
            res.redirect('/admin/products');
            // check the result object to see the number of deleted rows
            console.log(`${result} product(s) deleted`);

        })
        .catch(err => {
            console.error("Error deleting product:", err);
        });
};

//add product 
exports.getAddProduct=(req,res,next)=>{
    res.render('addProduct',{
         pageTitle:'Add Product',
         path:'/admin/addProduct',
    })
    next();
}

exports.postAddProduct =(req,res,next)=>{
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const prodId = req.body.productId;
   
    req.body
    Product.create({
            title :title,
            price : price,
            imageUrl : imageUrl,
            description : description,
            productId: prodId,
        
    })
    .then(result=>{
        console.log("Product created!!!",result);
            res.redirect('/admin/products')
            console.log(req.body);
        })
        .catch(err => {
        console.error("Error creating product:", err);
    });
    
}

//update product 
exports.getEditProduct = (req,res,next)=>{

const prodId = req.params.productId;
  Product.findAll({where:{id:prodId}})
  .then(product=>{
    res.render('edit-product',{
        path:'/admin/editProduct/:productId',
        pageTitle:'update Product',
        prods:Product,
      //   editing:editMode,
    })
  })
}

exports.postEditProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
  
    Product.findByPk(prodId)
    .then(product=>{
      product.title=updatedTitle;
      product.price=updatedPrice;
      product.imageUrl=updatedImageUrl;
      product.description = updatedDesc;
      return product.save(); 
    })
    .then(result =>{
      console.log("Product updated!!");
      res.redirect("/admin/products");
    })
    .catch(err =>console.log(err));
}

//all orders
exports.getOrders=(req,res,next)=>{
    Order.findAll()
    .then(orders=>{
         res.render('order',{
            pageTitle:'All Orders',
            order:orders,
            path:'/admin/orders'
         })
    })
}

exports.getPayment=(req,res,next)=>{
    res.render('payment',{
        path:'/admin/payments',
        pageTitle:'Transactions',
        payment:payments
    })
}

