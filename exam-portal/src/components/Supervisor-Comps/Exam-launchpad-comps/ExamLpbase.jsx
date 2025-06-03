import React ,{useEffect,useState}from 'react'
import ScheduleList from './ScheduleList'
import GroupList from './GroupList'
import {UsersRound,BookOpenCheck} from 'lucide-react';

const ExamLpbase = ({LogedUser}) => {

      const SvUser= LogedUser.user
  
      const [Schedules, setSchedules] = useState([]);

      const [sdlloading, setSdlLoading] = useState(true); 
      const [error, setError] = useState(null);
      const [allProvideCands, setAllProvideCands] = useState([]);
      const [allProvideExams, setAllProvideExams] = useState([]);
      const [allCands, setAllCands] = useState([]);
      




      const fetchSchedules = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/ExamLaunchpad/exam-schedules/${SvUser}`
          );
          if (!response.ok) throw new Error('Failed to fetch candidates.');
          const data = await response.json();
          setSchedules(data); // Update candidate list
          setSdlLoading(false);
        } catch (error) {
          console.error('Error fetching candidates:', error);
          setError(error.message); // Set error message
          setSdlLoading(false);
        }
      };
  

      useEffect(() => {

        fetchSchedules();
      }, []); 

        useEffect(() => {
          const fetchAllCands = async () => {
            try {
              const response = await fetch(`http://localhost:3000/Candidates/Candidate-list/${SvUser}`);
              if (!response.ok) throw new Error("Failed to fetch All candidates");
              const Data = await response.json();
              
              setAllCands(Data);
            } catch (error) {
              console.error(error);
            }
          };
      
          fetchAllCands();
          setAllProvideCands(allCands);
          
        }, []);
      

      const handleScheduleAdded = (newSchedule) => {
        setSchedules(prevSchedules => [newSchedule, ...prevSchedules]);
        console.log(newSchedule)
      };

      const handleScheduleDeleted = (deletedScheduleId) => {
        setSchedules((prevSchedules) =>
          prevSchedules.filter((schedule) => schedule._id !== deletedScheduleId)
        );
      };

      const handleScheduleUpdated = (updatedSchedule) => {
        setSchedules((prevSchedules) =>
          prevSchedules.map((schedule) =>
            schedule._id === updatedSchedule._id ? updatedSchedule : schedule
          )
        );
      };
      
      


  
  return (
    <div className='w-4/5 h-[100vh] grid grid-cols-8 grid-rows-9 p-2 gap-3 overflow-y-auto overflow-x-hidden max-lg:mt-12
    max-lg:h-[200vh] max-lg:w-full  max-sm:w-full max-sm:px-4'>

        <h1 className='font-bold text-4xl col-start-1 col-end-9 row-start-1 row-end-2 self-center'>Exam Launchpad</h1>
      
        <ScheduleList LogedUser={LogedUser} Schedules={Schedules || []} handleScheduleUpdated={handleScheduleUpdated} handleScheduleDeleted={handleScheduleDeleted} error={error} sdlloading={sdlloading} setAllProvideExams={setAllProvideExams} handleScheduleAdded={handleScheduleAdded}/>
        <GroupList LogedUser={LogedUser} setAllProvideCands={setAllProvideCands} Schedules={Schedules || []} allCands={allCands || []}/>



        <div className='w-full h-full flex flex-col items-center justify-between rounded-xl p-4 shadow-md bg-white row-start-2 row-end-6 col-start-7 col-end-9 
                        max-lg:row-start-8 max-lg:row-end-11 max-lg:col-end-5 max-lg:col-start-1'>
          
          <div className='font-semibold text-7xl h-4/5 flex items-center justify-center'>
            <UsersRound size={65} color='#3B82F6'/>
            <span className='ml-5'>{allCands.length}</span>
          </div>

          <div className='flex w-full justify-center h-1/5 items-center'>
            <p className='font-normal text-2xl ml-3'>Total Candidates</p>
          </div>
          
        </div>


        <div className='w-full h-full flex flex-col  items-center justify-between rounded-xl p-4 shadow-md bg-white row-start-6 row-end-10 col-start-7 col-end-9 
                        max-lg:row-start-8 max-lg:row-end-11 max-lg:col-end-9 max-lg:col-start-5'>
          
          <div className='font-semibold text-7xl h-4/5 flex items-center justify-center'>
            <BookOpenCheck size={65} color='#3B82F6'/>
            <span className='ml-5' >{allProvideExams.length}</span>
          </div>

          <div className='flex w-full justify-center h-1/5 items-center'>
            <p className='font-normal text-2xl ml-3'>Total Exams</p>
          </div>
          
        </div>

    </div>
    
  )
}

export default ExamLpbase
