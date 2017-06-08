const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.register = (req, res) => {
    res.render('register', {
        title: 'Registreeri',
        heading: 'Registreeri'
    })
};

exports.login = (req, res) => {
    res.render('login', {
        title: 'Logi sisse',
        heading: 'Logi sisse'
    });
};

exports.validateUserRegistrationForm = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'Nime sisestamine on kohustuslik').notEmpty();
    req.checkBody('email', 'E- maili sisestamine on kohustuslik').isEmail();

    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });

    req.checkBody('password', 'Parooli sisestamine on kohustuslik').notEmpty();
    req.checkBody('password-confirm', 'Kinnita parool sisestamine on kohustuslik').notEmpty();
    req.checkBody('password-confirm', 'Sisestatud paroolid peavad kattuma')
        .equals(req.body.password);
    
    const errors = req.validationErrors();

    if (errors) {
        req.flash('error', errors.map(error => error.msg));

        res.render('register', {
            title: 'Registreeri',
            heading: 'Registreeri',
            flashes: req.flash()
        });
        return;
    }
    next();
};

exports.registerUserIntoDatabase = async (req, res, next) => {
    const user = new User({
        email: req.body.email,
        name: req.body.name  
    });

    const registrationPromiseForUser = promisify(User.register, User);
    await registrationPromiseForUser(user, req.body.password);

    next();
};

exports.userAccount = (req, res) => {
    res.render('account', {
        title: 'Kasutaja andmed'
    });
};

exports.updateRegisteredUserAccount = async (req, res) => {
    const updateUserAccountDataDetails = {
        name: req.body.name,
        email: req.body.email
    };

    const user = await User.findOneAndUpdate(
        { _id: req.user.id },
        {$set: updateUserAccountDataDetails}, {
            new: true,
            runValidators: true,
            context: 'query'
        }
    );

    req.flash('success', 'Kasutaja andmed edukalt muudetud');
    res.redirect('/account');
};