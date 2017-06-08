const multer = require('multer');
const uuid = require('uuid');
const jimp = require('jimp');

const multerOptionsForSavingImage = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhotoFile = file.mimetype.startsWith('image/');

        if (isPhotoFile) {
            next(null, true);
        } else {
            next({
                message: 'Lisatud faili tüüp ei ole sobilik'
            }, false);
        }
    }
};

exports.uploadImage = multer(multerOptionsForSavingImage).single('photo');

exports.resizeImage = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const photoFileType = req.file.mimetype.split('/')[1];
    
    req.body.photo = `${uuid.v4()}.${photoFileType}`;

    const photo = await jimp.read(req.file.buffer);

    await photo.resize(800, jimp.AUTO);

    await photo.write(`./public/uploads/${req.body.photo}`);

    next();
};