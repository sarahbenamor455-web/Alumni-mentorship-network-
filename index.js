require('dotenv').config();
const express=require('express')
const app=express()
const PORT=3000
const db=require('./utils/bd')
const connectionRouter = require('./routes/connection.router')
const meetingNoteRouter = require('./routes/meetingNote.router')

const cors=require('cors')

app.use(cors())
app.use(express.json())
app.use('/api/connections', connectionRouter)
app.use('/api/meeting-notes', meetingNoteRouter)
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Alumni Mentorship Network API'
    })
})
async function startServer() {
    try {
        await db.authenticate();
        console.log('MySQL connected successfully!');

        await db.sync();
        console.log('Database tables synchronized!');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Database connection error:', error.message);
    }
}

startServer()
app.listen(PORT,()  => {
    console.log("this server is running !!!!!");
})