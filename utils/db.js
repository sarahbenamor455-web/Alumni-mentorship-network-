require('dotenv').config()
const { Sequelize } = require('sequelize')

const db = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'alumni_mentorship'   // must match the database you created in MySQL
})

async function connectiondatabase() {
    try {
        await db.authenticate()
        console.log("database connected")
    } catch (err) {
        console.log("error database connection", err.message)
    }
}

module.exports = { db, connectiondatabase }
