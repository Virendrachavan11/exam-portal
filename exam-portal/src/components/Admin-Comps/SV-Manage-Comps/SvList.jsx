import React, { useState, useEffect ,useMemo} from 'react';
import { X ,Trash2 ,Building2,UsersRound,Phone,Mail} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

const CandListComp = ({Svlist,error,loading,handleSVDeleted}) => {
 
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();

  console.log(Svlist)


  const filteredSvlist = Array.isArray(Svlist)
  ? Svlist.filter(sv => {
      const name = sv.nameofsv || '';
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    }).reverse()
  : [];


  const HandleSvDelete = async (svID,emailID) => {

    const confirmDelete = window.confirm("Are you sure you want to delete this Supervisior?");
    if (!confirmDelete) return;
    
    try {
      const response = await fetch(`http://localhost:3000/ManageSV/SV-delete/${svID}/${emailID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        
        toast.success(data.messaget || "Candidate Deleted successfully!");
        

        if (handleSVDeleted)
        {
          handleSVDeleted(svID,data.deletedCandidatesCount)
        }
        
      } else {
        console.error('Failed to delete candidate');
      }
    } catch (error) {
      toast.error('Error:', error);
    }

  }


  return (
    <div className="w-full h-full rounded-xl shadow-md bg-white row-start-2 row-end-8 col-start-5 col-end-7 max-lg:text-sm p-3
                    max-lg:col-start-1 max-lg:row-start-4  max-lg:row-end-7">
     

      <div className='w-full h-1/5 grid grid-cols-3 grid-rows-2 mb-8 gap-2'>
                  <h1 className='font-semibold text-2xl self-center row-start-1 row-end-2 col-start-1 col-end-3'>All Supervisors</h1>

                    <input
                      type="search"
                      placeholder="Search Supervisor"
                      className="search_box col-start-1 col-end-4"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>        
               {/* Loading State */}
                {loading && <p>Loading Supervisor...</p>}
          
                {/* Error State */}
                {error && <p className="text-red-500">Error: {error}</p>}
          
                {/* Candidate List */}
                {!loading && !error && filteredSvlist.length === 0 && (
                  <p>No Supervisor found.</p>
                )}
                {!loading && !error && filteredSvlist.length > 0 && (
                  <div className="h-3/4 candidate-list overflow-y-auto overflow-x-hidden ">
                    {filteredSvlist.map((sv,index) => (
                      <div
                          key={sv._id}
                          className="table_row flex items-center justify-between gap-4 p-4 border-b hover:bg-gray-100 transition cursor-pointer m-2"
                        >
                          {/* Supervisor Image */}
                          <img
                            src={`http://localhost:3000/${sv.photo}`}
                            alt="Supervisor"
                            className="h-24 w-20 object-cover rounded-md border border-orange-500"
                          />

                          {/* Supervisor Info */}
                          <div className="flex-1 flex flex-col justify-center overflow-hidden">
                            <h2 className="flex items-center text-base font-semibold text-gray-800 mb-1 truncate">
                              <UsersRound size={20} className="text-blue-500 mr-2" />
                              {sv.nameofsv}
                            </h2>
                            <p className="flex items-center text-sm text-gray-600 truncate">
                              <Mail size={18} className="text-blue-500 mr-2" />
                              {sv.emailID}
                            </p>
                            <p className="flex items-center text-sm text-gray-600 truncate mt-1">
                              <Phone size={18} className="text-blue-500 mr-2" />
                              {sv.ContactNumber}
                            </p>
                            <p className="flex items-center text-sm text-gray-600 truncate mt-1">
                              <Building2 size={18} className="text-blue-500 mr-2" />
                              {sv.orgName}
                            </p>
                          </div>

                          {/* Delete Icon */}
                          <Trash2
                            size={26}
                            className="text-red-600 hover:text-red-800 transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              HandleSvDelete(sv._id, sv.emailID);
                            }}
                          />
                        </div>
                    ))}
                  </div>
          
                )} 
    </div>
  );
};

export default CandListComp;
