const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
    cloud_name: process.env.name,
    api_key: process.env.apiKey,
    api_secret: process.env.secretApi
})
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
})
module.exports = {
    cloudinary,
    storage
}
/*
meaning of cloudinary is we can store the large files in this rather than using mongo
the meaning of the storage is
storing in the account in the folder with this types

*/