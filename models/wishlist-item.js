const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const WishlistItem = sequelize.define('wishlistItem',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
})

module.exports=WishlistItem;