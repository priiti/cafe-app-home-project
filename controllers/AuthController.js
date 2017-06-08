const passport = require('passport');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Sisselogimine ebaõnnestus',
    successRedirect: '/',
    successFlash: 'Sisselogimine õnnestus'
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Väljalogimine õnnestus');
    res.redirect('/');
};

exports.userIsLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    req.flash('warning', 'Selle lehe külastamiseks pead olema sisse logitud');
    res.redirect('/');
};