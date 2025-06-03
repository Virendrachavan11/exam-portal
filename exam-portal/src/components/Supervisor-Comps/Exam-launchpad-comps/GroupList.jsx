import React, { useEffect, useState ,useRef } from 'react';
import { X ,Trash2 ,Settings,UsersRound} from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";
import EditAddGroup from './EditAddGroup';


const GroupList = ({LogedUser,setAllProvideCands,allCands, Schedules}) => {

    const [selectedcandGroup, setSelectedcandGroup] = useState(null); // For selected candidate details
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // State for error handling
    const [isUpdateMode, setIsUpdateMode] = useState(false); 
    
    const SvUser= LogedUser.user

    const divRef1 = useRef(null);
    const divRef2 = useRef(null);

      const [candGroups, setCandGroups] = useState([]);

      useEffect(() => {
    
        const fetchCandidateGroups = async () => {
          try {
            const response = await fetch(`http://localhost:3000/ExamLaunchpad/candidate-groups/${SvUser}`);
            if (!response.ok) throw new Error("Failed to fetch candidate groups");
            const groupsData = await response.json();
            setCandGroups(groupsData);
            setLoading(false)
          } catch (error) {
            console.error(error);
            setError(error.message);
            setLoading(false)
          }
        };
    
        fetchCandidateGroups();
      }, []);


    const handleCgPopClick = () => {
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
    
    
    const filteredcandGroups = candGroups
    .filter((candGroup) => {
      const name = candGroup.groupName|| '';
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .reverse();

    const handleGroupStateUpdated = (updatedCG) => {
      setCandGroups (prevCS =>
        prevCS.map(cg =>
          cg._id === updatedCG._id ? updatedCG : cg
        )
      );
    };

    const handleGroupStateAdded = (newCG) => {
      setCandGroups(prevCG => [...prevCG, newCG]);
    };

      const HandleCgDelete = async (candGroupID) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Group?");
        if (!confirmDelete) return;

        try {
          const response = await fetch(`http://localhost:3000/ExamLaunchpad/candidate-groups/delete-group/${SvUser}/${candGroupID}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          const data = await response.json();
    
          if (response.ok) {
            
            console.log(data.message);
            setCandGroups((prevCG) => prevCG.filter((CG) => CG._id !== candGroupID));
            toast.success(data.message || 'Group is Deleted');
          } else {
            console.error('Failed to delete Group');
          }
        } catch (error) {
          console.error('Error:', error);
        }
    
        
      }      

  return (
 <div className="w-full h-full rounded-xl shadow-md bg-white row-start-2 row-end-10 col-start-4 col-end-7 
        max-lg:text-sm max-lg:row-start-5 max-lg:row-end-8 max-lg:col-end-9 max-lg:col-start-1 p-3 ">


        <div className='w-full h-1/5 grid grid-cols-3 grid-rows-2 mb-8 gap-2'>
            <h1 className='font-semibold text-2xl self-center row-start-1 row-end-2 col-start-1 col-end-3 max-lg:text-sm'>Candidate Gruops ({candGroups.length})</h1>
            <button className='submit_btn' onClick={handleCgPopClick}>
                Create +
            </button>
              <input
                type="search"
                placeholder="Search Candidate Group"
                className="search_box col-start-1 col-end-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>        
         {/* Loading State */}
          {loading && <p>Loading Groups...</p>}
    
          {/* Error State */}
          {error && <p className="text-red-500">Error: {error}</p>}
    
          {/* Candidate List */}
          {!loading && !error && filteredcandGroups.length === 0 && (
            <p>No Candidate Gruop found.</p>
          )}
          {!loading && !error && filteredcandGroups.length > 0 && (
            <div className="h-3/4 candidate-list overflow-y-auto overflow-x-hidden">
              {filteredcandGroups.map((cg,index) => (
                <div
                  key={cg._id}  onClick={() => {setSelectedcandGroup(cg); setIsUpdateMode(true); handleCgPopClick();}}
                  className="table_row p-2 border-b hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                >
                  <div className='p-2 flex items-center justify-center bg-blue-500 h-full aspect-square rounded-md'>

                  <UsersRound color={"#ffffff"} />

                  </div>


    
                  <div className='w-2/3 h-full '>
                    <h2 className="font-medium truncate">{cg.groupName}</h2>
                    <p className="text-sm text-gray-600 truncate">
                    {cg.selectedCandidates.length} Candidates
                    </p>
                  </div>
    
                  <Trash2 size={30} color={"#ff0000"}
                    onClick={(e) => {
                      e.stopPropagation();
                      HandleCgDelete(cg._id);
                    }} />
    
                </div>
              ))}
            </div>
    
          )}   

          
      <div ref={divRef2}  className='fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10 hidden'> </div>

      <div ref={divRef1} className='fixed top-0 left-0 z-20 w-full h-full flex-col items-center justify-center hidden'>

                <EditAddGroup 
            SvUser={SvUser}
            selectedcandGroup={selectedcandGroup}
            setSelectedcandGroup={setSelectedcandGroup}
            handleCgPopClick={handleCgPopClick}
            Schedules={Schedules}
            allCands={allCands}
            handleGroupStateUpdated={handleGroupStateUpdated}
            handleGroupStateAdded={handleGroupStateAdded}
          />

      </div>
           
          

          
    </div>
  )
}

export default GroupList
