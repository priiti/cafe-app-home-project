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

// Find reviews where cafes _id property === reviews cafe _id property
// Virtual fields does not go into an object
// We could add virtual fields by specifing in model options toJSON toObject virtuals to true
cafeSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'cafe'
});

module.exports = mongoose.model('Cafe', cafeSchema);