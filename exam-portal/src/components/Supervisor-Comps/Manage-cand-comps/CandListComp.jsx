import React, { useState, useEffect ,useMemo} from 'react';
import { useSelector,shallowEqual} from 'react-redux';
import { FolderCog, Trash2,X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

const CandListComp = ({ SvUser,candidates,error,loading,handleCandDeleted,handleCandUpdated }) => {
 
  const [selectedCandidate, setSelectedCandidate] = useState(null); // For selected candidate details
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  
  const [preview, setPreview] = useState(null); // For image preview

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();

  const createdBy = SvUser



  // Set form values when a candidate is selected
  useEffect(() => {
    if (selectedCandidate) {
      setValue("nameofCand", selectedCandidate.nameofCand);
      setValue("rollNo", selectedCandidate.rollNo);
      setValue("photo", selectedCandidate.photo);
      setValue("emailID", selectedCandidate.emailID);
    }
  }, [selectedCandidate, setValue]);

  // Filter candidates based on the search term
  const filteredCandidates = Array.isArray(candidates)
  ? candidates.filter(candidate => {
      const name = candidate.nameofCand || '';
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    }).reverse()
  : [];


  const HandleCandDelete = async (emailID) => {

    const confirmDelete = window.confirm("Are you sure you want to delete this schedule?");
    if (!confirmDelete) return;
    
    try {
      const response = await fetch(`http://localhost:3000/Candidates/Delete-Candidate/${emailID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        
        toast.success(data.message || "Candidate Deleted successfully!");

        if (handleCandDeleted)
        {
          handleCandDeleted(emailID)
        }
        
      } else {
        console.error('Failed to delete candidate');
      }
    } catch (error) {
      toast.error('Error:', error);
    }

  }

  const handleImagePreview = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const UpdateCand = async (data) => {
    const { emailID, nameofCand, rollNo, photo } = data;
    
    const formData = new FormData();
    formData.append("nameofCand", nameofCand);
    formData.append("rollNo", rollNo);
    if (photo && photo[0]) {
        formData.append("photo", photo[0]);
    }

    console.log(emailID)

    try {
        const response = await fetch(`http://localhost:3000/Candidates/Update-Candidate/${emailIDD}`, {
            method: "PUT",
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            
            toast.success(data.message || "Candidate updated successfully!");
            if(handleCandUpdated)
            {
              handleCandUpdated(data.updatedCandidate)
            }
            reset();
            setSelectedCandidate(null)
            
        } else {
            toast.error(`Error: ${data.message}`);
        }
    } catch (error) {
        toast.error(`Error: ${error.message}`);
    }

    reset({
        nameofCand: selectedCandidate.nameofCand,
        rollNo: selectedCandidate.rollNo,
        photo: selectedCandidate.photo,
    });
};

  return (
    <div className="w-full h-full rounded-xl shadow-md bg-white row-start-2 row-end-9 col-start-6 col-end-9 
    max-lg:text-sm max-lg:row-start-7 max-lg:row-end-12 max-lg:col-end-9 max-lg:col-start-1 p-3">
      {/* Header with Search */}
      <div className="w-full h-[10%] flex items-center justify-between mb-4 
                      max-lg:flex-col max-lg:items-start max-lg:h-1/4">
        <h1 className="font-semibold text-xl">Candidates</h1>
        <input
          type="search"
          placeholder="Search Candidate"
          className="search_box h-2/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {loading && <p>Loading candidates...</p>}

      {/* Error State */}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Candidate List */}
      {!loading && !error && filteredCandidates.length === 0 && (
        <p>No candidates found.</p>
      )}
      {!loading && !error && filteredCandidates.length > 0 && (
        <div className="h-5/6 candidate-list overflow-y-auto overflow-x-hidden
                        ">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate._id}
              className=" table_row p-1 border-b hover:bg-gray-100 cursor-pointer flex items-center justify-between"
              onClick={() => setSelectedCandidate(candidate)}
            >
              <img
                src={`http://localhost:3000/${candidate.photo}`} // Path to the uploaded image
                alt={`${candidate.nameofCand}'s photo`}
                className='h-14 border border-orange-500 rounded-md aspect-square object-cover max-[450px]:h-9'
              />

              <div className='w-1/2 h-full'>
                <h2 className="font-medium max-[450px]:text-[10px]">{candidate.nameofCand}</h2>
                <p className="text-sm text-gray-600 max-[450px]:text-[10px]">{candidate.emailID}</p>
              </div>

              <Trash2 size={30} color={"#ff0000"}
                onClick={(e) => {
                  e.stopPropagation();
                  HandleCandDelete(candidate.emailID);
                }} />

            </div>
          ))}
        </div>
      )}

      {/* Selected Candidate Modal */}

      {selectedCandidate && (
        <>
          {/* Overlay */}
          <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>
          {/* Modal */}
          <div className="fixed top-0 left-0 z-20 w-full h-full flex flex-col items-center justify-center">
            <div className="w-1/2 h-3/6 bg-white shadow-lg rounded-lg p-2 max-xl:w-11/12
            max-md:h-5/6 ">

              <div className="w-full pb-3 flex justify-between items-start text-black font-bold text-2xl">
                <h2>{selectedCandidate.nameofCand}</h2>

              <X color='#000000' className="font-normal cursor-pointer text-red-500"
                  onClick={() => setSelectedCandidate(null)}/>
              </div>

              <form onSubmit={handleSubmit(UpdateCand)} className='h-5/6 grid grid-cols-3 grid-rows-3 gap-2
              max-md:grid-cols-2 max-md:grid-rows-4 max-md:h-[90%]'>

                {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className='w-full h-full row-start-1 row-end-4 col-start-1 col-end-2
                      border border-orange-500 rounded-md object-cover '
                    />
                  ) : (
                    <img src={`http://localhost:3000/${selectedCandidate.photo}`} alt="" 
                    className='w-full h-full row-start-1 row-end-4 col-start-1 col-end-2
                    border border-orange-500 rounded-md object-cover 
                    max-md:row-start-1 max-md:row-end-3 max-md:col-start-1 max-md:col-end-3 max-md:object-contain'/>
                  )}

                <h1 className='justify-self-start self-center font-semibold'>Name of Candidate:</h1>

                <input
                   placeholder="Name of Candidate"
                   className='form_input h-1/2 w-full justify-self-start self-center'
                  {...register("nameofCand", { required: "Name is required" })}
                />
                {errors.nameofCand && <span>{errors.nameofCand.message}</span>}
                
                <h1 className='justify-self-start self-center font-semibold'>Roll Number :</h1>
        
                <input
                  placeholder="Roll Number"
                  className='form_input h-1/2 justify-self-start self-center w-full '
                  {...register("rollNo", {
                    required: "Roll Number is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Roll Number must be numeric",
                    },
                  })}
                />
                {errors.rollNo && <span>{errors.rollNo.message}</span>}
               

                <div>
                  <h1 className='h-1/2 font-semibold'>Upload New Photo :</h1>
                  <input
                    type="file"
                    accept="image/*"
                    className="form_input h-1/2 w-full rounded-lg border bg-white justify-self-start self-end"
                    {...register('photo')}
                    onChange={handleImagePreview} 

                  />
                </div>


                <button type="submit" className='update_btn justify-self-start self-end h-2/3 w-full'>Update Candidate</button>
              </form>

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CandListComp;
