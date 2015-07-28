describe("Testing them gets", function(){
    var request = require('supertest'),
        server = require('../index');
    
    it("Make sure index exported server module", function(done){
        return server ? done(null) : done(new Error("Server did not export"));
    })
    
    it("GET request to your server and expects to receive back status code 404", function(done){
        request(server).get('/api/tweets/55231d90f4d19b49441c9cb9')
            .expect(404,done);
    })
    
})