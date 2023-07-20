const multer = require("multer");

const storage = multer.diskStorage({});

/**
 * function to upload image files
 * @param {*} req request from frontend req
 * @param {*} file to be uploaded
 * @param {*} cb response from the frontend req
 */
const imageFileFilter = (req, file, cb) => {
  // console.log(file);
  if (!file.mimetype.startsWith("image")) {
    cb("Support only image files!", false);
  }
  cb(null, true);
};

/**
 * function to upload video files
 * @param {*} req request from frontend req
 * @param {*} file to be uploaded
 * @param {*} cb response from the frontend req
 */
const videoFileFilter = (req, file, cb) => {
  // console.log(file);
  if (!file.mimetype.startsWith("video")) {
    cb("Support only image files!", false);
  }
  cb(null, true);
};

exports.uploadImage = multer({ storage, fileFilter: imageFileFilter });
exports.uploadVideo = multer({ storage, fileFilter: videoFileFilter });
