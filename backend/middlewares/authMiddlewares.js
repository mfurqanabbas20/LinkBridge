const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    
    const {token} = req.headers;
    
    if(!token){
        return res.status(401).json({message: 'Not Authorize User'})
    }
    
    try {
        const decode_token = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decode_token.id        
        next()
        
    } catch (error) {
        console.log(error); 
        res.status(500).json('Error Occured')   
    }
}

module.exports =  {authMiddleware}