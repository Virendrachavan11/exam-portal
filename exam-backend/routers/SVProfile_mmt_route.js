import express from 'express';
import {supervisordata,User} from "../models/examdb.js";
import upload from '../middleware/fileUploadimg.js';

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
  
      const existingsv = await supervisordata.findOne({ emailID });
  
      if (!existingsv) {
        return res.status(404).json({ message: 'Supervisor not found' });
      }
  
      let photo = existingsv.photo;
  
      if (req.file) {
        const oldPhotoPath = path.join(__dirname, '..', photo);
        
        if (fs.existsSync(oldPhotoPath) && !photo.includes("default")) {
          fs.unlink(oldPhotoPath, (err) => {
            if (err) {
              console.error("Failed to delete old supervisor photo:", err.message);
            } else {
              console.log("Old supervisor photo deleted:", photo);
            }
          });
        }
  
        photo = req.file.path;
      }
  
      const updatedsv = await supervisordata.findOneAndUpdate(
        { emailID },
        { $set: { nameofsv, orgName, photo } },
        { new: true, runValidators: true }
      );
  
      res.json({ message: 'Supervisor updated successfully', updatedsv });
    } catch (error) {
      console.error("Error updating supervisor:", error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  

  
export default router;
  