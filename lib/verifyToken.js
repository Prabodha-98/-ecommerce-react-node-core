const jwt = require('jsonwebtoken');

// Verify only the token
const verifyToken = ( req, res, next ) => {

    const authHeader = req.headers.authorization;
    if(authHeader)
    {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err,user) => {
            if(err) res.status(403).json('Token is not valid!');
            else{
                req.user = user;
                next();
            }
        });
    }
    else return res.status(401).json('You are not authentificated !');
};

// Verify the token and ( if the user connected or admin )
const verifyTokenAndAuthorizationOrAdmin = (req, res, next ) => {

    verifyToken(req, res, ()=>{
        if(req.user.id === req.params.id || req.user.isAdmin) next();
        else res.status(403).json('You are not alowed to do that!');
    });

};

// Verify token and if user is admin
const verifyTokenAndAdmin = ( req, res, next ) => {
    
    verifyToken(req, res, ()=>{
        if(req.user.isAdmin) next();
        else res.status(403).json('You are not alowed to do that!');
    });

};

module.exports = { verifyToken, verifyTokenAndAuthorizationOrAdmin, verifyTokenAndAdmin };