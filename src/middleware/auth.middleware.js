const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
    const token = req.cookies ? req.cookies.token : null;

    if (!token) {
        return res.status(401).json({ message: "unauthorized access" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Error verifying token:', err);
        return res.status(401).json({ message: "unauthorized invalid token" });
    }
};



module.exports = { authUser };