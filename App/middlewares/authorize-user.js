const authorizeUser = (req, res, next) => {
    if(req.permittedRoles.includes(req.user.role)) {
        next()
    } else {
        res.status(403).json({
            error: 'access denied'
        })
    }
}

module.exports = authorizeUser