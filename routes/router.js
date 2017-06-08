const express = require('express');
const router = express.Router();
const HomepageController = require('../controllers/HomepageController');
const CafeController = require('../controllers/CafeController')
const UserController = require('../controllers/UserController');
const AuthController = require('./../controllers/AuthController');
const imageSaving = require('./../middleware/imageSaving');
const { catchErrors } = require('./../applicationErrorHandling/handleErrors');

// GET
router.get('/', HomepageController.home);
router.get('/cafes', CafeController.getAllCafes);
router.get('/cafes/:slug', CafeController.getCafeBySlugName);
router.get('/top', CafeController.getTopCafes);
router.get('/add', 
    AuthController.userIsLoggedIn,
    CafeController.addNewCafe
);

router.get('/cafes/:id/edit',
    AuthController.userIsLoggedIn,
    catchErrors(CafeController.editCafeData)
);

router.get('/register', UserController.register);
router.get('/login', UserController.login);
router.get('/logout', AuthController.logout);
router.get('/account', UserController.userAccount);

// POST
router.post('/add',
    AuthController.userIsLoggedIn,
    imageSaving.uploadImage,
    catchErrors(imageSaving.resizeImage),
    catchErrors(CafeController.saveNewCafeIntoDatabase)
);

router.post('/add/:id',
    AuthController.userIsLoggedIn,
    imageSaving.uploadImage,
    catchErrors(imageSaving.resizeImage),
    catchErrors(CafeController.updateCafeDataChanges)
);

router.post('/login',
    AuthController.login
);

router.post('/register',
    UserController.validateUserRegistrationForm,
    catchErrors(UserController.registerUserIntoDatabase),
    AuthController.login
);

module.exports = router;