const Connection=require('../models/connection.model')

const sendConnection = async (req, res) => {
    try {
        const studentId = Number(req.Connection.id)
        const alumniId = Number(req.body)
        if (req.Connection.role !== 'student') {
            return res.status(403).json({
                message: 'Only students can send requests'
            });
        }
        if (!Number.isInteger(alumniId) || alumniId <= 0) {
            return res.status(400).json({
                message: 'Invalid alumni ID'
            });
        }
        const alumni = await Connection.findOne({
            where: {
                id: alumniId,
                role: 'alumni'
            }
        })
        if(! alumni){
            return res.status(404).json({
                message: 'Alumni not found'
            })
        }
        const existing = await Connection.findOne({
            where: {
                studentId,
                alumniId: Number(alumniId)
            }
        })
        if (existing) {
            return res.status(409).json({
                message: 'Request already exists'
            })
        }
        const connection = await Connection.create({
            studentId,
            alumniId,
            status: 'pending'
        });

        return res.status(201).json({
            message: 'Connection request sent successfully',
            connection
        })
        }
        catch(error){
            console.log("error :",error.message)
        }
}
const acpref = async (req, res) => {
    try {
        const connectionId = Number(req.params.id)
        const status = req.body
        if (req.user.role !== 'alumni') {
            return res.status(403).json({
                message: 'Only alumni can respond'
            })
        }
        if (!Number.isInteger(connectionId) || connectionId <= 0) {
            return res.status(400).json({
                message: 'Invalid connection ID'
            });
        }
        if (!['Accepted', 'Rejected'].includes(status)) {
            return res.status(400).json({
                message: 'Invalid status'
            })
        }
        const connection = await Connection.findOne({
            where: {
                id: connectionId,
                alumniId: Number(req.user.id),
                status: 'Pending'
            }
        })
        if (!connection) {
            return res.status(404).json({
                message: 'Pending request not found'
            });
        }
        connection.status = status;
        await connection.save();

        return res.status(200).json({
            message: `Request ${status}`,
            connection
        })
    } catch (error) {
        console.error('Accept connection error:', error);
        return res.status(500).json({
            message: error.message })
    }
}
module.exports = {sendConnection,acpref};