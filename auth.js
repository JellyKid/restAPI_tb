var passport = require('passport')
,   fixtures = require('./fixtures')
,   _ = require('lodash')
,   LocalStrategy = require('passport-local').Strategy;
 
 
passport.serializeUser(function(user,done){
    done(null, user.id);
});
 
passport.deserializeUser(function(id,done){
    var user = _.find(fixtures.users,function(user){
        return user.id === id
    });
    
    user ? done(null, user) : done(null, false);
    
});


passport.use(new LocalStrategy(
    function(username, password, done){
        var user = _.find(fixtures.users,'id',username);
        
        if (user){
            return user.password === password ? done(null, user) : done(null, false, {message: 'Incorrect password.'});
        }
        
        done(null, false, {message: "Incorrect username."});
 }));

module.exports = passport;