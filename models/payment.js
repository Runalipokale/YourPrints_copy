const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Payment = sequelize.define('payment',{
    paymentId:{
        type:Sequelize.INTEGER,
        primaryKey:true,    
        allowNull:false,
        autoIncrement:'true'
    },
    VIA:Sequelize.STRING(50), //Payment method
    Amount:Sequelize.DECIMAL(10,2)   //Amount paid by customer 
});

module.exports=Payment;
