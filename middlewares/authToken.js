const config    = require('config');
const jwt       = require('jsonwebtoken');

let tokenVerification = (req,res,next) => {
    
    let token = req.get('Auth');
    jwt.verify(token,config.get('configToken.SEED'),(err,decod) => {
        if(err){
            return res.status(401).json({
                err
            });
        }else{
            req.user = decod;
            next();
        }
    });
}
module.exports = tokenVerification;
