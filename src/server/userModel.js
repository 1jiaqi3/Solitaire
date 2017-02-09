/**
 * Created by 1jiaqi3 on 10/23/2016.
 */
let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let Schema = mongoose.Schema;



let userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    primary_email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    salt: {type: String, required: true}
});

userSchema.pre('save', function(next) {
    let user = this;
    if (user.isModified('password')) {
        bcrypt.hash(user.password, user.salt, function (hashErr, hash) {
            if (hashErr) {
                return next(hashErr);
            }
            user.password = hash;
            next();
        });
    }
});
/*
 userSchema.methods.comparePassword = function (attempPassword, cb) {
 bcrypt.compare(attempPassword, this.password, function (err, isMatch) {
 cb(isMatch);
 });
 }
 */
let gameSchema = new Schema({
    Players: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    Creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    startDate: {type: Date, required: true},
    endDate: Date,
    Turn: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    Type: {type: String, required: true},
    num_players: {type: Number, required: true},
    name: {type: String, required: true},
    Deck: {type: String, required: true},
    draw_num: {type: Number, required: true},
    status: {type: Boolean, default: true},
    states: [{type: String}],
});


module.exports = {
    User: mongoose.model('User', userSchema),
    Game: mongoose.model('Game', gameSchema)
};
