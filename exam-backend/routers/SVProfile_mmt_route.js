import express from 'express';
import {supervisordata,User} from "../models/examdb.js";
import upload,{uploadToGridFS} from '../middleware/fileUploadimg.js';

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const router = express.Router();

router.get('/:SvUser', async (req, res) => {
    const { SvUser } = req.params;
    const emailID = SvUser;
  
    try {
      const svInfo = await supervisordata.findOne({ emailID }); // Use findOne() instead of find()
    
      if (!svInfo) {
        return res.status(404).json({ message: "Supervisor not found" });
      }
  
      res.status(200).json(svInfo);
    } catch (err) {
      res.status(500).json({ message: "Error fetching Supervisor", error: err.message });
    }
  });

  
router.put('/Update-supervisor/:emailID', upload.single('photo'), async (req, res) => {
  try {
    const { emailID } = req.params;
    const { nameofsv, orgName } = req.body;

    // Step 1: Find the existing supervisor by email ID
    const existingsv = await supervisordata.findOne({ emailID });
    if (!existingsv) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    let photo = existingsv.photo; // Default to the existing photo if no new file is provided

    if (req.file) {
      console.log("File received for upload:", req.file);

      // Step 2: Upload new file to GridFS and get the file details
      const filename = `${Date.now()}-${req.file.originalname}`; // New filename for the upload
      console.log(filename)

      // Upload file to GridFS and retrieve the file information
      const file = await uploadToGridFS(req.file.buffer, filename, req.file.mimetype);
      
      // Step 3: Use the file._id to update the photo path in the database
      if (file) {
        photo = `uploads/${file._id.toString()}`; // Store the GridFS file's ID as the photo path
        console.log("Updated photo path:", photo);
      }
    }

    // Step 4: Update the supervisor data with the new photo (or retain the old one if no new file is uploaded)
    const updatedsv = await supervisordata.findOneAndUpdate(
      { emailID },
      { $set: { nameofsv, orgName, photo } }, // Update supervisor's data
      { new: true, runValidators: true }
    );

    // Step 5: Send the updated supervisor data in the response
    res.json({ message: 'Supervisor updated successfully', updatedsv });
  } catch (error) {
    console.error("Error updating supervisor:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});




  
export default router;
  