const jwt = require("jsonwebtoken");
const { User } = require("./db.mdels");

async function auth(req, res, next) {
    const authHead = req.headers.authorization;
    if (!authHead || !authHead.startsWith("Bearer ")) {
        return res.json({
            status: false,
            msg: "authorization token not found"
        });
    }

    const token = authHead.split(" ")[1];
    try {


        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userData = await User.findOne({ email: decoded.email })
        req.userId = userData._id;
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ msg: "Invalid token" });
    }






}

module.exports = auth;