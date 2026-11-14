const jwt = require('jsonwebtoken');

function authenticate(req, res,next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Token missing'
        });
    }
    const token = header.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid token'
        })
    }
    next()
}

module.exports = authenticate;
