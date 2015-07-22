var crypto = require('crypto'),
    mongoose = require('../../libs/mongoose'),
    async = require('async'),
    CustomError = require('../../error').CustomError,
    Schema = mongoose.Schema,
    schema = new Schema({
       username: {
           type: String,
           unique: true,
           required: true
       },
        hashedPassword: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            required: true
        },
        created: {
            type: Date,
            default: Date.now
        }
    });

schema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._plainPassword;
    });

schema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorize = function(username, password, callback) {
    var User = this,
        funcList = [
            function(callback) {
                User.findOne({ username: username }, callback);
            },
            function(user, callback) {
                if (user) {
                    if (user.checkPassword(password)) {
                        callback(null, user);
                    } else {
                        callback(new CustomError(null, 'Password is not correct'));
                    }
                } else {
                    callback(new CustomError(null, 'User not found'));
                }
            }
        ];

    async.waterfall(funcList, callback);
};

exports.User = mongoose.model('User', schema);