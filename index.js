const express = require('express')
const app = express()
const PORT = 3000

const { connectiondatabase, db } = require('./utils/db')
const User = require('./models/User.model')

app.use(express.json())
app.use('/api/auth', require('./routes/authRoutes'))

const start = async () => {
    await connectiondatabase()
    await db.sync()
    app.listen(PORT, () => console.log("server is running on port " + PORT))
}
start()

