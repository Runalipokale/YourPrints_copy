const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Order = sequelize.define('order',{
    orderId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    productId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
            model:'products',
            key:'productId'
    }
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
            model:'users',
            key:'userId'
    }
},
    price:Sequelize.INTEGER,
    paymentMode:Sequelize.STRING,
    status:Sequelize.STRING,
    totalAmount:Sequelize.INTEGER,
})

module.exports=Order;