import React,{useState,useEffect} from 'react'
import { UserRoundCog,LogOut, Settings , X,UserRound,UserCog, UserRoundIcon} from 'lucide-react';
import logo from '../../assets/Software_logo.png'
import adminlogo from '../../assets/adminlogo.jpg'
import SvList from './SV-Manage-Comps/SvList'
import CreateSV from './SV-Manage-Comps/CreateSV';
import {useDispatch } from "react-redux";
import { logout } from '../../features/authSlice';



const SuperAdminBaseComp = ({LogedUser}) => {

    const SuperAdmUser = LogedUser.user
    const dispatch = useDispatch();
    


    const [Svlist, setSvlist] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // State for error handling 
    const [candCount , setCandcount]= useState(null)
 
      const fetchAllSv = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/ManageSV/SV-list/${SuperAdmUser}`
          );
          if (!response.ok) throw new Error('Failed to fetch candidates.');
          const data = await response.json();
          setSvlist(data.Sv_list); 
          setCandcount(data.candidateCount)
          setLoading(false);
        } catch (error) {
          console.error('Error fetching candidates:', error);
          setError(error.message); // Set error message
          setLoading(false);
        }
      };
    
        useEffect(() => {
            fetchAllSv();
        }, []); 


        
      const handleSVAdded = (newSv) => {
        fetchAllSv()
        setSvlist(prevSv => [newSv, ...prevSv]);
      };

      const handleSVDeleted = (deletedId,CandDeletedCount) => {
        setSvlist(prevSv => prevSv.filter(sv => sv._id !== deletedId));
        setCandcount(prevCount => prevCount - CandDeletedCount);
      };
      


  return (
 <div>


        <div className='w-full h-[10vh] flex justify-between shadow-md bg-orange-500 p-1'>

        <div className="flex justify-between items-center h-ful px-1">
          <img src={logo} alt="Pi" className="bg-white h-full rounded-full " />
          <h1 className="font-semibold text-base ml-2">Phoenix <br /> Exam Portal</h1>
        </div>

        <div className="h-full p-1 rounded-lg bg-white shadow-md flex items-center gap-4">
    
          <img 
            src={adminlogo} 
            alt="Candidate" 
            className="w-10 h-full aspect-square rounded-md object-cover bg-orange-300" 
          />

       
          <div className="flex-1">
            <h1 className="font-semibold text-gray-800">SUPER ADMIN</h1>
            <p className="text-sm text-gray-600 truncate w-40"></p>
          </div>

    
          <LogOut
           onClick={() => dispatch(logout())} 
            className="cursor-pointer transition-transform duration-300 ease-in-out hover:rotate-180 text-gray-600 hover:text-gray-900"
          />
        </div>
  </div>

          {/* adminpagebody */}
          <div className="h-[90vh] w-full grid grid-cols-6 grid-rows-7 p-3 gap-3
                          max-lg:h-[200vh]" >

            <div className="bg-[#F5F5F5] col-start-1 col-end-7 row-start-1 row-end-2 flex items-center justify-start">

              <span className='text-3xl'>Hi, Super Admin</span>
              
            </div>

            <CreateSV SuperAdmUser={SuperAdmUser} handleSVAdded={handleSVAdded} />

            <SvList Svlist={Svlist} loading={loading} error={error} handleSVDeleted={handleSVDeleted}/>

                        
            <div className='w-full h-full flex items-center justify-between rounded-xl p-4 shadow-md bg-white row-start-6 row-end-8 col-start-1 col-end-3 
                            max-lg:col-end-4 max-lg:row-start-7'>

              <div className="flex items-center gap-4 max-md:flex-col max-md:justify-center max-md:gap-2 w-full">
                <UserRound size={65} color='#3B82F6' className="max-md:w-12 max-md:h-12" />

                <div className="flex flex-col items-start max-md:items-center">
                  <span className='text-6xl font-semibold max-lg:text-5xl max-md:text-4xl'>{candCount}</span>
                  <p className='font-normal text-xl max-lg:text-lg max-md:text-sm text-gray-600 text-wrap text-left max-md:text-center'>
                    Total Candidates<br className="max-md:block hidden" /> This Exam Portal
                  </p>
                </div>
              </div>
            </div>

            <div className='w-full h-full flex items-center justify-between rounded-xl p-4 shadow-md bg-white row-start-6 row-end-8 col-start-3 col-end-5 
                            max-lg:col-start-4 max-lg:col-end-7 max-lg:row-start-7'>

              <div className="flex items-center gap-4 max-md:flex-col max-md:justify-center max-md:gap-2 w-full">
                <UserCog size={65} color='#3B82F6' className="max-md:w-12 max-md:h-12" />

                <div className="flex flex-col items-start max-md:items-center">
                  <span className='text-6xl font-semibold max-lg:text-5xl max-md:text-4xl'>{Svlist.length}</span>
                  <p className='font-normal text-xl max-lg:text-lg max-md:text-sm text-gray-600 text-wrap text-left max-md:text-center'>
                    Total Supervisors<br className="max-md:block hidden" /> This Exam Portal
                  </p>
                </div>
              </div>
            </div>


          </div>
    </div>
  )
}

export default SuperAdminBaseComp
