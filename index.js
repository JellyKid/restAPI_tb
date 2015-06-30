var express = require('express'),
    fixtures = require('./fixtures'),
    _ = require('lodash'),
    bodyParser = require('body-parser'),
    shortId = require('shortid'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('./auth'),
    config = require('./config'),
    db = require('./db'),
    User = db.model('User'),
    Tweet = db.model('Tweet');

var app = express();

app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());


app.get('/api/users/:userId', handleUsers);
app.post('/api/users', bodyParser.json(), addUser);

app.get('/api/tweets', handleTweets);
app.get('/api/tweets/:tweetId', getTweet);
app.post('/api/tweets', bodyParser.json(), checkAuth, addTweet);
app.delete('/api/tweets/:tweetId',checkAuth, deleteTweet);

app.post('/api/auth/login',authenticate);
app.post('/api/auth/logout',checkAuth, logOutUser);

function addUser(req,res){
    console.log('wtf');
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

function logOutUser(req, res){
    req.logout();
    return res.sendStatus(200);
}

function checkAuth(req, res, next){
    auth = req.isAuthenticated();
    if(!auth){return res.sendStatus(403)};
    next();
}


function authenticate(req, res){
    //console.log(req.body.username,":",req.body.password)
    passport.authenticate('local', function(err, user, info){
        if(err){return res.sendStatus(500)};
        if(user){
            return req.login(user,function(err){
                res.send({user: user});
            })
        };
        res.sendStatus(403);
    })(req,res);
};



function deleteTweet(req, res){
    
    var tweet = _.find(fixtures.tweets,'id',req.params.tweetId);
    
    if(tweet){
        if(tweet.userId != req.user.id){return res.sendStatus(403)};
        _.remove(fixtures.tweets,'id',tweet.id);
        return res.sendStatus(200);
    }
    
    return res.sendStatus(404);
  
}

function addTweet(req,res){
    
    var newtweet = req.body.tweet;
    
    newtweet["userId"] = req.user.id;
    
    newtweet["id"] = shortId.generate();
    
    date = new Date();
    newtweet["created"] = date.getTime()/1000|0;
    
    fixtures.tweets.push(newtweet)
    
    res.send({tweet : newtweet})
    
}

function createUser(req,res){
    var newuser = req.body.user;
    
    if (_.find(fixtures.users,'id',newuser["id"])) {
        return res.sendStatus(409)
    } else {
        newuser["followingIds"] = [];
        fixtures.users.push(newuser);
    }
    
    req.login(newuser, function(err){
        if (err) {return res.sendStatus(500)}
    });
    
    return res.sendStatus(200)
}

function handleTweets(req,res){
    var userId = req.query.userId;
    
    if(!userId){
        return res.sendStatus(400);
    };
    
    var tweets = fixtures.tweets.filter(function(tweet){
        return tweet.userId === userId;
    });
    
    var sortedtweets = tweets.sort(function(t1,t2){return t2.created - t2.created;});
    
    return res.send({
        tweets : sortedtweets
    });
};

function handleUsers(req,res){
    
    var userId = req.params.userId;
    
    var userInfo = fixtures.users[_.findIndex(fixtures.users,function(key){
        return key.id === userId;
    })];
    
    return userInfo ? res.send({user : userInfo}) : res.sendStatus(404);
}

function getTweet(req,res){
    
    var tweet = _.find(fixtures.tweets, 'id', req.params.tweetId)
    
    return tweet ? res.send({tweet : tweet}) : res.sendStatus(404);
}





var server = app.listen(config.get('server:port'), config.get('server:host'));

module.exports = server;