
import React, { useEffect, useState ,useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {X} from "lucide-react";

import CreateQue from './CreateQue';
import UpdateExamInfo from './UpdateExamInfo';
import QuelistView from './ExamSetView_comps/QuelistView';
import UploadQues from './ExamSetView_comps/UploadQues';


import {Trash2,RefreshCcwDot,FilePlus2,ListCollapse,Eye,FileSpreadsheet,Upload } from "lucide-react";


const ExamSettingView = () => {

  const { id } = useParams(); // Exam ID
  const [Exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchExam = async () => {
    try {
      const response = await fetch(`http://localhost:3000/exam/${id}`);
      const data = await response.json();
      setExam(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching the exam:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExam();
  }, [id]);

  const divRef1 = useRef(null);
  const divRef2 = useRef(null);

  const handleAddQueClick = () => {
    // Toggle visibility for divRef1
    if (divRef1.current) {
      if (divRef1.current.classList.contains('hidden')) {
        divRef1.current.classList.remove('hidden');
        divRef1.current.classList.add('md:flex');
      } else {
        divRef1.current.classList.add('hidden');
        divRef1.current.classList.remove('md:flex');
      }
    }

    // Toggle visibility for divRef2
    if (divRef2.current) {
      if (divRef2.current.classList.contains('hidden')) {
        divRef2.current.classList.remove('hidden');
        divRef2.current.classList.add('md:flex');
      } else {
        divRef2.current.classList.add('hidden');
        divRef2.current.classList.remove('md:flex');
      }
    }
  };;

  const handleQueDeleted = (idToRemove)=>{

    setExam(prevExam => ({
      ...prevExam,
      questions: prevExam.questions.filter(q => q._id !== idToRemove)
    }));


  }

  const handleQueAdded = (newQue) => {
    setExam(prevExam => ({
      ...prevExam,
      questions: [...prevExam.questions, newQue]
    }));
    fetchExam()
  };


  const handleUpdateQuestion = (updatedQue) => {
    
    setExam(prevExam => ({
      ...prevExam,
      questions: prevExam.questions.map(q =>
        q._id === updatedQue._id ? updatedQue : q
      )
    }));
  };
  




  if (loading) {
    return <div>Loading...</div>;
  }




  const button = document.getElementById('myButton');
  const addbutton = document.getElementById('');
  const element = document.getElementById('myElement');




  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='w-4/5 h-[100vh] grid grid-cols-8 grid-rows-8 max-lg:grid-rows-10 p-2 gap-3 overflow-y-auto overflow-x-hidden
                    max-lg:h-[200vh] max-lg:w-full max-lg:px-4'>

      <div className='text-2xl row-start-1 row-end-2 col-start-1 col-end-9 flex items-center justify-start
                      max-lg:text-lg max-md:text-sm max-lg:pt-2  max-lg:items-end pb-3 '>
        <Link to="/sv-dashboard/manage-exam">Manage Exam  &gt; </Link>{Exam.examTitle}
      </div>



      <UpdateExamInfo examId={id} exam={Exam} refreshExam={fetchExam} />


      <UploadQues id={id} handleQueAdded={handleQueAdded}/>



      <div onClick={handleAddQueClick}
      className=' bg-white w-full h-full flex items-center justify-start p-2 cursor-pointer shadow-md rounded-xl row-start-2 row-end-3 col-start-6 col-end-9
                  max-lg:row-start-7 max-lg:row-end-8 max-lg:col-end-5 max-lg:col-start-1'>
        
        <FilePlus2 size={30} color='#0a9400'/>
        <h1 className='font-semibold text-xl ml-2 max-lg:text-sm'> Add New Question</h1>
        
      </div>

      {/* <div className='flex items-center justify-start p-2  bg-white w-full h-full shadow-md rounded-xl row-start-2 row-end-3 col-start-7 col-end-9
                       max-lg:row-start-5 max-lg:row-end-6 max-lg:col-end-9 max-lg:col-start-5'>
       
        <ListCollapse size={30} color={"#007bff"} />
        <h1 className='font-semibold text-xl ml-2 flex items-center justify-start max-lg:text-sm'> Question Count : <span className='text-orange-500 text-2xl ml-1'>{Exam.questions.length}</span></h1>

      </div> */}

      <QuelistView id={id} examTitle={Exam.examTitle} questions={Exam.questions || []} handleQueDeleted={handleQueDeleted} handleUpdateQuestion={handleUpdateQuestion}/>

      
     
      
      



  <div ref={divRef2}  className='fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10 hidden'> </div>

  <div ref={divRef1} className='fixed top-0 left-0 z-20 w-full h-full flex-col items-center justify-center hidden'>

      <div className='w-4/6 h-3/6 rounded-lg shadow-lg max-lg:w-11/12 max-md:w-full max-md:h-5/6'>

        <div className='w-full flex justify-end p-2 text-white font-bold text-2xl'>
          <X color='#ffffff' className='font-normal cursor-pointer' onClick={handleAddQueClick}/>
        </div>
        
        <CreateQue examId={id} examName={Exam.examTitle}  handleQueAdded={handleQueAdded} />

      </div>

  </div>
      
        
    </div>
  )
}

export default ExamSettingView
