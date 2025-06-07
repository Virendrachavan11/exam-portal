import express from 'express';
import { User,candidatedata,supervisordata} from "../models/examdb.js";
import jsw from 'jsonwebtoken'

import { CandAccountCreationMail } from '../middleware/CandEmailService.js';
import crypto from 'crypto';
import { ResetPasswordMail } from '../middleware/AuthEmailServices.js';
import { SvAccountCreationMail } from '../middleware/SuperAdminEmailService.js';
import bcrypt from 'bcryptjs';
import upload,{ uploadToGridFS } from '../middleware/fileUploadimg.js';
import { GridFSBucket, ObjectId } from 'mongodb';
import mongoose from "mongoose";


const router = express.Router()


const createToken =(_id)=>
{
   return jsw.sign({_id},process.env.SECRET_KEY,{expiresIn:'3d'})
}


router.post('/login', async (req, res) => {

    const {EmailId,Password} = req.body 

    try {
    
        const user = await User.login(EmailId,Password)

        // create a Token
        const token = createToken(user._id)

        if(user.userType=="Supervisor"){

          const sv = await supervisordata.findOne({emailID:EmailId})

          res.status(200).json({user:user.EmailId,
                                token,
                                userType:user.userType,
                                nameofsv:sv.nameofsv,
                                orgName:sv.orgName,
                                photo:sv.photo
                                })
        }
        else{
          res.status(200).json({user:user.EmailId,token,userType:user.userType})
        }

        
    
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    

})

router.post('/signup', upload.single('photo'), async (req, res) => {

    const {EmailId,Password,nameofCand,rollNo,createdby,nameofuser,org,ContactNumber} = req.body //nameofsv,orgName,

      try {
    
        
        // const photo = req.file ? req.file.path : 'assets/default.png';

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

        // create a Token
        
        const cbShort=createdby?.replace(/['"]+/g, "")

        // res.status(200).json({EmailId,token,userType})

        if(createdby)
          {

            const cuser = await User.findOne({EmailId:cbShort})

            if (cuser.userType === "Supervisor") {
              try {
                const userType = "Candidate";
            
                const user = await User.signup(EmailId, Password, userType);
            
                const newCandidate = new candidatedata({
                  emailID: EmailId,
                  nameofCand,
                  rollNo,
                  createdby: cbShort,
                  photo
                });
                await newCandidate.save();
            
                await CandAccountCreationMail(EmailId, nameofCand, Password);
            
                res.status(200).json({
                  message: "Candidate account added successfully.",
                  candidate: newCandidate
                });
              } catch (error) {
                console.log(error.message )
                res.status(500).json({
                  message: error.message
                });
                
              }
            }
            


            if(cuser.userType=="Admin"){

                const userType = "Supervisor"
                const user = await User.signup(EmailId,Password,userType)
                const token = createToken(user._id)

               


                const  svinfo = new supervisordata({
                  emailID:EmailId ,
                  nameofsv: nameofuser,
                  orgName: org,
                  createdby:cbShort,
                  photo:photo,
                  ContactNumber:ContactNumber,
                  exmSchedules:[],
                  studentGroups:[]
                });
                await svinfo.save();

                const newSv = await supervisordata.findById(svinfo._id);

                await SvAccountCreationMail (EmailId, nameofuser, Password);

                res.status(200).json({ message: "Supervisor Created Successfully", newSv: newSv  });



              
            }


          }
    
      } catch (error) {
        res.status(500).json({ message: error.message });
        
      }


    
    })


    router.delete('/delete-user/:uId/', async (req, res) => {
      const { examId } = req.params;
      try {
        await Exam.findByIdAndDelete(examId);
        res.json({ message: 'exam deleted' });
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    })


    
    router.post('/forgotPassword', async (req, res) => {
      const { emailID } = req.body;

      console.log(emailID )
    
      try {
        const user = await User.findOne({ EmailId: emailID });
    
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        let uname; // ✅ Declared variable to store user's name
    
        if (user.userType === "Supervisor") {
          const svData = await supervisordata.findOne({ emailID });
    
          if (!svData) {
            return res.status(404).json({ message: "Supervisor data not found" });
          }
    
          uname = svData.nameofsv; // ✅ Correctly assigning supervisor's name
        } 
        else if (user.userType === "Candidate") {
          const candData = await candidatedata.findOne({ emailID });
    
          if (!candData) {
            return res.status(404).json({ message: "Candidate data not found" });
          }
    
          uname = candData.nameofCand; // ✅ Correctly assigning candidate's name
        }
    
        // ✅ Log to debug if needed
        console.log("Sending ResetPasswordMail to:", emailID, "Name:", uname);
    
        // ✅ Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    
        // ✅ Save OTP & expiry to user model
        user.resetOtp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
    
        // ✅ Send Email (main fix — using `uname`)
        await ResetPasswordMail(emailID, uname, otp);
    
        res.status(200).json({ message: "OTP sent to email!" });
    
      } catch (err) {
        console.error("Error in /forgotPassword:", err.message);
        res.status(500).json({ message: "Internal server error", error: err.message });
      }
    });
    

router.post("/reset-password", async (req, res) => {
  try {
    const { emailId, otp, newPassword } = req.body;
  
    const user = await User.findOne({ EmailId: emailId });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

 
    if (user.resetOtp !== otp || Date.now() > new Date(user.otpExpiry).getTime()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);


    user.Password = hashedPassword;
    user.resetOtp = null; // Clear OTP
    user.otpExpiry = null;

    await user.save(); 

    return res.json({ message: "Password reset successful!" });

  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;


// router.post("/verify-otp", async (req, res) => {
//   const { emailID, otp } = req.body;
//   const user = await User.findOne({ emailID });

//   if (!user || user.resetOtp !== otp || Date.now() > user.otpExpiry) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//   }

//   res.json({ message: "OTP verified successfully!" });
// });