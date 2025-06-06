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

    exam.questions.forEach((question) => {
      if (question.photo) {
        const photoPath = path.join(__dirname, '..', question.photo);
        fs.unlink(photoPath, (err) => {});
      }
    });

    await Exam.findByIdAndDelete(examId);

    res.status(200).json({ message: 'Exam and associated images deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


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

    const photo = req.file ? req.file.path : 'uploads/default.jpg';

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
  
      const exam = await Exam.findById(examId);
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }
  
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(req.file.path);
      const worksheet = workbook.getWorksheet(1);
  
      if (!worksheet) {
        return res.status(400).json({ message: 'Invalid file format or empty data' });
      }
  
      const imageDirectory = path.join(__dirname, '../uploads');
      if (!fs.existsSync(imageDirectory)) {
        fs.mkdirSync(imageDirectory, { recursive: true });
      }
  
      const imageMap = {};
      workbook.eachSheet((ws) => {
        ws.getImages().forEach((image) => {
          const img = workbook.model.media.find((m) => m.index === image.imageId);
          if (img) {
            const imageExt = mime.extension(img.contentType) || 'png';
            const imageName = `question_${Date.now()}_${image.imageId}.${imageExt}`;
            const imagePath = path.join(imageDirectory, imageName);
            fs.writeFileSync(imagePath, img.buffer);
            imageMap[image.range.tl.nativeRow + 1] = `uploads/${imageName}`;
          }
        });
      });
  
      const questionPromises = worksheet.getRows(2, worksheet.rowCount - 1).map(async (row, rowIndex) => {
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
          photo: imageMap[rowIndex + 2] || null,
        };
        exam.questions.push(question);
      });
  
      await Promise.all(questionPromises);
      await exam.save();
  
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Failed to delete uploaded Excel file:', err.message);
        }
      });
  
      res.status(200).json({
        message: 'Excel data added successfully',
        addedQuestions: exam.questions.slice(-worksheet.rowCount + 1) // only return the newly added questions
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error uploading Excel data' });
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
  
      if (req.file) {
        let photo
        if (question.photo) {
              const filename = `${Date.now()}-${req.file.originalname}`; // New filename for the upload
             
        
              const file = await uploadToGridFS(req.file.buffer, filename, req.file.mimetype);
              
              // Step 3: Use the file._id to update the photo path in the database
              if (file) {
                photo = `uploads/${file._id.toString()}`; // Store the GridFS file's ID as the photo path
                console.log("Updated photo path:", photo);
              }
        }

        updateFields["questions.$.photo"] = photo;
      }
  

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

    if (question.photo) {
      const photoPath = path.join(__dirname, '..', question.photo);
      fs.unlink(photoPath, (err) => {
        if (err) {
          console.error('Failed to delete photo:', err.message);
        }
      });
    }
               
    const deletedExam = await Exam.findByIdAndUpdate(
      examId,
      { $pull: { questions: { _id: queId } } },
      { new: true }
    );

    res.status(200).json({ message: 'Question and photo deleted successfully', exam: deletedExam });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
export default router;