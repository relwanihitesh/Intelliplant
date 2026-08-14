
const authAdmin = (req, res, next) => {
    if(req.user.role !== "admin"){
        return res.status(403).json({ message: "forbidden access" });
    }
    next();
}

module.exports = { authAdmin };