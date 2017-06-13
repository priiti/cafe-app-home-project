const mongoose = require('mongoose');
const Review = mongoose.model('Review');
const Cafe = mongoose.model('Cafe');
const { isUserCafeOwner } = require('./../middleware/permissions');

exports.addNewCafeReview = async (req, res) => {

    req.body.author = req.user._id;
    req.body.cafe = req.params.id;

    const newReview = new Review(req.body);
    await newReview.save();

    req.flash('success', 'Hinnang salvestatud!');
    res.redirect('back');
};