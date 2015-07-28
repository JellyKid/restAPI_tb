var express = require('express'),
    router = express.Router(),
    User = require('../../db').model('User'),
    passport = require('../../auth'),
    ensureAuthentication = require('../../middleware/ensureAuthentication');

router.post('/login',authenticate);
router.post('/logout',ensureAuthentication, logOutUser);

function authenticate(req, res){
    passport.authenticate('local', function(err, user, info){
        if(err){
            return res.sendStatus(500)};
        if(user){
            return req.login(user,function(err){
                res.send({user: user.toClient()});
            })
        };
        res.sendStatus(403);
    })(req,res);
};

function logOutUser(req, res){
    req.logout();
    return res.sendStatus(200);
}

module.exports = router;