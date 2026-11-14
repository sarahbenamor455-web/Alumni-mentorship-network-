const {Sequelize}=require('sequelize')

const db=new Sequelize({
    dialect:'mysql',
    host:'localhost',
    username:'root',
    password:'',
    database:'alumni_mentorship',

})


module.exports=db;