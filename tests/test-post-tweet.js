describe("Testing tweet posting", function(){
    var server = require('../index'),
        mongoose = require('mongoose'),
        dbhost = '127.0.0.1',
        dbname = 'twittertest',
        dbport = 27017;
    
    var Session = require('supertest-session')({
        app: require('../index.js')
    });
    
    var session = new Session();
    
    before(function(done){
        var connection = mongoose.createConnection(dbhost, dbname, dbport);
        connection.on('connected',function(){
            this.db.dropDatabase(function(err){
                return done(err);
            }
        )});
        connection.on('error', function(err){
            if(err){return done(err)}
        })
        
    });

    
    it("unauthenticated user posts a tweet, the route will respond with status code 403", function(done){
        var tweet = { text: "This tweet should fail with 403"}
        session.post('/api/tweets').send({tweet: tweet}).expect(403,done);
    })
    
    it("Create User jellkid and authenticates", function(done){
        var user = {
            id: "JellyKid",
            name: "Jacob Sommerville",
            email: "AnEmail@address.com",
            password: "password123"
            };
        session.post('/api/users').send({user: user}).expect(200,done);
    })
    
    it("Post tweet as authenticated user", function(done){
        var tweet = {text: "This tweet should be submitted with status 200"};
        session.post('/api/tweets').send({tweet: tweet}).expect(200, done);
    })
    
})