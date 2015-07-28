var express = require('express'),
    router = express.Router(),
    Tweet = require('../../db').model('Tweet'),
    ensureAuthentication = require('../../middleware/ensureAuthentication');

router.get('/', handleTweets);
router.get('/:tweetId', getTweet);
router.post('/', ensureAuthentication, addTweet);
router.delete('/:tweetId',ensureAuthentication, deleteTweet);


function handleTweets(req,res){
    var stream = req.query.stream;
    var userId = req.query.userId;
    if(!stream){
        return res.sendStatus(400);
    }
    
    switch (stream) {
        case "profile_timeline":
            if(!userId){return res.sendStatus(400);}
            Tweet.findByUserId(userId,function(err, tweets){
                if(!tweets){return res.sendStatus(400)}
                var formatted = tweets.map(function(tweet){return tweet.toClient()})
                return res.send({tweets: formatted})
            });
            break;
        case "home_timeline":
            user = req.user;
            if(!user){return res.sendStatus(400)};
            Tweet.getFriendsTweets(user.followingIds, function(err, tweets){
                if(err){return res.sendStatus(500)};
                var formatted = tweets.map(function(tweet){return tweet.toClient()});
                return res.send({tweets: formatted})
            })
            break;
    }    
}

function getTweet(req,res){
    Tweet.findById(req.params.tweetId,function(err,tweet){
        if(err){return err};
        return tweet ? res.send({tweet: tweet.toClient()}) : res.sendStatus(404);
    });
};

function addTweet(req,res){
    
    date = new Date();
    
    var tweet = new Tweet({
        userId: req.user.id,
        created: date.getTime()/1000|0,
        text: req.body.tweet.text
    });
    
    tweet.save(function(err){
        if(err){return err};
    })
    
    res.send({tweet: tweet.toClient()})   
}

function deleteTweet(req, res){
    
    Tweet.findById(req.params.tweetId,function(err,tweet){
        
        if(tweet){
            if(tweet.userId == req.user.id){
                tweet.remove(function(err){
                    if(err){res.sendStatus(500)};
                });
                return res.sendStatus(200);
            };
            return res.sendStatus(403);
        };
        return res.sendStatus(404);
    });
    
};

module.exports = router;