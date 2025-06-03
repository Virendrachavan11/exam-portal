import React, { useState, useEffect} from 'react';
import AddCandComp from './AddCandComp'
import CandListComp from './CandListComp'
import UploadCandComp from './UploadCandComp'

const ManageCand = ({LogedUser}) => {
    
  const SvUser = LogedUser.user

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // State for error handling

  const fetchCandidates = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/Candidates/Candidate-list/${encodeURIComponent(SvUser)}`
      );
      if (!response.ok) throw new Error('Failed to fetch candidates.');
      const data = await response.json();
      setCandidates(data); // Update candidate list
      setLoading(false);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError(error.message); // Set error message
      setLoading(false);
    }
  };

    useEffect(() => {
      fetchCandidates();
    }, []); 


    const handleCandDeleted = (idToRemove)=>{

       setCandidates((prevCand) => prevCand.filter((Cand) => Cand.emailID !== idToRemove));

    }
  
    const handleCandAdded = (newCand) => {
      setCandidates(prevCand => ({
        ...prevCand,
        newCand
      }));
      fetchCandidates();
    };

    const handleCandUpdated = (updatedCand) => {
      setCandidates(prevCand =>
        prevCand.map(cand =>
          cand.emailID === updatedCand.emailID ? updatedCand : cand
        )
      );
    };
    
  

    


  return (
    <div className='w-4/5 h-[100vh] grid grid-cols-8 grid-rows-8 p-2 gap-3 overflow-y-auto overflow-x-hidden
    max-lg:h-[200vh] max-lg:w-full max-lg:grid-rows-9 max-sm:w-full max-sm:px-4 max-lg:mt-12'>

        <h1 className='font-bold text-4xl col-start-1 col-end-9 row-start-1 row-end-2 self-center mb-1'>Manage Candidate</h1>
      
        <AddCandComp SvUser={ SvUser } handleCandAdded={handleCandAdded}/>
        <CandListComp SvUser={ SvUser } candidates={candidates || []} loading={loading} error={error} handleCandDeleted={handleCandDeleted} handleCandUpdated={handleCandUpdated}/>
        <UploadCandComp SvUser={ SvUser } handleCandAdded={handleCandAdded}/>


        
    </div>
    
  )
}

export default ManageCand
