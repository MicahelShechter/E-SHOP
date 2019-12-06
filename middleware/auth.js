const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    console.log(req.header("x-auth-token"));
    const token = req.header('x-auth-token');
    // check if not token
    if (!token){
        console.log(`no token`);
        return res.status(401).json({ msg: "no token,authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, 'R3XyOp');
        console.log(`the decoded user ${decoded.user.id}`);
        req.user = decoded.user.id;
        // console.log(`req.user =${req.user}`);
        next();
    } catch (error) {
        console.log(error) ;
        res.status(401).json({ msg: "token is not valid" });
    }
};
