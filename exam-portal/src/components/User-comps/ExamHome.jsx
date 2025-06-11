import React, { useState, useEffect,useRef } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenCheck, CalendarDays, Timer, Clock7, Languages, FileCheck2,LogOut, Settings, X,UserRound,Mail,UserCog,KeyRound} from 'lucide-react';
import logo from "../../assets/Software_logo.png";
import { useSelector,useDispatch } from "react-redux";
import { logout } from "../../features/authSlice";
import { useNavigate } from 'react-router-dom';




const ExamHome = ({LogedUser}) => {
  const [ScheduleList, setScheduleList] = useState([]);
  const [examsInfo, setExamsInfo] = useState([]);
  const [CandInfo, setCandInfo] = useState([]);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term

  const dispatch = useDispatch();
  
  
  const divRef1 = useRef(null);
  const divRef2 = useRef(null);


  const filteredSchedule = (ScheduleList || []).filter((sl) => {
    const title = sl.scheduleName || "";
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  


  useEffect(() => {
    const fetchScheduleExam = async () => {
      try {
        const response = await fetch(`http://localhost:3000/Candidate-exam/GetScheduleExam/${LogedUser.user}`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
      
        setScheduleList(data.svSchedule || []); // Ensure it's always an array
        setExamsInfo(data.exams || []);
        setCandInfo(data.candidatedata || []);
      } catch (error) {
        console.error("Error fetching schedule:", error);
        setScheduleList([]); // Fallback to empty array
      }
    };

    fetchScheduleExam();
  }, []);


  const handleUserPop = () => {
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



  return (
    <div>
      {/* Navbar */}
      <div className='w-full flex justify-between shadow-md bg-orange-500 p-2
                       max-[600px]:flex-col max-[600px]:gap-2'>


        <div className="flex justify-between items-center h-full max-[600px]:h-1/2 max-[600px]:justify-normal max-[600px]:w-full ">
          <img src={logo} alt="Pi" className="bg-white h-20 aspect-square rounded-md " />
          <h1 className="font-semibold text-2xl ml-2">Phoenix <br /> Exam Portal</h1>
        </div>

        <div className="h-20  w-96 p-1 rounded-lg bg-white shadow-md flex items-center gap-4 max-[600px]:w-full max-[600px]:h-14">
          {/* Candidate Photo */}
          <img 
            src={`https://exam-portal-backend-hvq6.onrender.com/${CandInfo.photo}`}
            alt="" 
            className="h-full aspect-square rounded-md object-cover bg-orange-300 max-[600px]:h-12 " 
          />

          {/* Candidate Info */}
          <div className="w-[50%] max-[600px]:w-[70%] max-[410px]:w-[60%] max-[300px]:w-[40%] h-full flex flex-col justify-center">
            <h1 className="font-semibold text-gray-800 text-xl truncate mb-2 max-[600px]:mb-0 max-[600px]:text-base">{CandInfo.nameofCand}</h1>
            <p className="text-sm text-gray-600 truncate w-full">{CandInfo.emailID}</p>
          </div>


          {/* Settings Icon */}
          <Settings 
          size={30}
            onClick={handleUserPop}
            className="cursor-pointer w-[20%] max-[400px]:w-[30%] transition-transform duration-300 ease-in-out hover:rotate-180 text-gray-600 hover:text-gray-900"
          />
        </div>


      </div>

      {/* Search & Heading */}
      <div className='h-[10vh] w-full p-4 flex justify-between'>
        <h1 className='text-2xl font-semibold'>Your Exams</h1>
        <input
          type="search"
          placeholder='Search Exam'
          className='search_box w-2/5 h-full bg-[#F5F5F5] p-2'
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>



      {/* Exam Cards */}
      <div className='w-full h-[75vh] overflow-auto grid grid-cols-4 auto-rows-[50%] gap-4 p-4 
                     max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1'>

        {filteredSchedule.map((exm, index) => {
          // Find the corresponding exam details
          const examDetails = examsInfo.find(exam => exam._id === exm.Exam.toString());
          

          return (

            <Link 
              to={exm.status === "Completed" ? "/exam" : `/exam/${exm.Exam}/${exm._id}`} 
              state={{ ScheduleData: exm }}
              key={exm._id}
            >
              <div 
                className={`w-full h-full shadow-lg bg-white rounded-md p-2 ${
                  exm.status === "Completed" ? "cursor-not-allowed opacity-80" : "cursor-pointer"
                }`}
              >

                <div className='h-1/4 w-full flex items-center justify-start pb-2'>
                  <div className='h-full aspect-square bg-blue-500 rounded-md flex items-center justify-center'>
                    <BookOpenCheck color="#ffffff" size={30} />
                  </div>
                  <h2 className='pl-2 font-semibold'>{exm.scheduleName}</h2>
                </div>

                <div className='h-3/4 bg-[#F5F5F5] rounded-md p-2 text-sm'>
                  <table className='h-full'>
                    <tbody>
                      <tr>
                        <td className='w-[10%]'><CalendarDays color="#ffa500" size={20} /></td>
                        <td className='font-medium w-[45%] pl-2'>Date: </td>
                        <td className='w-[45%]'>
                          {new Date(exm.scheduledTime).toLocaleString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour12: true,
                          })}
                        </td>
                      </tr>
                      <tr>
                        <td className='w-[10%]'><Clock7 color="#ffa500" size={20} /></td>
                        <td className='font-medium w-[45%] pl-2'>Time: </td>
                        <td className='w-[45%]'>
                          {new Date(exm.scheduledTime).toLocaleString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </td>
                      </tr>
                      <tr>
                        <td className='w-[10%]'><Timer color="#ffa500" size={20} /></td>
                        <td className='font-medium w-[45%] pl-2'>Exam Name: </td>
                        <td className='w-[45%]'>{examDetails?.examTitle || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className='w-[10%]'><Languages color="#ffa500" size={20} /></td>
                        <td className='font-medium w-[45%] pl-2'>Language: </td>
                        <td className='w-[45%]'>{examDetails?.examlang || "Not Provided"}</td>
                      </tr>
                      <tr>
                        <td className='w-[10%]'><FileCheck2 color="#ffa500" size={20} /></td>
                        <td className='font-medium w-[45%] pl-2'>Status: </td>
                        <td className='w-[45%] font-semibold'>
                        <p
                          className={`${
                            exm.status === "Pending"
                              ? "text-blue-600"
                              : exm.status === "Completed"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {exm.status}
                        </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

<div ref={divRef2} className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10 hidden"></div>

<div ref={divRef1} className="fixed top-0 left-0 z-20 w-full h-full items-center justify-center hidden">
  <div className="bg-white rounded-md shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-auto max-md:h-5/6 max-md:w-full">
    
    {/* Header */}
    <div className="w-full flex justify-between items-center p-4 font-bold text-xl md:text-2xl border-b max-md:p-1">
      <div className="flex items-center">
        {/* <Info color="#ffa500" size={30} /> */}
        <h1 className="ml-2">Candidate Information</h1>
      </div>
      <X onClick={handleUserPop} className="cursor-pointer" />
    </div>

    {/* Body */}
    <div className="p-4 flex flex-col md:flex-row ">
      <img
        src={`https://exam-portal-backend-hvq6.onrender.com/${CandInfo.photo}`}
        alt=""
        className="object-cover w-full md:w-1/3 aspect-square rounded-md mb-4 md:mb-0 md:mr-4 
        max-md:w-36 max-md:self-center"
      />
      
      <table className="w-full md:w-2/3  max-[400px]:w-3 text-sm md:text-base max-[400px]:text-[10px] max-[400px]:self-center ">
        <tbody>
          <tr className="border-b">
            <td className=""><UserRound color="#ffa500" /></td>
            <td className="font-semibold w-1/3 ">Name</td>
            <td className="w-1/2">{CandInfo.nameofCand}</td>
          </tr>
          <tr className="border-b">
            <td><Mail color="#ffa500" /></td>
            <td className="font-semibold">Email</td>
            <td>{CandInfo.emailID}</td>
          </tr>
          <tr className="border-b">
            <td><UserCog color="#ffa500" /></td>
            <td className="font-semibold">Account Type</td>
            <td>Candidate</td>
          </tr>
          <tr className=''>
            <td></td>
            <td className="">


                <button
                onClick={() => dispatch(logout())}
                className="submit_btn w-full h-full flex items-center justify-center py-3 max-md:p-1"
              >
                <LogOut
                  color="#ffffff"
                  className="mr-1 transition-transform duration-300 ease-in-out hover:rotate-180 "
                />
                Logout
              </button>
            </td>
            <td className="p-1">
                              <button
                onClick={() => navigate(`/Forgot-Password`, {
                  state: { emailID: LogedUser.user },
                })}
                className="submit_btn w-full h-full flex items-center justify-center py-3 max-md:p-1"
              >
                <KeyRound
                  color="#ffffff"
                  className="mr-1 transition-transform duration-300 ease-in-out hover:rotate-180"
                />
                Reset Password
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>


    </div>
  );
};

export default ExamHome;
