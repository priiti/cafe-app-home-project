const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const validator = require('validator');
const mongooseErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Ebakorrektne e- mail. Kontrolli e- maili aadressi'],
        required: 'Palun sisesta e- maili aadress'
    },
    name: {
        type: String,
        trim: true,
        required: 'Palun sisesta oma nimi'
    },
    photo: {
        type: String,
        default: 'default-avatar.png'
    },
    role: {
        type: Number,
        default: 3
    },
    created: {
        type: Date,
        default: Date.now()
    }
}, {
    collection: 'users'
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongooseErrorHandler);

module.exports = mongoose.model('User', userSchema);