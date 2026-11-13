const { DataTypes } = require('sequelize')
const {Database}=require('sequelize')
const{db}=require('../utils/db')

const user=db.define("users",{
    firstname:{
        type:DataTypes.STRING,
        allowNull:false
    },
    lastname:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    date_of_graduation:{
        type:DataTypes.DATETIME,
        allowNull:false,
    },
    profilepic: {
    type: DataType,TEXT,
    allowNull: true,
    defaultValue: null, 
    },
    role:{
        type:DataTypes.ENUM("student","alumni"),
        defaultValue:'student',
        allowNull:false
    },
    isVerified:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
})
module.exports=user