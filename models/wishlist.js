const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Wishlist = sequelize.define('wishlist',{
    productId:{
        type: Sequelize.INTEGER,
        autoIncrement:'true',
        allowNull:false,
        primaryKey:true
    },
    productTitle:Sequelize.STRING,
    productPrice:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    productImg:{
        type:Sequelize.STRING,
        allowNull:false
    },
    productDescription:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports=Wishlist;