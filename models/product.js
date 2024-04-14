const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Product = sequelize.define('product',{
    productId:{
        type: Sequelize.INTEGER,
        autoIncrement:'true',
        allowNull:false,
        primaryKey:true
    },
    title:Sequelize.STRING,
    price:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    imageUrl:{
        type:Sequelize.STRING,
        allowNull:false
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false
    },
    gender:{
        type:Sequelize.ENUM,
        values:['Male','Female'],
    },
    type:{
        type:Sequelize.ENUM,
        values:['Hoodie','T-shirt','Sweatshirt','Oversized T-shirt','Crop T-shirt']
    }
})
module.exports=Product;