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

import multer from 'multer';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';

const storage = multer.memoryStorage(); // Store in memory for manual piping to GridFS
const upload = multer({ storage });

export async function uploadToGridFS(buffer, filename, contentType) {
  return new Promise((resolve, reject) => {
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
    });

    const fileId = uploadStream.id; // ✅ Capture the ObjectId here
    console.log("Upload Stream ID (will become file._id):", fileId);

    uploadStream.end(buffer);

    uploadStream.on('finish', () => {
      console.log('✅ GridFS upload finished');
      // Manually construct the file object with _id and filename
      resolve({
        _id: fileId,
        filename,
        contentType,
      });
    });

    uploadStream.on('error', (err) => {
      console.error('GridFS upload error:', err);
      reject(err);
    });
  });
}


export default upload;
