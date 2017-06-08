const mongoose = require('mongoose');
const Cafe = mongoose.model('Cafe');
const { checkIfUserIsOwner,  checkUserRolesAndPermissions } = require('./../middleware/cafeUserRolers');

exports.getAllCafes = async (req, res) => {
    const cafes = await Cafe.find();

    res.render('cafes', {
        title: 'Kohvikud',
        cafes: cafes
    });
};

exports.addNewCafe = (req, res) => {
    if (!checkUserRolesAndPermissions(req.user.role)) {
        req.flash('warning', 'Sul ei ole õigusi kohvikute lisamiseks');
        res.redirect('/');
    }

    res.render('editCafe', {
        title: "Lisa uus kohvik",
        heading: "Lisa uus kohvik"
    });
};

exports.saveNewCafeIntoDatabase = async (req, res) => {
    if (!checkUserRolesAndPermissions(req.user.role)) {
        req.flash('warning', 'Sul ei ole õigusi kohvikute lisamiseks');
        res.redirect('/');
    }

    req.body.creator = req.user._id;
    const cafe = await (new Cafe(req.body)).save();

    req.flash('success', 'Kohviku lisamine õnnestus');
    res.redirect(`/cafes/${cafe.slug}`);
};

exports.editCafeData = async (req, res) => {
    const singleCafe = await Cafe.findOne({ _id: req.params.id });

    if (!checkIfUserIsOwner(singleCafe, req.user)) {
        req.flash('warning', 'Sa pead olema kohviku omanik, et teha muudatusi kohviku andmetes');
        res.redirect(`/cafes`);
    }

    res.render('editCafe', {
        title: singleCafe.name,
        heading: 'Muuda kohvikut',
        cafe: singleCafe
    })
};

exports.updateCafeDataChanges = async (req, res) => {
    if (!checkUserRolesAndPermissions(req.user.role)) {
        req.flash('warning', 'Sul ei ole õigusi kohvikute lisamiseks');
        res.redirect('/');
    }

    req.body.creator = req.user._id;
    console.log(req.body);
    const cafe = await Cafe.findOneAndUpdate({ _id: req.params.id },
        req.body, {
            new: true,
            runValidators: true
        }
    ).exec();

    req.flash('success', `Kohviku andmed muudetud`);
    res.redirect(`/cafes/${cafe.slug}`);
};

exports.getTopCafes = (req, res) => {
    res.render('top', {
        title: 'Top 10',
        heading: 'Top 10'
    });
};

exports.getCafeBySlugName = async (req, res, next) => {
    const cafe = await Cafe.findOne({ slug: req.params.slug }).populate('creator');

    if (!cafe) {
        next();
    };

    res.render('singleCafe', {
        title: cafe.name,
        heading: cafe.name,
        cafe: cafe
    });
};