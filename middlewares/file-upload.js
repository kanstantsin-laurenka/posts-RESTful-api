const multer = require("multer");


module.exports = (fieldName, allowedMimeTypes) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, `${new Date().toISOString()}-${file.originalname}`);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  return multer({ storage, fileFilter }).single(fieldName);
};
