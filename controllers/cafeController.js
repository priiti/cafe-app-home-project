const mongoose = require('mongoose');
const Cafe = mongoose.model('Cafe');
const { isUserCafeOwner,  checkUserRolesAndPermissions } = require('./../middleware/permissions');
const { flashErrorMessages } = require('./../applicationHelpers');


exports.getAllCafes = async (req, res) => {
    const page = req.params.page || 1;
    const limit = 6;
    const skip = (page * limit) - limit;
    
    const cafesPromise = Cafe
        .find()
        .skip(skip)
        .limit(limit);
    
    const countPromise = Cafe.count();

    const [ cafes, count ] = await Promise.all([cafesPromise, countPromise]);

    const pages = Math.ceil(count / limit);

    if (!cafes.length && skip) {
        req.flash('info', `Lehte ${page} ei eksisteeri, Teid suunatakse lehele ${pages}.`);
        res.redirect(`/cafes/page/${pages}`);
        return;
    }

    res.render('cafes', {
        title: 'Kohvikud',
        heading: 'Kohvikud',
        cafes, page, pages, count
    });
};

exports.addNewCafe = (req, res) => {
    if (!checkUserRolesAndPermissions(req.user.role)) {
        req.flash('warning', flashErrorMessages.noUserRights);
        res.redirect('/');
        return;
    }

    res.render('editCafe', {
        title: "Lisa uus kohvik",
        heading: "Lisa uus kohvik"
    });
};

exports.saveNewCafeIntoDatabase = async (req, res) => {
    if (!checkUserRolesAndPermissions(req.user.role)) {
        req.flash('warning', flashErrorMessages.noUserRights);
        res.redirect('/');
    }

    req.body.creator = req.user._id;
    const cafe = await (new Cafe(req.body)).save();

    req.flash('success', 'Kohviku lisamine õnnestus');
    res.redirect(`/cafe/${cafe.slug}`);
};

exports.editCafeData = async (req, res) => {
    const singleCafe = await Cafe.findOne({ _id: req.params.id });

    if (!isUserCafeOwner(singleCafe, req.user)) {
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
    
    const cafe = await Cafe.findOneAndUpdate({ _id: req.params.id },
        req.body, {
            new: true,
            runValidators: true
        }
    ).exec();

    req.flash('success', `Kohviku andmed muudetud`);
    res.redirect(`/cafe/${cafe.slug}`);
};

exports.getTopRatedCafes = async (req, res) => {
    const cafes = await Cafe.getTopRatedCafes();

    res.render('top', {
        title: 'Parimad kohvikud',
        cafes: cafes
    });
};

exports.getCafeBySlugName = async (req, res, next) => {
    const cafe = await Cafe.findOne({ slug: req.params.slug });

    if (!cafe) {
        next();
    };

    res.render('singleCafe', {
        title: cafe.name,
        heading: cafe.name,
        cafe: cafe
    });
};

exports.searchCafesByNameAndDescription = async (req, res) => {
    const cafes = await Cafe.find({
        $text: {
            $search: req.query.q
        }
    }, {
        score: { $meta: 'textScore' }
    }).sort({
        score: { $meta: 'textScore' }
    });

    res.json(cafes);
}