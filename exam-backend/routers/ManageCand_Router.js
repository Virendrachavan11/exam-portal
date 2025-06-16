import express from 'express';
import { candidatedata, User } from '../models/examdb.js';
import jsw from 'jsonwebtoken'
import { Console } from 'console';
import ExcelJS from "exceljs";

import mime from 'mime-types'; 
import { CandAccountCreationMail } from '../middleware/CandEmailService.js';
import upload,{ uploadToGridFS } from '../middleware/fileUploadimg.js';
import { GridFSBucket, ObjectId } from 'mongodb';
import mongoose from "mongoose";


import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const createToken =(_id)=>
  {
     return jsw.sign({_id},process.env.SECRET_KEY,{expiresIn:'3d'})
  }

function generatePassword() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const symbols = "@#$%?";
  const numbers = "0123456789";

  const charPart = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const symbolPart = symbols[Math.floor(Math.random() * symbols.length)];
  const numberPart = Array.from({ length: 4 }, () => numbers[Math.floor(Math.random() * numbers.length)]).join("");

  return (charPart + symbolPart + numberPart)
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

router.get('/Candidate-list/:createdby', async (req, res) => {
  const { createdby } = req.params;

  try {
    const cand_list = await candidatedata.find({ createdby:createdby });
    res.status(200).json(cand_list);
    
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Candidates', error: err.message });
  }
});


router.post("/Upload-Candidate/:createdby", upload.single("file"), async (req, res) => {
  try {
    const { createdby } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Step 1: Upload Excel file to GridFS
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    const uploadedExcel = await uploadToGridFS(req.file.buffer, req.file.originalname, req.file.mimetype);
    const uploadedExcelId = uploadedExcel._id;

    // Step 2: Read Excel from buffer directly
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer); // direct buffer use
    const worksheet = workbook.getWorksheet(1);

    if (!worksheet) {
      return res.status(400).json({ message: "Invalid file format or empty data" });
    }

    const imageMap = {};

    // Step 3: Upload embedded images (if any) to GridFS
    workbook.eachSheet((ws) => {
      ws.getImages().forEach((image) => {
        const img = workbook.model.media.find((m) => m.index === image.imageId);
        if (img) {
          const ext = mime.extension(img.contentType) || 'png';
          const filename = `candidate_${Date.now()}_${image.imageId}.${ext}`;
          const rowNum = image.range.tl.nativeRow + 1;

          imageMap[rowNum] = uploadToGridFS(img.buffer, filename, img.contentType)
            .then(file => `uploads/${file._id.toString()}`)
            .catch(err => {
              console.error("Image upload failed:", err.message);
              return null;
            });
        }
      });
    });

    // Resolve image uploads
    const resolvedImageMap = {};
    for (const row in imageMap) {
      resolvedImageMap[row] = await imageMap[row];
    }

    // Step 4: Process and create candidates
    const candidatePromises = worksheet.getRows(2, worksheet.rowCount - 1).map(async (row, rowIndex) => {
      const nameofCand = row.getCell(1).value;
      const rollNo = Number(row.getCell(2).value);
      const emailCellValue = row.getCell(3).value;
      const emailID = typeof emailCellValue === "object" ? emailCellValue.text : emailCellValue;

      if (!Number.isInteger(rollNo)) return null;

      const photoPath = resolvedImageMap[rowIndex + 2] || 'uploads/default.png';

      const User_details = {
        emailID,
        nameofCand,
        rollNo,
        createdby,
        photo: photoPath,
      };

      const psw = generatePassword();
      const User_cred = {
        emailID,
        Password: psw,
        userType: "Candidate",
      };

      await candidatedata.create(User_details);
      const user = await User.signup(User_cred.emailID, User_cred.Password, User_cred.userType);

      try {
        await CandAccountCreationMail(User_cred.emailID, nameofCand, User_cred.Password);
      } catch (error) {
        console.error(`Failed to send email to ${User_cred.emailID}:`, error.message);
      }

      return createToken(user._id);
    });

    const tokens = (await Promise.all(candidatePromises)).filter(Boolean);

    // Step 5: Delete Excel file from GridFS
    bucket.delete(uploadedExcelId, (err) => {
      if (err) {
        console.error("Error deleting Excel file from GridFS:", err.message);
      } else {
        console.log("Excel file deleted from GridFS after processing.");
      }
    });

    res.status(201).json({ message: "Candidates uploaded successfully", tokens });
  } catch (error) {
    console.error("Error uploading candidates:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



router.delete("/Delete-Candidate/:emailID", async (req, res) => {
  const { emailID } = req.params;

  try {
    const deletedUser = await User.findOneAndDelete({ EmailId: emailID });
    if (!deletedUser) {
      return res.status(404).json({ message: "User credentials not found" });
    }

    const deletedCandidate = await candidatedata.findOneAndDelete({ emailID });
    if (!deletedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    if (deletedCandidate.photo) {
       const fileId = deletedCandidate.photo.split('/')[1];
      try {
        const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
        await bucket.delete(new mongoose.Types.ObjectId(fileId));
        console.log(`Deleted GridFS file: ${fileId}`);
      } catch (err) {
        console.warn(`Failed to delete GridFS file: ${fileId} - ${err.message}`);
      }
    }

    res.status(200).json({ message: "Candidate, associated user, and photo deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error deleting Candidate", error: error.message });
  }
});



router.put('/Update-Candidate/:emailID', upload.single('photo'), async (req, res) => {
  try {
    const { emailID } = req.params;
    const { nameofCand, rollNo } = req.body;

    console.log(emailID)

    const existingCandidate = await candidatedata.findOne({ emailID });
    if (!existingCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    let photo = existingCandidate.photo; // default to old photo

    if (req.file) {
      const db = mongoose.connection.db;
      const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

      const oldPhotoId = existingCandidate.photo?.split('/')[1];
      if (oldPhotoId && ObjectId.isValid(oldPhotoId)) {
        try {
          await bucket.delete(new ObjectId(oldPhotoId));
          console.log("Old photo deleted:", oldPhotoId);
        } catch (err) {
          console.warn("Old photo deletion failed:", err.message);
        }
      }

      const filename = `${Date.now()}-${req.file.originalname}`;
      const file = await uploadToGridFS(req.file.buffer, filename, req.file.mimetype);
      if (file && file._id) {
        photo = `uploads/${file._id.toString()}`;
        console.log("New photo uploaded:", photo);
      }
    }

    const updatedCandidate = await candidatedata.findOneAndUpdate(
      { emailID },
      { $set: { nameofCand, rollNo, photo } },
      { new: true, runValidators: true }
    );

    res.json({ message: 'Candidate updated successfully', updatedCandidate });

  } catch (error) {
    console.error("Update Candidate Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


export default router;
