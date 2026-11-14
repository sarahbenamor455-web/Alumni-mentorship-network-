const { DataTypes } = require('sequelize')
const db = require('../utils/bd')

const MeetingNote = db.define('MeetingNote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  connectionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {notEmpty: true}
  }
})

module.exports = MeetingNote;