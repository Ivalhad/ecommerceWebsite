const path = require('path');
const express = require('express');
const multer = require('multer');

const router = express.router();

// config storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // file lcoation
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    // fille name
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// filter file only image
function checkFileType(file, cb) {
  
  const filetypes = /jpg|jpeg|png/;
  
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

// multer init
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// route endpoint
router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path.replace(/\\/g, '/')}`);
});

module.exports = router;