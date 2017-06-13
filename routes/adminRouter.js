const express = require('express');
const adminRouter = express.Router();
const adminController = require('./../admin/adminControllers/adminController');

adminRouter.get('/',
    adminController.admin
);

module.exports = adminRouter;