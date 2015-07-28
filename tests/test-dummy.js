describe("Simple tests", function(){
    
    it('check if dummy file exists', function(done){
        var fs = require('fs');
        
        fs.exists('dummy',function(exists){
            return exists ? done(null) : done(new Error("File doesn't exist"));
        })
    })
    
})