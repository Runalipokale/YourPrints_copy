// importing initial packages 
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookie = require('cookie');
const mySqlStore = require('express-mysql-session')(session);
const passport = require('passport');

const {initializingPassport} = require('../controller/authController');
//importing database ORM
const sequelize = require('../utils/database')

//models
const User = require('../models/user');
const Admin = require('../models/admin');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const OrderItem = require('../models/order-item');
const CartItem = require('../models/order-item');
const WishlistItem = require('../models/wishlist-item');
const Wishlist = require('../models/wishlist');

const app = express();
const store =  new mySqlStore({

},sequelize);

// //controllers
const adminController = require('../controller/adminController');
const shopController = require('../controller/shopController');
const authController = require('../controller/authController');

//receving static files 
app.use(express.static('views'));
app.use(express.static('Public'));
app.use(express.static('Assets'));

//using ejs templating engine 
app.set('view engine','ejs');
app.set('views','views');

//passing body request 
//extended: true => give ability to take object within object 
app.use(bodyParser.urlencoded({extended:true})) 

//using express-session for saving user data at browser
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store // Pass your store instance here
}));

initializingPassport(passport);

app.use(passport.initialize());
app.use(passport.session());


//importing admin and shop module
const adminRoutes = require('../router/admin');
const shopRoutes = require('../router/shop');
const authRoutes = require('../router/auth');

app.use(adminRoutes); // for use admin.js data in this module
app.use(shopRoutes); // for use shop.js data in this module
app.use(authRoutes);




//entity relations
// Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'});
// Product.belongsTo(Wishlist,{constraints:true,onDelete:'CASCADE'});
User.hasOne(Cart);
User.hasOne(Wishlist);
Cart.belongsTo(User);
// Wishlist.hasMany(Product);
// Cart.hasMany(Product);
// Admin.hasMany(Product);
Cart.belongsToMany(Product,{through:CartItem});
Product.belongsToMany(Cart,{through:CartItem});
Order.belongsToMany(Product,{through:OrderItem});


sequelize
.sync({force:false})
.then(result=>{
    console.log('database connected successfully!');
    app.listen(3000,()=>{
        console.log("Server is running on 3000");
    });
})
// .then(cart=>{

// })
// .then()
// .catch(err=>console.log(err)
// .sync({force:true})
// .then(result=>{
//  return User.findByPk(1);
// }) 
// .then(user=>{
//     if(!user){
//         return User.create({username:'Runali',email:'runali@gmail.com'});
//     }
//     return user;  
// })
// .then(user=>{
//     return user.createCart();
// })   
// .then(cart=>{
//     app.listen(3000);
// })
// .catch(err=>{
//     console.log(err);
// });
    
