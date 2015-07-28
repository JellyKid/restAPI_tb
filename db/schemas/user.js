var Schema = require('mongoose').Schema,
    bcrypt = require('bcryptjs');
    

var userSchema = new Schema({
    id: {type: String, unique: true},
    name: String,
    email: {type: String, unique: true},
    password: String,
    followingIds:{type:[String], default: []}
});

userSchema.methods.toClient = function(){
    return {
        id: this.get('id'),
        name: this.get('name')
    }
};

userSchema.statics.findByUserId = function(id, done){
    this.findOne({id: id}, done)
}

userSchema.methods.follow = function(userId, done){
    var update = {$addToSet: { followingIds: userId}}
    this.model('user').findByIdAndUpdate(this._id, update, done)
}

userSchema.methods.getFriends = function(done){
    this.model('User').find({id: {$in: this.followingIds}}, done)
}

userSchema.pre('save',function(next){
    var _this = this;
    bcrypt.hash(this.password,10,function(err,hash){
        if(err){return err};
        _this.password = hash;
        next();
    });
    
    
})

module.exports = userSchema;