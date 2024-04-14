const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Admin = sequelize.define('admin',{
    adminId:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    email:Sequelize.STRING,

    password:{
       type:Sequelize.STRING,
       allowNull:false,
       unique:true
    }


})

module.exports = Admin;