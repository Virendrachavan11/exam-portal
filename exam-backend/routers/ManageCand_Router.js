import express from 'express';
import { candidatedata, User } from '../models/examdb.js';
import jsw from 'jsonwebtoken'
import { Console } from 'console';
import upload from '../middleware/fileUploadimg.js';
import ExcelJS from "exceljs";
import XLSXPopulate from 'xlsx-populate';
import mime from 'mime-types'; 
import { CandAccountCreationMail } from '../middleware/CandEmailService.js';


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

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.getWorksheet(1);

    if (!worksheet) {
      return res.status(400).json({ message: "Invalid file format or empty data" });
    }

    const imageDirectory = path.join(__dirname, "../uploads");
    if (!fs.existsSync(imageDirectory)) {
      fs.mkdirSync(imageDirectory, { recursive: true });
    }

    const imageMap = {};

    workbook.eachSheet((ws) => {
      ws.getImages().forEach((image) => {
        const img = workbook.model.media.find((m) => m.index === image.imageId);
        if (img) {
          const imageExt = mime.extension(img.contentType) || "png";
          const imageName = `candidate_${Date.now()}_${image.imageId}.${imageExt}`;
          const imagePath = path.join(imageDirectory, imageName);
          fs.writeFileSync(imagePath, img.buffer);
          imageMap[image.range.tl.nativeRow + 1] = `uploads/${imageName}`;
        }
      });
    });

    const candidatePromises = worksheet
      .getRows(2, worksheet.rowCount - 1)
      .map(async (row, rowIndex) => {
        const nameofCand = row.getCell(1).value;
        const rollNo = Number(row.getCell(2).value);
        const emailCellValue = row.getCell(3).value;
        const emailID = typeof emailCellValue === "object" ? emailCellValue.text : emailCellValue;

        if (!Number.isInteger(rollNo)) return null;

        let photoPath = imageMap[rowIndex + 2] || defaultImagePath;

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

    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting uploaded file:", err.message);
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
      const photoPath = path.join(__dirname, '..', deletedCandidate.photo);
      fs.unlink(photoPath, (err) => {
        if (err) {
          console.error("Error deleting photo:", err.message);
        } else {
          console.log("Photo deleted:", deletedCandidate.photo);
        }
      });
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

    const existingCandidate = await candidatedata.findOne({ emailID });

    if (!existingCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    let photo = existingCandidate.photo;

    // If a new photo is uploaded, delete the old one
    if (req.file) {
      const oldPhotoPath = path.join(__dirname, '..', photo);
      
      // Delete old photo only if it exists and is not a default image
      if (fs.existsSync(oldPhotoPath) && !photo.includes("default")) {
        fs.unlink(oldPhotoPath, (err) => {
          if (err) {
            console.error("Failed to delete old photo:", err.message);
          } else {
            console.log("Old photo deleted:", photo);
          }
        });
      }

      // Set new photo path
      photo = req.file.path;
    }

    const updatedCandidate = await candidatedata.findOneAndUpdate(
      { emailID },
      { $set: { nameofCand, rollNo, photo } },
      { new: true, runValidators: true }
    );

    res.json({ message: 'Candidate updated successfully', updatedCandidate });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


export default router;
