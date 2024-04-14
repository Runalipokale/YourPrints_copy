const Sequelize = require('sequelize');

// for database connection through sequelize
const sequelize = require('../utils/database');

const User = sequelize.define('user', {
     userId:{
        type: Sequelize.INTEGER ,
        autoIncrement : true ,
        allowNull: false ,
        primaryKey: true
      },
      username:Sequelize.STRING,
      email:Sequelize.STRING,
      phoneNumber:{
      type:Sequelize.INTEGER(10),
      allowNull:false,
      },
      address:{
       type:Sequelize.STRING,
       allowNull:false,
      },
      password:{
        type:Sequelize.STRING,
        allowNull:false,
      }
});

module.exports = User;
