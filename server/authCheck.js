const jwt = require("jsonwebtoken");
const { User } = require("./db.mdels");

async function auth(req, res, next) {
    try {
        const token = req.headers.token;
        if (!token) {
            res.json({
                msg: "token must be provide"
            })
            return;
        }
        const veryfyToken = jwt.verify(token, process.env.JWT_SECRET);
        const response = await User.findOne({ userName: veryfyToken.userName });
        req.userId = response._id;
    } catch (e) {
        console.error(e.message);
        res.json({
            error: e.message
        })
        return;
    }
    next();





}

module.exports = auth;