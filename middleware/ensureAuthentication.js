
module.exports = function (req, res, next){
    auth = req.isAuthenticated();
    if(!auth){return res.sendStatus(403)};
    next();
}