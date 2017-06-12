const multer = require('multer');
const uuid = require('uuid');
const jimp = require('jimp');
const { multerOptionsForSavingImage } = require('./imageSaving');

exports.uploadImage = multer(multerOptionsForSavingImage).single('photo');

exports.resizeImage = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const photoFileType = req.file.mimetype.split('/')[1];
    
    if (req.user.photo === 'default-avatar.png') {
        req.body.photo = `${uuid.v4()}.${photoFileType}`;
    } else {
        req.body.photo = req.user.photo;
    }

    const photo = await jimp.read(req.file.buffer);

    await photo.resize(400, jimp.AUTO);

    await photo.write(`./public/avatars/${req.body.photo}`);

    next();
};