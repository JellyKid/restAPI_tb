var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy
    db = require('./db'),
    User = db.model('User'),
    bcrypt = require('bcryptjs');
 
 
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
                bcrypt.compare(password,user.password,function(err,same){
                    if(same){
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'Incorrect password.'});
                    }
                })
            } else {
                return done(null, false, {message: "Incorrect username."});
            }
            
        });
 }));

module.exports = passport;