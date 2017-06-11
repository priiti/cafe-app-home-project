const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const reviewSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'Sa pead olema registreerunud kasutaja, et jätta hinnang'
    },
    cafe: {
        type: mongoose.Schema.ObjectId,
        ref: 'Cafe',
        required: 'Pead valima kohviku'
    },
    text: {
        type: String,
        required: 'Hinnangu lisamiseks kirjuta arvustus'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    }
}, {
    collection: 'reviews'
});

function autoPopulate(next) {
    this.populate('author');
    next();
}

reviewSchema.pre('find', autoPopulate);
reviewSchema.pre('findOne', autoPopulate);

module.exports = mongoose.model('Review', reviewSchema);