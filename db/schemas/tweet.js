var Schema = require('mongoose').Schema;

var tweetSchema = new Schema({
    userId: String,
    created: Number,
    text: String
});

tweetSchema.methods.toClient = function(){
    return {
            id: this.get('_id'),
            text: this.get('text'),
            created: this.get('created'),
            userId: this.get('userId')
        };
}

tweetSchema.statics.findByUserId = function(id, done){
    this.find({userId: id}, null, {sort: {created: -1}}, done)
}

tweetSchema.statics.getFriendsTweets = function(friends, done){
    this.find({userId: {$in: friends}}, null, {sort: {created: -1}}, done)
}


module.exports = tweetSchema;