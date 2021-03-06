const express = require('express');
const router = express.Router();
const homepageController = require('./../controllers/homepageController');
const cafeController = require('./../controllers/cafeController');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');
const imageSaving = require('./../middleware/imageSaving');
const avatarSaving = require('./../middleware/avatarSaving');
const { catchErrors } = require('./../applicationErrorHandling/handleErrors');

// GET
// Cafe routes
router.get('/', 
    catchErrors(homepageController.home)
);

router.get('/cafes', 
    catchErrors(cafeController.getAllCafes)
);

router.get('/cafes/page/:page', 
    catchErrors(cafeController.getAllCafes)
);

router.get('/cafe/:slug', 
    catchErrors(cafeController.getCafeBySlugName)
);

router.get('/top', 
    catchErrors(cafeController.getTopRatedCafes)
);

router.get('/add',
    authController.userIsLoggedIn,
    cafeController.addNewCafe
);

router.get('/cafe/:id/edit',
    authController.userIsLoggedIn,
    catchErrors(cafeController.editCafeData)
);

// User routes
router.get('/register', userController.register);
router.get('/login', userController.login);
router.get('/logout', authController.logout);
router.get('/account', 
    authController.userIsLoggedIn,
    userController.userAccount
);

// POST
// Cafe routes
router.post('/add',
    authController.userIsLoggedIn,
    imageSaving.uploadImage,
    catchErrors(imageSaving.resizeImage),
    catchErrors(cafeController.saveNewCafeIntoDatabase)
);

router.post('/add/:id',
    authController.userIsLoggedIn,
    imageSaving.uploadImage,
    catchErrors(imageSaving.resizeImage),
    catchErrors(cafeController.updateCafeDataChanges)
);

router.post('/reviews/:id',
    authController.userIsLoggedIn,
    catchErrors(reviewController.addNewCafeReview)
);

// User routes
router.post('/login',
    authController.login
);

router.post('/register',
    userController.validateUserRegistrationForm,
    catchErrors(userController.registerUserIntoDatabase),
    authController.login
);

router.post('/account',
    authController.userIsLoggedIn,
    avatarSaving.uploadImage,
    catchErrors(avatarSaving.resizeImage),
    catchErrors(userController.updateRegisteredUserAccount)
);

/* API routes */
router.get('/api/v1/search', 
    catchErrors(cafeController.searchCafesByNameAndDescription)
);

module.exports = router;