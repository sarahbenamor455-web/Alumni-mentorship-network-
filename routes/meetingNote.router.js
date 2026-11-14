const express = require('express');
const router = express.Router();
const {addMeetingNote,getMeetingNotes,deleteMeetingNote} = require('../controllers/meeting.controller');
const authenticate = require('../middleware/auth.middelware');
const authConnection = require('../middleware/authorizeConnection.middelware');

router.use(authenticate)
router.post('/:id',authConnection, addMeetingNote)
router.get('/:id', authConnection,getMeetingNotes)
router.delete('/:id/:noteId', authConnection,deleteMeetingNote)

module.exports = router;
