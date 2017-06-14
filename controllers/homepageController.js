const mongoose = require('mongoose');
const Cafe = mongoose.model('Cafe');

exports.home = async (req, res) => {
    const cafes = await Cafe
        .find()
        .sort({ 'created': -1 })
        .limit(3);

    res.render('homepage', {
        title: 'Avaleht',
        cafes: cafes
    });
};