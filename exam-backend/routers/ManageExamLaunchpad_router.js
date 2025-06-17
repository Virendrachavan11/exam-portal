import express from 'express';
import { Exam,supervisordata,candidatedata} from "../models/examdb.js";

const router = express.Router()


router.get('/candidate-groups/:SvUser', async(req, res) => {

   
  try {
    const sv = await supervisordata.findOne({ emailID: req.params.SvUser });
    if (!sv) return res.status(404).json({ message: "Supervisor not found" });
    res.status(200).json(sv.studentGroups);
  } catch (error) {
    res.status(500).json({ message: "Groups Not Found" });
  }

})

router.post('/candidate-groups/Create-group/:SvUser', async (req, res) => {
    try {
      const sv = await supervisordata.findOne({ emailID: req.params.SvUser });
      if (!sv) return res.status(404).json({ message: "Supervisor not found" });
  
      const { groupName, selectedCandidates, examschedules } = req.body;
  
      // Push new group
      sv.studentGroups.push({
        groupName: groupName,
        selectedCandidates: selectedCandidates,
        examschedules: examschedules
      });
  
      await sv.save();
  
      // Get the newly added group
      const createdGroup = sv.studentGroups[sv.studentGroups.length - 1];
  
      // Update each candidate's addedStudentGroups field
      const candidateIds = selectedCandidates.map(candidate => candidate._id);
  
      await candidatedata.updateMany(
        { _id: { $in: candidateIds } },
        { $push: { addedStudentGroups: createdGroup._id } }
      );
  
      // ✅ Send response
      res.status(200).json({
        message: "Group created successfully",
        newGroup: createdGroup
      });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  


// router.post('/candidate-groups/Create-group/:SvUser', async (req, res) => {
//     try {
//         const sv = await supervisordata.findOne({ emailID: req.params.SvUser });
//         if (!sv) return res.status(404).json({ message: "Supervisor not found" });

//         const { groupName, selectedCandidates, examschedules } = req.body;


//         const newGroup = new studentGroupdata({
//             groupName,
//             selectedCandidates,
//             examschedules
//         });

//         await newGroup.save();

//         sv.studentGroups.push(newGroup._id);
//         await sv.save();

//         await candidatedata.updateMany(
//             { _id: { $in: selectedCandidates } },
//             { $push: { addedStudentGroups: newGroup._id } }
//         );

//         res.status(201).json({ message: "Group created and updated in candidates", group: newGroup });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

router.put('/candidate-groups/update-group/:SvUser/:candGroupID', async (req, res) => {
    try {
        const sv = await supervisordata.findOne({ emailID: req.params.SvUser });
        if (!sv) return res.status(404).json({ message: "Supervisor not found" });

        const { groupName,selectedCandidates,examschedules} = req.body;

        const group = sv.studentGroups.id(req.params.candGroupID);
        if (!group) return res.status(404).json({ message: "Group not found" });

        const removedCandidates=group.selectedCandidates.filter(
            CandID => !selectedCandidates.includes(CandID)
        );

        await candidatedata.updateMany(
            { _id: { $in: removedCandidates} },
            { $pull: { addedStudentGroups: group._id }, }
        );

        group.groupName = groupName;
        group.selectedCandidates=selectedCandidates;
        group.examschedules=examschedules;
   

        await sv.save();


        await candidatedata.updateMany(
            { _id: { $in: selectedCandidates} },
            { $push: { addedStudentGroups: group._id } }
        );  

        res.status(200).json({ message: "Group updated successfully!", updatedGroup: group });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/candidate-groups/delete-group/:SvUser/:candGroupID', async (req, res) => {
    try {
        const sv = await supervisordata.findOne({ emailID: req.params.SvUser });
        if (!sv) return res.status(404).json({ message: "Supervisor not found" });

        // Find the group object instead of filtering an array
        const CandGrp = sv.studentGroups.find(group => group._id.toString() === req.params.candGroupID);
        if (!CandGrp) return res.status(404).json({ message: "Group not found" });

        // Remove the group from studentGroups array
        sv.studentGroups = sv.studentGroups.filter(group => group._id.toString() !== req.params.candGroupID);
        await sv.save(); 

        // Remove the group reference from candidates
        await candidatedata.updateMany(
            { _id: { $in: CandGrp.selectedCandidates } },  // Accessing the correct selectedCandidates array
            { $pull: { addedStudentGroups: CandGrp._id } } // Remove the deleted group from candidates
        );

        res.status(200).json({ message: "Group deleted successfully!" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/candidate-groups/add-candidates/:SvUser/:candGroupID', async (req, res) => {
    try {
        const sv = await supervisordata.findOne({ emailID: req.params.SvUser });
        if (!sv) return res.status(404).json({ message: "Supervisor not found" });

        const candGroup = sv.studentGroups.id(req.params.candGroupID);
        if (!candGroup) return res.status(404).json({ message: "Candidate/Student Group not found" });

        let candidates = req.body.candidates; 
        if (!Array.isArray(candidates)) {
            candidates = [candidates]; 
        }

        candidates.forEach(cand => {
            const { CandID } = cand; 
            if (!candGroup.selectedCandidates.includes(CandID)) {
                candGroup.selectedCandidates.push(CandID);
            }
        });

       

        await sv.save(); 
        res.status(201).json({ message: "Candidates/Students added successfully!", updatedGroup: candGroup });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.delete('/candidate-groups/remove-candidates/:SvUser/:candGroupID', async (req, res) => {
    try {
        const sv = await supervisordata.findOne({ emailID: req.params.SvUser });
        if (!sv) return res.status(404).json({ message: "Supervisor not found" });

        const candGroup = sv.studentGroups.id(req.params.candGroupID);
        if (!candGroup) return res.status(404).json({ message: "Candidate/Student Group not found" });

        let candidates = req.body.candidates;
        if (!Array.isArray(candidates)) {
            candidates = [candidates];
        }

        candGroup.selectedCandidates = candGroup.selectedCandidates.filter(
            CandID => !candidates.includes(CandID)
        );

        await sv.save();
        res.status(200).json({ message: "Candidates removed successfully!", updatedGroup: candGroup });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



router.get('/exam-schedules/:SvUser', async (req, res) => {
    try {
        const sv = await supervisordata.findOne({ emailID: req.params.SvUser });
        if (!sv) return res.status(404).json({ message: "Supervisor not found" });

        res.status(200).json(sv.exmSchedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




router.post('/exam-schedules/Create-schedules/:SvUser', async (req, res) => {
    try {
        const sv = await supervisordata.findOne({ emailID: req.params.SvUser });
        if (!sv) return res.status(404).json({ message: "Supervisor not found" });

        const { scheduleName, scheduledTime, Exam, candGroups } = req.body;

        if (!scheduleName || !scheduledTime || !Exam) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newSchedule = {
            scheduleName: scheduleName,
            Exam: Exam,
            scheduledTime: scheduledTime,
            candGroups: candGroups || []
        };

        sv.exmSchedules.push(newSchedule);
        await sv.save();

        const createdSdl = sv.exmSchedules[sv.exmSchedules.length - 1];

        res.status(200).json({
            message: "Schedule created successfully",
            schedule: createdSdl 
        });
    } catch (error) {
        console.error("Error creating schedule:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});





router.put('/exam-schedules/update-schedule/:SvUser/:esID', async (req, res) => {
    try {
        const sv = await supervisordata.findOne({ emailID: req.params.SvUser });
        if (!sv) return res.status(404).json({ message: "Supervisor not found" });

        const { scheduleName, scheduledTime, Exam, candGroups, CameraStatus } = req.body;

        if (!scheduleName || !scheduledTime || !Exam) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const es = sv.exmSchedules.id(req.params.esID);
        if (!es) return res.status(404).json({ message: "Schedule not found" });

        es.scheduleName = scheduleName;
        es.scheduledTime = scheduledTime;
        es.Exam = Exam;
        es.CameraStatus = CameraStatus;
        es.candGroups = candGroups || [];

        await sv.save();

        res.status(200).json({ 
            message: "Schedule updated successfully!", 
            schedule: {
                _id: es._id,
                scheduleName: es.scheduleName,
                scheduledTime: es.scheduledTime,
                Exam: es.Exam,
                candGroups: es.candGroups
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});



router.delete('/exam-schedules/delete-schedule/:SvUser/:esID', async (req, res) => {
    try {
        const { SvUser, esID } = req.params;

        // Find the supervisor and remove the schedule using $pull
        const updatedSupervisor = await supervisordata.findOneAndUpdate(
            { emailID: SvUser },
            { $pull: { exmSchedules: { _id: esID } } },  // Remove the schedule from the array
            { new: true } // Return the updated supervisor document
        );

        // if (!updatedSupervisor) {
        //     return res.status(404).json({ message: "Supervisor or schedule not found" });
        // }

        res.status(200).json({message: "Schedule deleted successfully!"});
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});











// router.post("/add-candGroups", async (req, res) => {
//     try {
//         const { examScheduleId, studentGroupIds } = req.body; 

//         // Ensure studentGroupIds is an array
//         if (!Array.isArray(studentGroupIds) || studentGroupIds.length === 0) {
//             return res.status(400).json({ message: "Invalid student group IDs" });
//         }

//         // Find the exam schedule
//         const examSchedule = await ExamSchedule.findById(examScheduleId);
//         if (!examSchedule) {
//             return res.status(404).json({ message: "Exam schedule not found" });
//         }

//         // Find all student groups
//         const studentGroups = await StudentGroup.find({ _id: { $in: studentGroupIds } });
//         if (studentGroups.length !== studentGroupIds.length) {
//             return res.status(404).json({ message: "One or more student groups not found" });
//         }

//         // Add student groups to the exam schedule (avoid duplicates)
//         studentGroupIds.forEach(id => {
//             if (!examSchedule.candGroups.includes(id)) {
//                 examSchedule.candGroups.push(id);
//             }
//         });

//         await examSchedule.save();

//         res.status(200).json({ message: "Candidate groups added successfully", examSchedule });

//     } catch (error) {
//         res.status(500).json({ message: "Server error", error });
//     }
// });

export default router;