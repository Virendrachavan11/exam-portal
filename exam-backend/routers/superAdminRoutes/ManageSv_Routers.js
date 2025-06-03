import express from 'express';
import { User, Exam, supervisordata,resultData,candidatedata } from '../../models/examdb.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





const router = express.Router();



router.get('/SV-list/:createdby', async (req, res) => {
  const { createdby } = req.params;

  const candidateCount = await candidatedata.countDocuments();


  try {
    const Sv_list = await supervisordata.find({ createdby:createdby });
    res.status(200).json({Sv_list,candidateCount});
    
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Candidates', error: err.message });
  }
});


router.delete('/SV-delete/:id/:emailID', async (req, res) => {
  const { id, emailID } = req.params;

  try {
    // Delete Supervisor's user login
    const deletedUser = await User.findOneAndDelete({ EmailId: emailID });
    if (!deletedUser) {
      return res.status(404).json({ message: "Supervisor's user credentials not found" });
    }

    // Delete Supervisor data
    const deletedSupervisor = await supervisordata.findByIdAndDelete(id);
    if (!deletedSupervisor) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    // Delete supervisor's photo
    if (deletedSupervisor.photo) {
      const supervisorPhotoPath = path.join(__dirname, '../..', deletedSupervisor.photo);
      fs.unlink(supervisorPhotoPath, (err) => {
        if (err) {
          console.error('Failed to delete supervisor photo:', err.message);
        } else {
          console.log('Supervisor photo deleted:', deletedSupervisor.photo);
        }
      });
    }

    // 🔥 Delete all Exams created by the supervisor
    const exams = await Exam.find({ createdby: emailID });

    for (const exam of exams) {
      for (const question of exam.questions) {
        if (question.photo) {
          const photoPath = path.join(__dirname, '../..', question.photo);
          fs.unlink(photoPath, (err) => {
            if (err) {
              console.error('Failed to delete question photo:', err.message);
            }
          });
        }
      }
      await Exam.findByIdAndDelete(exam._id);
    }

  

    // Delete all candidates created by the supervisor
    const candidates = await candidatedata.find({ createdby: emailID });

    for (const candidate of candidates) {
      await User.findOneAndDelete({ EmailId: candidate.emailID });

      if (candidate.photo) {
        const candidatePhotoPath = path.join(__dirname, '../..', 'uploads', path.basename(candidate.photo));
        fs.unlink(candidatePhotoPath, (err) => {
          if (err) {
            console.error(`Failed to delete photo of candidate ${candidate.emailID}:`, err.message);
          } else {
            console.log(`Photo deleted for candidate ${candidate.emailID}:`, candidate.photo);
          }
        });
      }
    }

    const deletedCandidates = await candidatedata.deleteMany({ createdby: emailID });

    //Delete all result data created by the supervisor
    const deletedResults = await resultData.deleteMany({ svEmailID: emailID });
    console.log(`${deletedResults.deletedCount} result records deleted.`);

    res.status(200).json({
      message: 'Supervisor, user, exams, candidates, and their users/photos deleted successfully',
      deletedCandidatesCount: deletedCandidates.deletedCount,
    });

  } catch (err) {
    console.error('Error in SV-delete:', err);
    res.status(500).json({ message: 'Error deleting supervisor', error: err.message });
  }
});







export default router;
