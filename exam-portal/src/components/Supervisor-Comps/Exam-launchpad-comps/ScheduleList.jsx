import React, { useEffect, useState ,useRef } from 'react';
import { X ,Trash2 ,Settings,BookOpenCheck } from 'lucide-react';
import AddUpdateSchedule from './AddUpdateSchedule';
import toast from 'react-hot-toast';


const ScheduleList = ({LogedUser,Schedules,sdlloading,handleScheduleUpdated,handleScheduleDeleted,error,setAllProvideExams,handleScheduleAdded}) => {


    // Store fetched candidates
    const [selectedSchedule, setSelectedSchedule] = useState(null); // For selected candidate details
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    
  
    const  SvUser= LogedUser.user

    
      const divRef1 = useRef(null);
      const divRef2 = useRef(null);
    
      const handleSdlpopClick = () => {
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
  
    // Fetch schedules on initial render

   

    const filteredSchedules = Schedules
    .filter((schedule) => {
      const name = schedule.scheduleName || '';
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime)); // Oldest first
  


      
  
      const HandleSdlDelete = async (esID) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this schedule?");
        if (!confirmDelete) return;
      
        try {
          const response = await fetch(`http://localhost:3000/ExamLaunchpad/exam-schedules/delete-schedule/${SvUser}/${esID}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log(data.message);
      
            if (handleScheduleDeleted) {
              handleScheduleDeleted(esID);
            }
      
            toast.success(data.message || "Schedule deleted successfully");
          } else {
            toast.error('Failed to delete schedule');
            console.error('Failed to delete Schedule');
          }
        } catch (error) {
          console.error('Error:', error);
          toast.error('An error occurred while deleting the schedule');
        }
      };

      
  

    return (
        <div className="w-full h-full rounded-xl shadow-md bg-white row-start-2 row-end-10 col-start-1 col-end-4 
        max-lg:text-sm max-lg:row-start-2 max-lg:row-end-5 max-lg:col-end-9 max-lg:col-start-1 p-3 ">

          <div className='w-full h-1/5 grid grid-cols-3 grid-rows-2 mb-8 gap-2 '>
            <h1 className='font-semibold text-2xl self-center col-start-1 col-end-3 max-lg:text-sm'>Schedules ({Schedules.length})</h1>
            <button onClick={handleSdlpopClick} className='submit_btn ' >
                Create +
            </button>
              <input
                type="search"
                placeholder="Search schedule"
                className="search_box col-start-1 col-end-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

      {/* Loading State */}
      {sdlloading && <p>Loading Schedules...</p>}

      {/* Error State */}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Candidate List */}
      {!sdlloading && !error && filteredSchedules.length === 0 && (
        <p>No Schedules found.</p>
      )}
      {!sdlloading && !error && filteredSchedules.length > 0 && (
        <div className="h-3/4 candidate-list overflow-y-auto overflow-x-hidden">
          {filteredSchedules.map((Schedule,index) => (
            <div
              key={Schedule._id || index}  
              onClick={() => {setSelectedSchedule(Schedule); setIsUpdateMode(true); handleSdlpopClick(); }}
              className="table_row p-2 border-b hover:bg-gray-100 cursor-pointer flex items-center justify-between"
            >
                  <div className='flex items-center justify-center bg-blue-500 h-full aspect-square rounded-md p-2'>
                  <BookOpenCheck color={"#ffffff"}/>
                  </div>
              

              <div className='w-2/3 h-full'>
                <h2 className="font-medium truncate max-sm:text-[12px]">{Schedule.scheduleName}</h2>
                <p className="text-sm text-gray-600 max-sm:text-[12px]">
                  {new Date(Schedule.scheduledTime).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
              </div>

              <Trash2 size={30} color={"#ff0000"}
                onClick={(e) => {
                  e.stopPropagation();
                  HandleSdlDelete(Schedule._id);
                }} />

            </div>
          ))}
        </div>

      )}

      <div ref={divRef2}  className='fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10 hidden'> </div>

      <div ref={divRef1} className='fixed top-0 left-0 z-20 w-full h-full flex-col items-center justify-center hidden'>

              <AddUpdateSchedule
          handleScheduleAdded={handleScheduleAdded}
          SvUser={SvUser}
          setAllProvideExams={setAllProvideExams}
          handleSdlpopClick={handleSdlpopClick}
          selectedSchedule={selectedSchedule}
          setSelectedSchedule={setSelectedSchedule}
          handleScheduleUpdated={handleScheduleUpdated}
        />
      </div>


          
        </div>
      );
}

export default ScheduleList
