var express = require('express'),
    router = express.Router(),
    User = require('../../db').model('User'),
    ensureAuthentication = require('../../middleware/ensureAuthentication');

router.get('/:userId', getUser);
router.post('/', addUser);
router.put('/:userId', ensureAuthentication, changePassword);
router.post('/:userId/follow', ensureAuthentication, followUser);
router.post('/:userId/unfollow', ensureAuthentication, unfollowUser);
router.get('/:userId/friends', ensureAuthentication, getFriends);
router.get('/:userId/followers', getFollowers);

function getFollowers(req, res){
    var userId = req.params.userId;
    User.findOne({id: userId}, function(err, user){
        if(!user){return res.sendStatus(404)};
        
        User.find({followingIds: { $in: [userId]}}, function(err, followers){
            if(!followers){return res.send({"users" : []})};
            var formatted = followers.map(function(follower){return follower.toClient()})
            return res.send({"users" : formatted});
        });
    });    
};

function getFriends(req,res){
    userId = req.params.userId;
    User.findByUserId(userId,function(err, user){
        if(err){
            return res.sendStatus(500);
        }
        if(!user){
            return res.sendStatus(404);
        }
        user.getFriends(function(err,friends){
            var formatted = friends.map(function(user){return user.toClient()})
            return res.send({"users": formatted});
        })
    })
}


function unfollowUser(req, res){
    
    User.findOne({id: req.params.userId},function(err, found){
        if(!found){return res.sendStatus(403)};
        
        User.findOneAndUpdate({id: req.user.id}, {$pull:{followingIds: found.id}}, function(err, user){
            if(err){return err};
            return res.sendStatus(200);
        });
    });
};

function followUser(req, res){
    User.findByUserId(req.params.userId,function(err, found){
        if(!found){return res.sendStatus(403)};
        User.findOneAndUpdate({id: req.user.id}, {$addToSet:{followingIds: found.id}}, function(err, user){
            if(err){return err};
            return res.sendStatus(200);
        });
    });
};

function getUser(req, res){
    User.findOne({id: req.params.userId},function(err,user){
        if(err){return err}
        return user ? res.send({user: user.toClient()}) : res.sendStatus(404);
    });
};

function addUser(req,res){
    var newuser = new User(req.body.user);
    
    newuser.save(function(err, user){
        if(err && err.code === 11000){
            return res.sendStatus(409);
        }
        
        req.login(user, function(err){
            if (err) {return res.sendStatus(500)}
            return res.sendStatus(200)
        })
    })
};

function changePassword(req, res){
    User.findOneAndUpdate({id: req.params.userId},{password: req.body.password},function(err,user){
        if (err){return err};
        return res.sendStatus(user ? 200 : 403);
    })
}

module.exports = router;