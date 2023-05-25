const firebaseAdmin = require('../../firebase');

const extractToken = (bearerToken) => {
    const regex = /^(Bearer) (.*)$/g;
    const match = regex.exec(bearerToken);
    if (match && match[2]) {
      return match[2];
    }
    return null;
}



module.exports.isAuth = (strict=false) = async(req,res,next) => {
    try {
        const token = extractToken(req.headers.authorization);
        if(!token) return res.status(401).send({error: "Unauthorized"});

        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
        if(!decodedToken) return res.status(401).send({error: "Unauthorized"});
        req.user = decodedToken;
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message });
    }
}

