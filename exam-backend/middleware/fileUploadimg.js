// import multer from 'multer';

// // Configure storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Ensure this folder exists
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// // Modify file filter to allow .xlsx files
// const fileFilter = (req, file, cb) => {
//   const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  
//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only JPEG, PNG, JPG, or XLSX formats are allowed!'), false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: { fileSize: 10 * 1024 * 1024 } // Limit file size (10MB)
// });

// export default upload;



const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI, // make sure this is correct and accessible from Render
  file: (req, file) => {
    return {
      filename: `${Date.now()}_${file.originalname}`,
      bucketName: 'uploads', // match your bucket name
    };
  }
});

const upload = multer({ storage });
module.exports = upload;
