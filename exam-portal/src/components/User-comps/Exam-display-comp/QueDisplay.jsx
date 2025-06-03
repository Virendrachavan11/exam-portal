import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextQue, preQue } from '../../../features/QueStatusSlice';
import toast from 'react-hot-toast';
import {Image} from 'lucide-react';
import { useNavigate } from "react-router-dom";

import { updateQuestionInfo } from "../../../features/ExamMmtSlice";


const QueDisplay = ({ examQues, examInfo, Duration,TimeLeft,stopTimer,SubmitExam,handleEndExam }) => {
  const [fontSize, setFontSize] = useState(16);
  const QueIndex = useSelector((state) => state.currentIndex.value);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false); // for end exam
  const navigate = useNavigate();

  const maxFontSize = 20;
  const minFontSize = 12;

  const handleIncreaseFont = () => {
    if (fontSize < maxFontSize) {
      setFontSize((prev) => prev + 2);
    } else {
      toast.error('Maximum font size reached!',

        {
          style: {
            border: '1px solid #713200',
            padding: '16px',
            color: '#713200',
          },
          duration: 800,
        }); 
    }
  };

  const handleDecreaseFont = () => {
    if (fontSize > minFontSize) {
      setFontSize((prev) => prev - 2);
    } else {
      toast.error('Minimum font size reached!',

        {
          style: {
            border: '1px solid #713200',
            padding: '16px',
            color: '#713200',
          },
          duration: 800,
        }
        
      ); 
    }
  };

  const handleNextQue = () => {
    dispatch(nextQue());
  };

  const handlePreQue = () => {
    dispatch(preQue());
  };

  const handleOptionChange = (event) => {
    const value = event.target.value;

    dispatch(updateQuestionInfo({QueIndex,value}))

    
    console.log("Submitted value:", value);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // const handleEndExam = () => {
  //   dispatch(stopTimer());
  //   setShowPopup(false); 
  //   navigate("/exam/End-Exam");
  // };

  return (
    <div className='w-full h-full row-start-2 row-end-5 col-start-1 col-end-4 max-md:col-end-5 bg-white shadow-sm rounded-md border-t-4 border-orange-500 max-sm:row-start-3 max-sm:row-end-7 grid grid-cols-4 grid-rows-8 max-sm:grid-rows-12 max-sm:text-xs'>
      <div className='row-start-1 row-end-2 col-start-1 col-end-5 grid grid-cols-13 max-lg:text-xs gap-1 p-1 max-sm:row-end-3 max-sm:grid-cols-6 max-sm:grid-rows-2'>
        <div className='bg-orange-500 text-white font-semibold rounded-md col-start-1 col-end-4 flex justify-center items-center max-sm:row-start-1 max-sm:row-end-2 max-sm:col-start-1 max-sm:col-end-3'>
          Question No : {QueIndex + 1}
        </div>
        <div className='bg-orange-500 text-white font-semibold rounded-md col-start-4 col-end-7 flex justify-center items-center max-sm:row-start-1 max-sm:row-end-2 max-sm:col-start-3 max-sm:col-end-5'>
          Total Marks : {examInfo.MarkPerQue * examInfo.questions.length}
        </div>
        <div className='bg-orange-500 text-white font-semibold rounded-md col-start-7 col-end-10 flex justify-center items-center max-sm:row-start-1 max-sm:row-end-2 max-sm:col-start-5 max-sm:col-end-7'>
          Duration - {Duration}
        </div>
        <div className='bg-orange-500 text-white font-semibold rounded-md col-start-10 col-end-13 flex justify-center items-center max-sm:row-start-2 max-sm:row-end-3 max-sm:col-start-1 max-sm:col-end-5'>
          Time Left - {formatTime(TimeLeft)}
        </div>
        <div className='bg-orange-500 text-white font-semibold rounded-md col-start-13 col-end-14 flex justify-center items-center max-sm:row-start-2 max-sm:row-end-3 max-sm:col-start-5 max-sm:col-end-7'>
          Mark : {examInfo.MarkPerQue}
        </div>
      </div>

      <div id='Qtext' className='col-start-1 col-end-3 row-start-2 row-end-7 m-3 max-sm:row-start-3 max-sm:row-end-7 max-sm:col-end-5' style={{ fontSize: `${fontSize}px` }}>
        <p className='font-semibold mb-3'>
          <span className='mr-2'> Q.</span>{examQues[QueIndex]?.Question}
        </p>
        <div className='flex justify-start'>
          <table className='min-w-4/5 border-collapse'>
            <tbody>
              <tr>
                <td className='text-left py-2'>(A)</td>
                <td className='text-left p-2'>{examQues[QueIndex]?.option1}</td>
              </tr>
              <tr>
                <td className='text-left py-2'>(B)</td>
                <td className='text-left p-2'>{examQues[QueIndex]?.option2}</td>
              </tr>
              <tr>
                <td className='text-left py-2'>(C)</td>
                <td className='text-left p-2'>{examQues[QueIndex]?.option3}</td>
              </tr>
              <tr>
                <td className='text-left py-2'>(D)</td>
                <td className='text-left p-2'>{examQues[QueIndex]?.option4}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className='col-start-3 col-end-5 row-start-2 row-end-7 m-3 max-sm:row-start-6 max-sm:row-end-10 max-sm:col-start-1 max-sm:col-end-5' style={{ fontSize: `${fontSize}px` }}>
        <p className='font-semibold mb-3'>
          <span className='mr-2'>प्र.</span>{examQues[QueIndex]?.QueTrans}
        </p>
        <div className='flex justify-start'>
          <table className='min-w-4/5 border-collapse'>
            <tbody>
              <tr>
                <td className='text-left py-2'>(A)</td>
                <td className='text-left p-2'>{examQues[QueIndex]?.option1t}</td>
              </tr>
              <tr>
                <td className='text-left py-2'>(B)</td>
                <td className='text-left p-2'>{examQues[QueIndex]?.option2t}</td>
              </tr>
              <tr>
                <td className='text-left py-2'>(C)</td>
                <td className='text-left p-2'>{examQues[QueIndex]?.option3t}</td>
              </tr>
              <tr>
                <td className='text-left py-2'>(D)</td>
                <td className='text-left p-2'>{examQues[QueIndex]?.option4t}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* View Image Button */}
      {examQues[QueIndex]?.photo && (
        
          <button
            onClick={() => setIsModalOpen(true)}
            className='col-start-1 col-end-2 row-start-7 row-end-8 max-sm:row-start-9 max-sm:row-end-10 max-sm:col-start-1 max-sm:col-end-3 p-2  w-2/3  bg-gray-50 text-black font-semibold rounded-md
            border-2 border-black active:bg-gray-100 transition flex justify-between items-center mx-1'
          >
            <Image size={30}/> View Image
          </button>

      )}

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-lg relative h-1/2 aspect-square ">
            <button
              onClick={() =>{setIsModalOpen(false); } }

              className="absolute top-2 right-2 text-gray-700 text-xl font-bold hover:text-red-600"
            >
              &times;
            </button>
            <img
              src={`http://localhost:3000/${examQues[QueIndex]?.photo}`}
              alt="Question"
              className="h-full rounded-md aspect-square object-cover "
            />
          </div>
        </div>
      )}

      

      <form className='col-start-1 col-end-2 row-start-8 row-end-9 flex space-x-3 bg-orange-500 text-white font-semibold justify-between rounded-md p-3 m-1 max-sm:row-start-11 max-sm:row-end-12 max-sm:col-start-1 max-sm:col-end-5'>
        <div className='flex items-center space-x-1'>
          <input type='radio' id='option1' name='options' value='1'
          checked={examQues[QueIndex]?.givenAns === "1" || false} 
          onChange={handleOptionChange}/>
          <label htmlFor='option1'>A</label>
        </div>
        <div className='flex items-center  space-x-1'>
          <input type='radio' id='option2' name='options' value='2'  onChange={handleOptionChange} checked={examQues[QueIndex]?.givenAns === "2" || false} />
          <label htmlFor='option2'>B</label>
        </div>
        <div className='flex items-center  space-x-1'>
          <input type='radio' id='option3' name='options' value='3'  onChange={handleOptionChange}  checked={examQues[QueIndex]?.givenAns === "3" || false} />
          <label htmlFor='option3'>C</label>
        </div>
        <div className='flex items-center  space-x-1'>
          <input type='radio' id='option4' name='options' value='4'  onChange={handleOptionChange}  checked={examQues[QueIndex]?.givenAns === "4" || false} />
          <label htmlFor='option4'>D</label>
        </div>
      </form>

      <div className='col-start-2 col-end-4 row-start-8 row-end-9 flex justify-evenly items-center max-sm:row-start-12 max-sm:row-end-13 max-sm:col-start-1 max-sm:col-end-3'>
        <button onClick={handlePreQue} disabled={QueIndex === 0} className='w-[48%] h-5/6 border-[1px] border-orange-500 rounded-md text-orange-500 font-semibold hover:bg-gray-200'>
          &larr; Back
        </button>

        <button
        onClick={() => {
          if (QueIndex === examQues.length - 1) {
            setShowPopup(true); // Show popup on the last question
          } else {
            handleNextQue(); // Move to the next question
          }
        }}
        className={`w-[48%] h-5/6 border-[1px] rounded-md font-semibold 
          ${QueIndex === examQues.length - 1 
            ? "bg-green-500 text-white border-green-600 hover:bg-green-600" 
            : "border-orange-500 text-orange-500 hover:bg-gray-200"}`}
      >
        {QueIndex === examQues.length - 1 ? "End and Submit Exam" : "Next →"}
      </button>


      </div>

      <div className='col-start-4 col-end-5 row-start-8 row-end-9 flex justify-evenly items-center max-sm:row-start-12 max-sm:row-end-13 max-sm:col-start-3 max-sm:col-end-5'>
        <button onClick={handleIncreaseFont} className='w-[48%] h-5/6 border-[1px] bg-blue-500 text-white font-medium text-xl rounded-md hover:bg-gray-200'>
          A ++
        </button>
        <button onClick={handleDecreaseFont} className='w-[48%] h-5/6 border-[1px] bg-blue-500 text-white font-medium text-xl rounded-md hover:bg-gray-200'>
          A --
        </button>
      </div>



            {/* Popup exam end Confirmation */}
            {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <p className="text-lg font-semibold">Are you sure you want to end the exam?</p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={()=>{SubmitExam(); handleEndExam(); setShowPopup(false)}}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                End and Submit Exam
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueDisplay;
