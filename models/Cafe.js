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
    photo: {
        type: String,
        default: 'default_cafe_image.jpeg'
    },
    location: {
        type: String,
        trim: true,
        required: 'Palun sisesta kohviku asukoht'
    },
    role: {
        type: Number,
        default: 3
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
    collection: 'cafes'
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

module.exports = mongoose.model('Cafe', cafeSchema);