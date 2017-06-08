exports.catchErrors = (fn) => {
	return function(req, res, next) {
		return fn(req, res, next).catch(next);
	}
};

exports.pageNotFound = (req, res, next) => {
	const error = new Error('Lehte ei leitud!');
	error.status = 404;
	next(error);
};

exports.flashValidationErrors = (error, req, res, next) => {
	if (!error.errors) { return next(error); };
	
	const errorKeys = Object.keys(error.errors);
	errorKeys.forEach((key) => {
		req.flash('error', error.errors[key].message);
	});
	res.redirect('/');
};

exports.developmentErrors = (error, req, res, next) => {
	error.stack = error.stack || '';
	const errorDetails = {
		message: error.message,
		status: error.status,
		errorStack: error.stack
	}
	res.status(error.status || 500);
	res.format({
		'text/html': () => {
			res.render('error', errorDetails);
		},
		'application/json': () => {
			res.json(errorDetails)
		}
	});
};

exports.productionErrors = (error, req, res, next) => {
	res.status(error.status || 500);
	res.render('error', {
		message: error.message,
		error: {}
	});
};