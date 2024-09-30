const jwt = require("jsonwebtoken");

module.exports.isAuth = async (req, res, next) => {
    const bearerToken = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!bearerToken) {
        return res.status(401).send({ message: "Access Denied" });
    }
    
    try {
        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send({ message: "Invalid token" });
    }
}
