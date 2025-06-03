import React, { useEffect, useState ,useRef } from 'react';
import {Trash2,X} from "lucide-react";
import CreateQue from '../CreateQue'; 
import toast, { Toaster } from 'react-hot-toast';


const QuelistView = ({id,examTitle,questions,handleQueDeleted,handleUpdateQuestion}) => {

    // const [questions, setQuestions] = useState([]); 
    const [selectedQue, setSelectedQue] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term
    const [loading, setLoading] = useState(true);

    const divRef1 = useRef(null);
    const divRef2 = useRef(null);

    // useEffect(() => {

    //     const getQues = async()=>{
    //       setQuestions(ques);
    //     }

    //     getQues()
    //   }, [questions]);

    
          
    const filteredQues = questions.filter((question) => {
        const title = question.Question || '';
        const match = title.toLowerCase().includes(searchTerm.toLowerCase());
        return match;
      });





      const HandleQueDelete = async (event, examId, QId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this schedule?");
        if (!confirmDelete) return;
        event.stopPropagation(); // Stop event bubbling
      
        try {
          const response = await fetch(`http://localhost:3000/Manage-exam/${examId}/${QId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          const data = await response.json();
      
          if (response.ok) {
            
            console.log(data.message);
            toast.success(data.message);
            if (handleQueDeleted)
            {
              handleQueDeleted(QId)
            }
          } else {
            console.error('Failed to delete question');
          }
        } catch (error) {
          console.error('Error:', error);
        }
        
      };

        // if (loading) {
        //     return <div>Loading Questions...</div>;
        //   }



  return (


    <div className='w-full h-full shadow-md rounded-xl px-3 bg-white row-start-3 row-end-9 col-start-6 col-end-10 max-lg:text-sm
                    max-lg:row-start-8 max-lg:row-end-11 max-lg:col-end-9 max-lg:col-start-1 overflow-hidden'>
        
        <div className='w-full h-[10%] flex items-center justify-between mb-4 '>
          <h1 className='font-semibold text-xl'>Questions ({questions.length})</h1>

            <input type="search" placeholder='Search Question' 
            className='search_box h-2/3'
            value={searchTerm} // Bind the input to searchTerm state
            onChange={(e) => setSearchTerm(e.target.value)}/>

        </div>

        <div className='h-[88%] overflow-y-auto overflow-x-hidden pr-1'>

        <table className='w-full border-collapse'>
          <tbody>
          {filteredQues.length > 0 ? (
            filteredQues.map((q, index) => (
              <tr
                key={index}
                className="table_row"
                onClick={() => setSelectedQue(q)}
              >
                <td className="w-[10%] text-left p-2 rounded-l-md">{index + 1}</td>
                <td className="text-left p-2">{q.Question}</td>
                <td className="w-[10%] text-center p-2 rounded-r-md" title="Delete">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      HandleQueDelete(e, id, q._id);
                    }}
                  >
                    <Trash2 size={20} color={"#ff0000"} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-2xl text-center text-chileanFire-500">
                No Data Found
              </td>
            </tr>
          )}
            </tbody>
          </table>
        </div>


        {selectedQue && (
        
        <div className='fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10'></div>
        
      )}


      {selectedQue && (
        
        <div className='fixed top-0 left-0 z-20 w-full h-full flex flex-col items-center justify-center'>

          <div className='w-5/6 h-4/6'>

            <div className='w-full flex justify-between items-center p-2 text-white font-bold text-2xl'>
              <h2>{selectedQue.Question}</h2>
              <X className='font-normal cursor-pointer' onClick={() => setSelectedQue(null)} color='#ffffff'/>
            </div>
            
            <CreateQue examId={id} examName={examTitle} udQue={selectedQue} updatestatus={true} handleUpdateQuestion={handleUpdateQuestion}/>

          </div>

        </div>
        
      )}

      </div>



  )
}

export default QuelistView
