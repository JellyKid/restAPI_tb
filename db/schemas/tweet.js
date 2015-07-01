var Schema = require('mongoose').Schema;

var tweetSchema = new Schema({
    userId: String,
    created: Number,
    text: String
});

tweetSchema.methods.toClient = function(){
    return {
        tweet: {
            id: this.get('_id'),
            text: this.get('text'),
            created: this.get('created'),
            userId: this.get('userId')
        }};
}

module.exports = tweetSchema;