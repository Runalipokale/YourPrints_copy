const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Cart = sequelize.define('cart',{
    productId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    productTitle:{
        type:Sequelize.STRING,
        allowNull:false
    },
    quantity:Sequelize.INTEGER,
    size:{
        type:Sequelize.STRING(3),
        allowNull:false
    },
    productPrice:{
        type:Sequelize.INTEGER,
        allowNull:false,  
    },
    productImg:{
        type:Sequelize.STRING,
        allowNull:false
    }, 
    productDescription:{
        type:Sequelize.STRING(200),
        allowNull:false
    },
    productsTotal:{
       type:Sequelize.INTEGER,
    },
    GST:{
       type:Sequelize.INTEGER,
    },
    Total:{
        type:Sequelize.INTEGER,
    }
})

module.exports=Cart;