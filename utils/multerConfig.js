// file: utils/multerConfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Check if uploads directory exists and is writable
fs.access('uploads/', fs.constants.F_OK | fs.constants.W_OK, (err) => {
  if (err) {
    console.error(
      `${
        err.code === 'ENOENT'
          ? 'uploads directory does not exist'
          : 'uploads directory is read-only'
      }`
    );
    // Create the directory if it does not exist
    fs.mkdir('uploads/', { recursive: true }, (err) => {
      if (err) throw err;
    });
  } else {
    console.log('uploads directory is exists and writable');
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // 使用原始文件名和当前日期时间作为新的文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload;
