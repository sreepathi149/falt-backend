const jwt = require('jsonwebtoken')

const authenticateUser = (req, res, next) => {
    let token = req.headers['authorization']
    if(token) {
        token = token.split(' ')[1]
        try {
            const tokenData = jwt.verify(token, process.env.JWT_SECRET)
            req.user = {
                id: tokenData.id,
                role: tokenData.role,
                company: tokenData.company
            }
            next()
        } catch(e) {
            res.status(401).json({error: "invalid token"})
        }
    } else {
        res.status(401).json({
            error: "token not found"
        })
    }
}   

module.exports = authenticateUser