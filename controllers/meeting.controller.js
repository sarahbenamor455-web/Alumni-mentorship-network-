const MeetingNote = require('../models/meetingNote.model')

const addMeetingNote = async (req, res) => {
    try {
        const content = req.body;
        if (typeof content !== 'string' || !content.trim()) {
            return res.status(400).json({
                message: 'Content is required'
            }) 
        }
        const note = await MeetingNote.create({
            connectionId: req.connection.id,
            authorId: Number(req.user.id),
            content: content.trim()
        })
        res.status(201).json({
            message: 'Note added successfully',
            note
        })
    } catch (error) {
        console.log("error :",error.message)
    }
}
const getMeetingNotes = async (req, res) => {
    try {
        const notes = await MeetingNote.findAll({
            where: { connectionId: req.connection.id }
        })
        return res.status(200).json(notes);
    } catch (error) {
        console.log("error :",error.message)
    }
}
const deleteMeetingNote = async (req, res) => {
    try {
        const noteId = Number(req.params.noteId);
        const note = await MeetingNote.findOne({
            where: {
                id: noteId,
                connectionId: req.connection.id
            }})
            if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        await note.destroy();
        return res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.log("error :",error.message)
    }
}

module.exports={addMeetingNote,getMeetingNotes,deleteMeetingNote}