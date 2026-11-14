const Connection = require('../models/connection.model')

async function authConnection(req, res,next) {
    try {
        const connectionId = Number(req.params.id)
        if (!connectionId || !Number.isInteger(connectionId)) {
            return res.status(400).json({
                message: 'Invalid connection ID'
            });
        }
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: 'User not authenticated'
            });
        }

        const connection = await Connection.findOne({
            where: {
                id: connectionId,
                status: 'Accepted'
            }
        });
        if (!connection) {
            return res.status(404).json({
                message: 'Accepted connection not found'
            });
        }
        const userId = Number(req.user.id);
        if (
            Number(connection.studentId) !== userId &&
            Number(connection.alumniId) !== userId
        ) {
            return res.status(403).json({
                message: 'You are not authorized'
            });
        }
        req.connection = connection
        next()
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = authConnection;