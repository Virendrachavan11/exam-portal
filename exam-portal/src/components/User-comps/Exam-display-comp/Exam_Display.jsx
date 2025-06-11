import React, { useEffect, useState,useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setNewExam , startTimer, stopTimer, tick, resetExamInfo } from "../../../features/ExamMmtSlice";
import { useLocation } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import Software_logo from "../../../assets/Software_logo.png"
import { ResetQueCount} from '../../../features/QueStatusSlice';


import QueDisplay from "./QueDisplay";
import UpperExamPart from "./UpperExamPart";
import QueStatusBar from "./QueStatusBar";


const Exam_Display = ({ LogedUser }) => {
  const { id,sid } = useParams();
  const [Exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Candloading, setCandloading] = useState(true);
  const [CandInfo, setCandInfo] = useState(null);
  const [CountDowntime, setCountDowntime] = useState(""); 
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmit, setexamSubmit] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const ExamData = useSelector((state) => state.examMmt.examinfos) || null;
  const ScheduleData = location.state?.ScheduleData
  const isRunningTime = useSelector((state) => state.examMmt.isRunningTime)
  const nowTime = new Date()
  const ScTime = new Date(ScheduleData.scheduledTime)


  useEffect(() => {
  const prevSize = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  let resizeTimeout;

  const handleVisibilityChange = () => {
    if (document.hidden) {
      setWarningMessage("Tab switch is not allowed during the exam.");
      setShowWarning(true);
    }
  };

  const handleResize = () => {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      const widthDiff = Math.abs(prevSize.current.width - currentWidth);
      const heightDiff = Math.abs(prevSize.current.height - currentHeight);

      // Only trigger warning if real significant size change
      if (widthDiff > 100 || heightDiff > 100) {
        setWarningMessage("Window resizing is not allowed during the exam.");
        setShowWarning(true);
      }

      prevSize.current = {
        width: currentWidth,
        height: currentHeight,
      };
    }, 300); // debounce: wait 300ms
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("resize", handleResize);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("resize", handleResize);
    clearTimeout(resizeTimeout);
  };
}, []);



  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault(); // Disable right-click
    };
  
    const handleKeyDown = (e) => {
      // Block F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "C", "J"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toLowerCase() === "u")
      ) {
        e.preventDefault();
      }
    };
  
    const handleCopy = (e) => {
      e.preventDefault(); // Prevent copying
      setWarningMessage("Copying text is not allowed during the exam.");
      setShowWarning(true);
    };
  
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("copy", handleCopy);
  
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("copy", handleCopy);
    };
  }, []);

  

  

  useEffect(() => {
    const fetchCandidateData = async () => {
      if (!LogedUser?.user) return;
      try {
        const response = await fetch(
          `http://localhost:3000/Candidate-exam/GetOnlyCandidateData/${LogedUser.user}`
        );
        const data = await response.json();
        setCandInfo(data);
      } catch (error) {
        console.error("Error fetching candidate data:", error);
      } finally {
        setCandloading(false);
      }
    };

    fetchCandidateData();
  }, [LogedUser?.user]);

  const shuffleQuesInPlace = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  useEffect(() => {
    if (!CandInfo || !CandInfo.examlist?.includes(id)) {
      setLoading(false);
      return;
    }

    if (ExamData && String(ExamData._id) === String(id) && ExamData.candEID === LogedUser.user) {
      setExam(ExamData);
      
      if(nowTime >= ScTime)
        {
          setQuestions(ExamData.questions);
        }else
        {
          setQuestions([]);
        }
        
      setLoading(false);
      return;
    }

    const fetchExam = async () => {
      try {
        const response = await fetch(`http://localhost:3000/exam/${id}`);
        let data = await response.json();

        data.questions = data.questions.map(({ ans, ...rest }) => ({
          ...rest,  
          givenAns: null  
      }));

        data.questions = shuffleQuesInPlace(data.questions);
        data.candEID = LogedUser.user;
        data.TimeLeft = data.examDuration*60;
        data.ScheduleID = ScheduleData._id;
        data.scheduleName =ScheduleData.scheduleName;
        data.scheduledTime = ScheduleData.scheduledTime;
        
        setExam(data);
        dispatch(setNewExam(data));
        

      } catch (error) {
        console.error("Error fetching exam data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [ CandInfo,sid, dispatch,ExamData, LogedUser.user]);



  const SubmitExam = async () => {


    const { questions, ...rest } = ExamData; 

    const updatedExamData = {
      ...rest, 
      questions: questions.map(q => ({
        questionID: q._id,
        givenAns: q.givenAns || null 
      }))
    };
    

    try {
      const response = await fetch(`http://localhost:3000/Candidate-exam/SubmitExam`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedExamData),
      });
  
      if (response.ok) {


        dispatch(resetExamInfo())
        dispatch(ResetQueCount())
        toast.success("Exam Submitted Successfully");
  

      } else {
        setTimeout(() => {
          
          navigate("/exam");
        }, 1000);
        toast.error("Failed to Submit Exam");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while submitting the exam");
    }

    
  };


  useEffect(() => {
    let interval;
    if (isRunningTime && ExamData && ExamData.TimeLeft > 0) {
      interval = setInterval(() => {
        dispatch(tick());
      }, 1000);
    } else if (ExamData && ExamData.TimeLeft === 0) {
      dispatch(stopTimer()); 
      SubmitExam()
    }
  
    return () => clearInterval(interval);
  }, [isRunningTime, ExamData, dispatch]);
  

  useEffect(() => {
    if (!ScheduleData.scheduledTime) return; // Prevent running if no scheduled time

    const updateCountdown = () => {
      const now = new Date();
      const examTime = new Date(ScheduleData.scheduledTime);
      const diff = examTime - now;

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountDowntime(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
        );
      } else {
        setExamStarted(true);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [ScheduleData.scheduledTime]); 


  if (loading || Candloading) {
    return <div>Loading...</div>;
  }

  if (!Exam) {
    return <div>Exam not found or not accessible.</div>;
  }

  const convertMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours} H : ${mins} M`;
  };


  const handleEndExam = () => {
    dispatch(stopTimer());
    navigate("/exam/End-Exam");
  };
  

  const convertedTime = ExamData ? convertMinutes(ExamData.examDuration) : "0 H : 0 M";





  return (
    <div
      className="w-full h-screen max-md:h-[200vh] grid grid-cols-4 grid-rows-4 max-md:grid-rows-6 col-end-4 
                 gap-2 p-2 max-sm:h-[250vh] max-sm:grid-rows-8"
    >
      <UpperExamPart examInfo={Exam} CandInfo={CandInfo} Candloading={Candloading} />
      <QueStatusBar examQues={questions || []} Etype={Exam.examType} />
      <QueDisplay examQues={questions || []} examInfo={Exam} Duration={convertedTime} TimeLeft={ExamData ? ExamData.TimeLeft : 0} stopTimer={stopTimer} handleEndExam={handleEndExam} SubmitExam={SubmitExam}/>
      


    
      {!isRunningTime && (
        <div className="z-30 fixed bg-gray-100 h-full w-full flex">
          <div className="h-full w-1/3 flex items-center justify-center">
            <img
              src={Software_logo}
              alt="PI Exam Logo"
              className="aspect-square h-1/2 bg-white p-5 rounded-md"
            />
          </div>

          <div className="h-full w-2/3 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-orange-500 py-7">Instructions for the Exam</h1>
            <ol className="list-decimal pl-5 space-y-5 flex-col justify-between">
              <li>
                  On the side of the exam display, you will see a collection of circles representing the
                exam questions:
                <ul className="list-disc pl-5">
                  <li>
                    <span className="font-semibold">White circle:</span> Represents the current question.
                  </li>
                  <li>
                    <span className="font-semibold">Green circle:</span> Indicates that the question has
                    been answered.
                  </li>
                  <li>
                    <span className="font-semibold">Red circle:</span> Signifies that the question has not
                    been answered.
                  </li>
                </ul>
              </li>

              <li>
                The <span className="font-semibold">"End and Submit Exam"</span> button is available on
                the last question of the exam. If you do not complete all the questions within the given
                time, the exam will <span className="font-semibold">automatically submit</span> when the
                timer runs out.
              </li>

              <li>
                In case of an <span className="font-semibold">emergency</span>, such as accidental exam
                closure or system shutdown, your progress will be
                <span className="font-semibold"> automatically saved</span>. However, do not attempt to
                open another exam from your portal or machine until the issue is resolved.
              </li>
            </ol>

            <div className="flex flex-col items-center justify-center py-5">
              <p className="font-semibold">Your Exam Starts In</p>
              <button
                className="bg-orange-500 text-white text-xl w-1/3 p-3 rounded-md cursor-pointer"
                onClick={() => {
                  if (examStarted) {
                    dispatch(startTimer());
                    setQuestions(Exam.questions);
                  }
                }}
                disabled={!examStarted} // Disables button until exam starts
              >
                {examStarted ? "Click Here To Start Exam" : CountDowntime}
              </button>
            </div>
          </div>
        </div>
      )}


  {showWarning && (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-5 rounded-lg shadow-md w-[90%] max-w-md text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">⚠️ Warning</h2>
        <p className="text-gray-700">{warningMessage}</p>
        <button
          onClick={() => setShowWarning(false)}
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Okay
        </button>
      </div>
    </div>
  )}

    </div>
  );
};

export default Exam_Display;
