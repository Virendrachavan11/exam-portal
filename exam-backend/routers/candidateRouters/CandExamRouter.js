import express from 'express';
import { candidatedata, Exam, supervisordata,resultData } from '../../models/examdb.js';


const router = express.Router();

router.get('/GetScheduleExam/:emailId', async (req, res) => {
  try {
    const { emailId } = req.params;

    const candidate = await candidatedata.findOne({ emailID: emailId });
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    const supervisor = await supervisordata.findOne({ emailID: candidate.createdby });
    if (!supervisor) return res.status(404).json({ message: 'Supervisor not found' });

    const groupScheduleIds = supervisor.studentGroups
      .filter(group => candidate.addedStudentGroups.includes(group._id.toString()))
      .flatMap(group => group.examschedules.map(id => id.toString()));

    const svSchedule = supervisor.exmSchedules
      .filter(es => groupScheduleIds.includes(es._id.toString()))
      .map(schedule => schedule.toObject());

    const scheduleIds = svSchedule.map(schedule => schedule._id.toString());
    const results = await resultData.find({ scheduleID: { $in: scheduleIds } });

    const UpdatedsvSchedules = svSchedule.map(schedule => ({
      ...schedule,
      status: results.some(result => result.scheduleID === schedule._id.toString()) ? "Completed" : "Pending"
    }));

    const examIds = [...new Set(svSchedule.flatMap(schedule => schedule.Exam))];
    const exams = await Exam.find({ _id: { $in: examIds } }, { examlang: 1, examTitle: 1, duration: 1 });

    candidate.examlist = exams;
    await candidate.save();

    res.status(200).json({ candidatedata: candidate, svSchedule: UpdatedsvSchedules, exams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/GetOnlyCandidateData/:emailId', async (req, res) => {


  try {
    const { emailId } = req.params;

    const candidate = await candidatedata.findOne({ emailID: emailId });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.status(200).json(
     candidate
    );
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  
});

router.post('/SubmitExam', async (req, res) => {
  try {
      const { candEID, ScheduleID, questions, scheduleName, scheduledTime, MarkPerQue,examTitle} = req.body;

      console.log(req.body);

      const candidate = await candidatedata.findOne({ emailID: candEID });
      if (!candidate) {
          console.log("Candidate not found");
          return res.status(404).json({ message: 'Candidate not found' });
      }


      const supervisor = await supervisordata.findOne({ emailID: candidate.createdby });
      if (!supervisor) {
          console.log("Supervisor not found");
          return res.status(404).json({ message: "Supervisor not found" });
      }

  
      const scheduleIndex = supervisor.exmSchedules.findIndex(sch => sch._id.toString() === ScheduleID.toString());
      if (scheduleIndex === -1) {
          console.log("Schedule not found");
          console.log(supervisor.exmSchedules);
          console.log(ScheduleID.toString(),scheduleName);
          return res.status(404).json({ message: "Schedule not found" });
      }


   
      const exam = await Exam.findById(req.body._id);
      if (!exam) {
          return res.status(404).json({ message: "Exam not found" });
      }

      const QueAndAns = exam.questions.map(q => ({
          questionID: q._id.toString(),
          ans: q.ans
      }));

      const correctAnswers = questions.reduce((count, q) => {
          const match = QueAndAns.find(qa => qa.questionID === q.questionID);
          return match && match.ans === q.givenAns ? count + 1 : count;
      }, 0);

      console.log("Number of correct answers:", correctAnswers);


      const submittedQuestions = questions.map(q => {
        const originalQuestion = exam.questions.find(eq => eq._id.toString() === q.questionID);
    
        return {
            questionID: originalQuestion._id,
            question: originalQuestion.Question,
            options: {
                option1: originalQuestion.option1,
                option2: originalQuestion.option2,
                option3: originalQuestion.option3,
                option4: originalQuestion.option4,
            },
            correctAns: originalQuestion.ans,
            givenAns: q.givenAns,
        };
    });


      let result = await resultData.findOne({ scheduleID: ScheduleID.toString() });

      if (!result) {
          result = new resultData({
              scheduleID: ScheduleID.toString(),
              scheduleName,
              scheduledTime,
              examTitle,
              totalMarks: MarkPerQue * questions.length,
              svEmailID: supervisor.emailID,
              CandData: []
          });
      }
      
      const existingCandidate = result.CandData.find(cand => cand.emailID === candEID);
      
      if (!existingCandidate) {
          result.CandData.push({
              emailID: candEID,
              nameofCand: candidate.nameofCand,
              rollNo: candidate.rollNo,
              marks: correctAnswers * MarkPerQue,
              submittedQuestions
          });
      
          await result.save();
      } else {
          console.log("Candidate already exists in the results.");
          return res.status(400).json({ message: "Exam is already submitted" })
      }
      

      res.status(200).json({ message: 'Exam submitted successfully' });

  } catch (error) {
      console.error("Error submitting exam:", error);
      res.status(500).json({ message: error.message });
  }
});



export default router;

  // const schedule = supervisor.exmSchedules.filter(sch=> sch._id.toString() === ScheduleID.toString() )

    // console.log("exmSchedules",supervisor.exmSchedules)
    // console.log("schedule",schedule)
       
    // if (!schedule) {
    //   console.log("sc not found")
    //   return res.status(404).json({ message: "Schedule not found" });
    // }