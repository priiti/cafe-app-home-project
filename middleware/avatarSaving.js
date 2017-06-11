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
    
    console.log(photoFileType);

    // req.body.photo = `${uuid.v4()}.${photoFileType}`;

    // const photo = await jimp.read(req.file.buffer);

    // await photo.resize(400, jimp.AUTO);

    // await photo.write(`./public/avatars/${req.body.photo}`);

    // next();
};