const mongoose = require('mongoose');
mongoose.global = global.Promise;
const slug = require('slug');

const cafeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Palun sisesta kohviku nimi'
    },
    description: {
        type: String,
        trim: true,
        required: 'Palun sisesta kirjeldus kohviku kohta'
    },
    slug: String,
    tags: [],
    photo: {
        type: String,
        default: 'default_cafe_image.jpeg'
    },
    location: {
        type: String,
        trim: true,
        required: 'Palun sisesta kohviku asukoht'
    },
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'Kohviku lisajal peab olema autor'
    },
    created: {
        type: Date,
        default: Date.now()
    }
}, {
    collection: 'cafes',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

cafeSchema.index({
    name: 'text',
    description: 'text',
    location: 'text',
    tags: 'text'
});

cafeSchema.pre('save', async function(next) {
    if (!this.isModified('name')) {
        return next();
    }
    
    this.slug = slug(this.name);
    const slugRegularExpression = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const cafeWithSlug = await this.constructor.find({ slug: slugRegularExpression });

    if (cafeWithSlug.length) {
        this.slug = `${this.slug}-${cafewithSlug.length + 1}`;
    }

    next();
});

cafeSchema.statics.getCafeTagsList = function() {
    return this.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
};

cafeSchema.statics.getTopRatedCafes = function() {
    return this.aggregate([
        // Cafes and populate with reviews
        { $lookup: { from: 'reviews', localField: '_id', foreignField: 'cafe', as: 'reviews' } },
        { $match: { 'reviews.1': { $exists: true } } },
        // Average rating
        // MongodDB version >= 3.4
        // { $addFields: {
        //     averageRating: { $avg: '$reviews.rating' }
        // } }
        { $project: {
            name: '$$ROOT.name',
            reviews: '$$ROOT.reviews',
            location: '$$ROOT.location',
            averageRating: { $avg: '$reviews.rating' }
        } },
        { $sort: { averageRating: -1 } },
        { $limit: 10 }
    ]);
};

// Find reviews where cafes _id property === reviews cafe _id property
// Virtual fields does not go into an object
// We could add virtual fields by specifing in model options toJSON toObject virtuals to true
cafeSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'cafe'
});

function autoPopulate(next) {
    this.populate({
        path: 'creator reviews', 
        options: { $sort: { 'created': -1 } } 
    });
    
    next();
}

cafeSchema.pre('find', autoPopulate);
cafeSchema.pre('findOne', autoPopulate);

module.exports = mongoose.model('Cafe', cafeSchema);