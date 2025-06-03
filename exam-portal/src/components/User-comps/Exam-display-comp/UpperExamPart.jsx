import React from 'react'
import Software_logo from "../../../assets/Software_logo.png"
import {Languages,BookOpenCheck,User,List} from 'lucide-react';

const UpperExamPart = ({examInfo,CandInfo}) => {

  return (
    <div className='w-full h-full flex items-center justify-between
                    p-2 bg-white shadow-sm rounded-md row-start-1 row-end-2
                    col-start-1 col-end-4 max-md:col-end-5 border-t-4 border-orange-500
                    max-sm:row-end-3 max-sm:grid max-sm:grid-rows-3 max-sm:grid-cols-2 '>
      
      <img src={Software_logo} alt="PI Exam Logo" className='aspect-square h-[95%]' />


      <img src={`http://localhost:3000/${CandInfo.photo}`} alt=""
           className='aspect-square flex items-center justify-center h-full place-self-end rounded-md
               bg-orange-200 max-sm:row-start-1 max-sm:row-end-2 max-sm:col-start-2 max-sm:col-end-3
                sm:hidden object-cover'/>


      <div className='bg-gray-100 w-[85%] h-[95%] grid grid-cols-7 grid-rows-3 rounded-md gap-1 p-2
                       max-sm:row-start-2 max-sm:row-end-4 max-sm:col-start-1 max-sm:col-end-3 max-sm:w-full max-sm:text-xs'>

          <h1 className='text-2xl font-semibold self-center
          row-start-1 row-end-2 col-start-1 col-end-7 
          max-sm:col-end-8 max-md:text-base '>{examInfo.examTitle}</h1>

          <div className='row-start-2 row-end-4 col-start-1 col-end-7 grid grid-cols-2 grid-row-2 gap-1
                          max-md:grid-cols-1 max-md:grid-row-4 max-md:gap-0 max-xl:text-xs max-sm:col-end-8'>

              <div className='w-full h-full flex items-center'>
                <Languages color="#ffa500" size={18}/>
                <span className='w-[30%] ml-2 font-semibold'>Language :</span>
                <span className='w-[70%]'>{examInfo.examlang}</span>
              </div>

              <div className='w-full h-full flex items-center'>
                <BookOpenCheck color="#ffa500" size={18}/>
                <span className='w-[30%] ml-2 font-semibold'>Total Marks :</span>
                <span className='w-[70%]'>{examInfo.MarkPerQue*examInfo.questions.length}</span>
              </div>

              <div className='w-full h-full flex items-center'>
                <User color="#ffa500" size={18}/>
                <span className='w-[30%] ml-2 font-semibold'>Name :</span>
                <span className='w-[70%]'>{CandInfo.nameofCand}</span>
              </div>

              <div className='w-full h-full flex items-center'>
                <List color="#ffa500" size={18}/>
                <span className='w-[30%] ml-2 font-semibold'>Roll no:</span>
                <span className='w-[70%]'>{CandInfo.rollNo}</span>
              </div>

          </div>

          <img src={`http://localhost:3000/${CandInfo.photo}`} alt=""
           className="object-cover aspect-square flex items-center justify-center h-full place-self-end rounded-md
               bg-orange-200 row-start-1 row-end-4 col-start-7 col-end-8 max-md:col-start-6 max-sm:hidden"/>
      
      </div>
    </div>
  )
}

export default UpperExamPart
