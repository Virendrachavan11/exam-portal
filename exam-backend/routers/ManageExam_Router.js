import express from 'express';
import multer from 'multer';
import { Que, Exam } from "../models/examdb.js";
import csvtojson from 'csvtojson';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ExcelJS from "exceljs";
import mime from 'mime-types'; 
import upload,{ uploadToGridFS } from '../middleware/fileUploadimg.js';
import { GridFSBucket, ObjectId } from 'mongodb';
import mongoose from "mongoose";

const router = express.Router();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




router.get("/:SvUser", async (req, res) => {
  try {
    const { SvUser } = req.params; 

    const exm = await Exam.find({ createdby: SvUser });

    if (exm.length === 0) {
      return res.status(404).json({ message: "No exams found for this user" });
    }

    res.status(200).json(exm);
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({ message: "Server error" });
  }
});



router.post('/AddExam', async (req, res) => {
  try {
    const exm = new Exam({
      examTitle: req.body.examTitle,
      examDesc: req.body.examDesc,
      questions: [],
      createdby: req.body.createdby
    });

    await exm.save();

    res.status(200).json({
      message: "Exam added successfully",
      exam: exm
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




router.put('/update/:examId', async (req, res) => {
  try {
      const { examId } = req.params;
      const { examTitle ,examType ,examDesc ,examDuration ,MarkPerQue,examlang } = req.body; 

      const updatedExam = await Exam.findByIdAndUpdate(
          examId,
          { examTitle ,examType ,examDesc ,examDuration ,MarkPerQue,examlang} ,  
          { new: true, runValidators: true }
      );

      res.status(200).json({ message: 'Exam updated successfully', exam: updatedExam });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
});

router.delete('/delete-exam/:examId', async (req, res) => {
  const { examId } = req.params;

  try {
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // GridFS bucket instance (assuming 'uploads' is the bucket name used in GridFS)
        const db = mongoose.connection.db;
        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

    // Delete all question photos stored in GridFS
    for (const question of exam.questions) {
      if (question.photo && question.photo.startsWith('uploads/')) {
        const fileId = question.photo.split('/')[1];
        try {
          await bucket.delete(new mongoose.Types.ObjectId(fileId));
          console.log(`Deleted GridFS file: ${fileId}`);
        } catch (err) {
          console.warn(`Error deleting GridFS file ${fileId}:`, err.message);
        }
      }
    }

    // Delete the exam document after image cleanup
    await Exam.findByIdAndDelete(examId);

    res.status(200).json({ message: 'Exam and associated question images deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


    // exam.questions.forEach((question) => {
    //   if (question.photo) {
    //     const photoPath = path.join(__dirname, '..', question.photo);
    //     fs.unlink(photoPath, (err) => {});
    //   }
    // });


router.post('/:examId/questions', upload.single('photo'), async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId);

    const {
      Question,
      QueTrans,
      option1,
      option2,
      option3,
      option4,
      option1t,
      option2t,
      option3t,
      option4t,
      ans
    } = req.body;

    // const photo = req.file ? req.file.path : 'uploads/default.jpg';
    let photo;

        if (req.file) {
          console.log("File received for upload:", req.file);
    
    
          const filename = `${Date.now()}-${req.file.originalname}`; // New filename for the upload
          console.log(filename)

          const file = await uploadToGridFS(req.file.buffer, filename, req.file.mimetype);
          

          if (file) {
            photo = `uploads/${file._id.toString()}`; // Store the GridFS file's ID as the photo path
            console.log("Updated photo path:", photo);
          }
        }

    const newQuestion = {
      Question,
      QueTrans,
      option1,
      option2,
      option3,
      option4,
      option1t,
      option2t,
      option3t,
      option4t,
      ans,
      photo
    };

    exam.questions.push(newQuestion);
    await exam.save();


    res.status(200).json({
      message: 'Question added successfully',
      newQue: newQuestion 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.post('/:examId/upload-csvQ', upload.single('file'), async (req, res) => {
  try {
    const { examId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Step 1: Upload the file to GridFS (MongoDB Atlas)
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });

    // Using your custom uploadToGridFS function to upload the file to GridFS
    const file = await uploadToGridFS(req.file.buffer, req.file.originalname, req.file.mimetype);

    // Save the file information in the database temporarily
    const uploadedFileId = file._id;

    // Step 2: Process the file content (e.g., parse Excel)
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);  // Use buffer here
    const worksheet = workbook.getWorksheet(1);

    if (!worksheet) {
      return res.status(400).json({ message: 'Invalid Excel file format or empty sheet' });
    }

    const imageUploadPromises = [];
    workbook.eachSheet((ws) => {
      ws.getImages().forEach((image) => {
        const img = workbook.model.media.find((m) => m.index === image.imageId);
        if (img) {
          const ext = mime.extension(img.contentType) || 'png';
          const filename = `question_${Date.now()}_${image.imageId}.${ext}`;
          const rowNum = image.range.tl.nativeRow + 1;

          imageUploadPromises.push(
            uploadToGridFS(img.buffer, filename, img.contentType)
              .then((file) => {
                return { rowNum, fileId: `uploads/${file._id.toString()}` };
              })
              .catch((err) => {
                console.error('Failed to upload image to GridFS:', err);
                return null; // In case of failure, we return null for this image
              })
          );
        }
      });
    });

    const uploadedImages = await Promise.all(imageUploadPromises);
    const imageMap = {};
    uploadedImages.forEach(({ rowNum, fileId }) => {
      if (fileId) {
        imageMap[rowNum] = fileId;
      }
    });

    // Step 3: Process the rows and add questions to the exam
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const questionPromises = worksheet.getRows(2, worksheet.rowCount - 1).map(async (row, index) => {
      const question = {
        Question: row.getCell(1).value,
        QueTrans: row.getCell(2).value,
        option1: row.getCell(3).value,
        option2: row.getCell(4).value,
        option3: row.getCell(5).value,
        option4: row.getCell(6).value,
        option1t: row.getCell(7).value,
        option2t: row.getCell(8).value,
        option3t: row.getCell(9).value,
        option4t: row.getCell(10).value,
        ans: row.getCell(11).value,
        photo: imageMap[index + 2] || null
      };

      exam.questions.push(question);
    });

    await Promise.all(questionPromises);
    await exam.save();

    // Step 4: Delete the temporary file from GridFS after processing
    bucket.delete(uploadedFileId, (err) => {
      if (err) {
        console.error('Failed to delete temp file from GridFS:', err);
      } else {
        console.log('Temporary file deleted from GridFS');
      }
    });

    res.status(200).json({
      message: 'Questions with optional images added successfully',
      addedQuestions: exam.questions.slice(-worksheet.rowCount + 1)
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error during Excel processing', error: error.message });
  }
});






router.put('/update/:examId/questions/:qid', upload.single('photo'), async (req, res) => {
  const { examId, qid } = req.params;
  const updatedData = req.body;

  try {
    const exam = await Exam.findOne({ _id: examId, "questions._id": qid });
    if (!exam) {
      return res.status(404).json({ message: 'Exam or Question not found' });
    }

    const question = exam.questions.id(qid);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    let updateFields = {
      "questions.$.Question": updatedData.Question,
      "questions.$.QueTrans": updatedData.QueTrans,
      "questions.$.option1": updatedData.option1,
      "questions.$.option2": updatedData.option2,
      "questions.$.option3": updatedData.option3,
      "questions.$.option4": updatedData.option4,
      "questions.$.option1t": updatedData.option1t,
      "questions.$.option2t": updatedData.option2t,
      "questions.$.option3t": updatedData.option3t,
      "questions.$.option4t": updatedData.option4t,
      "questions.$.ans": updatedData.ans
    };

    // ✅ If new photo is uploaded
    if (req.file) {
      const db = mongoose.connection.db;
      const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

      // 🔁 If an old photo exists, delete it from GridFS
      const oldPhotoId = question.photo?.split('/')[1];
      if (oldPhotoId && ObjectId.isValid(oldPhotoId)) {
        try {
          await bucket.delete(new ObjectId(oldPhotoId));
          console.log("Old photo deleted:", oldPhotoId);
        } catch (err) {
          console.warn("Old photo deletion failed:", err.message);
        }
      }

      // 📥 Upload new photo to GridFS
      const filename = `${Date.now()}-${req.file.originalname}`;
      const file = await uploadToGridFS(req.file.buffer, filename, req.file.mimetype);
      if (file) {
        const newPhotoPath = `uploads/${file._id.toString()}`;
        updateFields["questions.$.photo"] = newPhotoPath;
        console.log("New photo uploaded:", newPhotoPath);
      }
    }

    // 📝 Update the question fields
    await Exam.findOneAndUpdate(
      { _id: examId, "questions._id": qid },
      { $set: updateFields },
      { new: true }
    );

    const updatedExam = await Exam.findById(examId);
    const updatedQuestion = updatedExam.questions.id(qid);

    res.status(200).json({
      updatedQuestion,
      message: "Question updated successfully"
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: err.message });
  }
});


  

router.delete('/:examId/:queId', async (req, res) => {
  try {
    const { examId, queId } = req.params;

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const question = exam.questions.id(queId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // ✅ Delete GridFS-stored photo
    if (question.photo && question.photo.startsWith('uploads/')) {
      const fileId = question.photo.split('/')[1];
      try {
        const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
        await bucket.delete(new mongoose.Types.ObjectId(fileId));
        console.log(`Deleted GridFS file: ${fileId}`);
      } catch (err) {
        console.warn(`Failed to delete GridFS file: ${fileId} - ${err.message}`);
      }
    }

    // ✅ Remove the question from the array
    const updatedExam = await Exam.findByIdAndUpdate(
      examId,
      { $pull: { questions: { _id: queId } } },
      { new: true }
    );

    res.status(200).json({ message: 'Question and photo deleted successfully', exam: updatedExam });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;