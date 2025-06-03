import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { QuickJump } from '../../../features/QueStatusSlice';

const QueStatusBar = ({ examQues,Etype}) => {

    const QueIndex = useSelector((state) => state.currentIndex.value);
    const dispatch = useDispatch();
  
    function handleQuickJump(index) {
      dispatch(QuickJump(index));
    }
  
  
  
  
    return (
      <div  className='w-full h-full space-y-3 flex flex-col justify-between 
            items-center row-start-1 row-end-5 max-md:row-start-5 max-md:row-end-7 
            col-start-4 col-end-5 max-md:col-start-1 bg-white 
            shadow-sm rounded-md border-t-4 border-orange-500
            max-sm:row-start-7 max-sm:row-end-9'>
      
      <h1 className='text-3xl font-semibold py-2'>{Etype}</h1>
  

      <div className='w-full h-1/6  flex flex-col items-center justify-evenly 
                      max-md:flex-row '>

        <div className='h-[48%] w-[98%] bg-gray-100 rounded-xl flex items-center justify-between p-1
                        max-md:h-[98%] max-md:w-[48%]'>
            <p className='ml-1'>Non Attended</p>
            <div className='w-1/5 h-full font-bold bg-red-600 text-white rounded-xl flex items-center justify-center'>
              {examQues.filter(q => q.givenAns === null).length}
            </div>
        </div>

        <div className='h-[48%] w-[98%] bg-gray-100 rounded-xl flex items-center justify-between p-1
                         max-md:h-[98%] max-md:w-[48%]'>
            <p className='ml-1'>Attended</p>
            <div className='w-1/5 h-full font-bold bg-green-600 text-white rounded-xl flex items-center justify-center'>
            {examQues.length-examQues.filter(q => q.givenAns === null).length}
            </div>
        </div>

      </div>
  
      <div className='h-4/6 grid grid-cols-7 auto-rows-[11.11%] gap-1 p-2 overflow-hidden hover:overflow-auto 
                      max-lg:grid-cols-5 max-md:w-full  max-md:grid-cols-10 max-md:auto-rows-[33.33%]
                      max-sm:max-md:auto-rows-[25%] '>
  
        {examQues.map((q, index) => (
        <div 
          className={`w-full rounded-full border-2 aspect-square flex justify-center items-center 
                    cursor-pointer transition-all duration-200
                    ${
                      QueIndex === index 
                      ? "bg-white border-orange-500 text-orange-500" 
                      : q.givenAns !== null 
                        ? "bg-green-500 border-green-500 text-white" 
                        : "border-red-600 bg-red-600 text-white"
                    }`}
          key={index} 
          onClick={() => handleQuickJump(index)} 
        >
          {index + 1}
        </div>
      ))}


          
  
  
      </div>
  
      </div>
    )
  }

export default QueStatusBar
