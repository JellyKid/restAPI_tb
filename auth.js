var passport = require('passport'),
    fixtures = require('./fixtures'),
    _ = require('lodash'),
    LocalStrategy = require('passport-local').Strategy
    db = require('./db'),
    User = db.model('User');
 
 
passport.serializeUser(function(user,done){
    done(null, user.id);
});


passport.deserializeUser(function(id,done){
    User.findOne({id: id}, function(err, user){
        if(err){return err};
        done(null, user ? user : false);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done){
        User.findOne({id: username}, function(err, user){
            if(err){return done(err)};
            if(user){
                if(user.password === password){
                    return done(null, user);
                };
                return done(null, false, {message: 'Incorrect password.'});
            }
            return done(null, false, {message: "Incorrect username."});
        });
 }));

module.exports = passport;