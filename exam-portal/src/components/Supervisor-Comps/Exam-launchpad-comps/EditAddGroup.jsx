import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const EditAddGroup = ({SvUser, selectedcandGroup, handleGroupStateAdded,handleGroupStateUpdated, handleCgPopClick,Schedules,allCands,setSelectedcandGroup }) => {


    const [listSelectedCands, setlistSelectedCands] = useState([]);
    const [listSelectedSchedules,setlistSelectedSchedules]=useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [searchTerm1, setSearchTerm1] = useState(''); // State for search term

  
      const {
        control,
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
      } = useForm({
        defaultValues: {
          scheduleName: "",
          selectedCandidates: [],
          examschedules:[]
        },
      });


    useEffect(() => {
        if (selectedcandGroup) {

        setValue("groupName", selectedcandGroup.groupName || "");

        if (selectedcandGroup?.selectedCandidates?.length && allCands?.length) {
            const selectedCandidatesObjects = allCands.filter((cand) =>
            selectedcandGroup.selectedCandidates.includes(cand._id)
            );
            setlistSelectedCands(selectedCandidatesObjects);
        } else {
            setlistSelectedCands([]);
        }


        if (selectedcandGroup?.examschedules?.length && Schedules?.length) {
          const selectedSchduleObjects = Schedules.filter((sdl) =>
          selectedcandGroup.examschedules.includes(sdl._id)
          );
            setlistSelectedSchedules(selectedSchduleObjects);
        } else {
            setlistSelectedSchedules([]);
        }
        
        }
    }, [selectedcandGroup, setValue]); 


    const filteredcand = allCands.filter((cand) => {
      const name = cand.nameofCand || '';
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .reverse();

    const filteredSchedules = Schedules.filter((sdl) => {
      const name = sdl.scheduleName || '';
      return name.toLowerCase().includes(searchTerm1.toLowerCase());
    })
    .reverse();
    
    
    const handleCandClick = (selectedValue) => {
      const selectedCand = allCands.find((cand) => cand._id === selectedValue);
    
      if (selectedCand && listSelectedCands && !listSelectedCands.some((cand) => cand._id === selectedCand._id)) {
        setlistSelectedCands((prevCand) => [...prevCand, selectedCand]);
      }
    };
    

    const removeCand = (CandId) => {
      setlistSelectedCands((prev) => prev.filter((cand) => cand._id !== CandId));
    };


    const handlesdlClick = (selectedsdl) => {
      if (selectedsdl && listSelectedSchedules && !listSelectedSchedules.some((sdl) => sdl._id === selectedsdl._id)) {
        setlistSelectedSchedules((prevsdl) => [...prevsdl, selectedsdl]);
      }
    };
    

    const removeSdl = (sdlId) => {
      setlistSelectedSchedules((prev) => prev.filter((Sch) => Sch._id !== sdlId));
    };



    
      const AddCandGroup = async (formData) => {
        try {
          const response = await fetch(
            `http://localhost:3000/ExamLaunchpad/candidate-groups/Create-group/${SvUser}`,
            {
              method: "POST",
              body: JSON.stringify(formData),
              headers: { "Content-Type": "application/json" },
            }
          );

          const data = await response.json()
    
          if (response.ok) {
            toast.success(data.message || "New Group Added Successfully");
            if( handleGroupStateAdded)
            {
              handleGroupStateAdded(data.newGroup)
            }
            reset();
          } else {
            toast.error("Failed to Add Group");
          }
        } catch (error) {
          console.error("Error:", error);
          toast.error("An error occurred");
        }
      };
    
      const UpdateCandGroup = async (formData, cgID) => {
        try {
          const response = await fetch(
            `http://localhost:3000/ExamLaunchpad/candidate-groups/update-group/${SvUser}/${cgID}`,
            {
              method: "PUT",
              body: JSON.stringify(formData),
              headers: { "Content-Type": "application/json" },
            }
          );

          const data = await response.json()
    
          if (response.ok) {
            toast.success(data.message || "Group Updated Successfully");

            if (handleGroupStateUpdated){
              handleGroupStateUpdated(data.updatedGroup)
            }
          } else {
            toast.error("Failed to Group Schedule");
          }
        } catch (error) {
          console.error("Error:", error);
          toast.error("An error occurred");
        }
      };
    
      const doSubmit = async (data) => {
        const { groupName,selectedCandidates} = data;
        const formData = {
          groupName,
          selectedCandidates: listSelectedCands,
          examschedules: listSelectedSchedules
        };
    
        if (selectedcandGroup && selectedcandGroup._id) {
          UpdateCandGroup(formData, selectedcandGroup._id);
        } else {
          AddCandGroup(formData);
        }
      };
    
    
  return (
<form
      onSubmit={handleSubmit(doSubmit)}
      className="w-5/6 h-5/6 bg-white rounded-md p-4 grid grid-rows-10 grid-cols-2 gap-5 max-lg:w-full max-lg:h-[90vh]
                  max-sm:h-[100vh]"
    >

      <div className="flex col-start-1 col-end-3 row-start-1 row-end-2 font-bold text-2xl items-start justify-between">
        <h2>{ selectedcandGroup ? "Update Candidate Group" : "Add Candidate Group"}</h2>
        <span className="font-normal cursor-pointer" onClick={() => { handleCgPopClick(); reset(); setlistSelectedCands([]); setSelectedcandGroup(null); setlistSelectedSchedules([]) }}>
          <X />
        </span>
      </div>    

      
      <div className="flex flex-col w-full">
        <label className="text-xs text-orange-500">Group Name:</label>
        <input type="text" className="form_input" {...register("groupName", { required: "Required" })} />
      </div>

      <div className="flex flex-col w-full col-start-1 col-end-1 row-start-3 row-end-7  ">
        <label className="text-xs text-orange-500 mb-2">Choose Schedules:</label>
        <div className="border border-orange-400 rounded-md w-full h-5/6 p-2 overflow-hidden">
        <input
                type="search"
                placeholder="Search Schedules"
                className="search_box w-full mb-2 border border-orange-500"
                value={searchTerm1}
                onChange={(e) => setSearchTerm1(e.target.value)}
            />
            <div className="h-4/6 overflow-y-auto overflow-x-hidden">
              {filteredSchedules.map((sdl, index) => (


                <div
                  key={sdl._id}
                  onClick={() => handlesdlClick(sdl)}
                  className="h-2/3 table_row p-2 border-b hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                >
                  
                  <div className="w-5/6">
                    <h2 className="font-medium">{sdl.scheduleName}</h2>
                    <p className="text-sm text-gray-600">
                    {new Date(sdl.scheduledTime).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                    </p>
                  </div>
                </div>   
              ))}
            </div>
        </div>
      </div>

      <div className="flex flex-col place-self-center bg-gray-200 border border-orange-400 rounded-md p-2 w-full h-full col-start-1 col-end-2 row-start-7 row-end-11 ">
              <h1 className="text-orange-400 font-semibold mb-1">Selected Schedules</h1>
              <div className="grid grid-cols-2 auto-rows-1/5 overflow-y-auto gap-1">
                {listSelectedSchedules.map((sdl) => (
                  <div className="bg-blue-500 text-white flex justify-between p-1 rounded-md" key={sdl._id}>
                    <p>{sdl.scheduleName}</p>
                    <X className="cursor-pointer" onClick={() => removeSdl(sdl._id)} />
                  </div>
                ))}
              </div>
            </div>
            

      <div className="flex flex-col w-full col-start-2 col-end-3 row-start-2 row-end-6">
        <label className="text-xs text-orange-500 mb-2">Select Candidate:</label>
        <div className="border border-orange-400 rounded-md w-full h-5/6 p-2 overflow-hidden">
        <input
                type="search"
                placeholder="Search Candidate"
                className="search_box w-full mb-2 border border-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="h-4/6 overflow-y-auto overflow-x-hidden">
              {filteredcand.map((cand, index) => (


                <div
                  key={cand._id}
                  onClick={() => handleCandClick(cand._id)}
                  className="table_row p-2 border-b hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                >
                  
                  <img
                  src={`http://localhost:3000/${cand.photo}`} // Path to the uploaded image
                  alt={`${cand.nameofCand.substring(0, 5)}..'s photo`}
                  className='h-14 border border-orange-500 rounded-md aspect-square  object-cover mr-2'
                  />

                  <div className="w-5/6">
                    <h2 className="font-medium">{cand.nameofCand}</h2>
                    <p className="text-sm text-gray-600">{cand.emailID}</p>
                  </div>
                </div>   
              ))}
            </div>
        </div>
      </div>

      <div className="flex flex-col place-self-center bg-gray-200 border border-orange-400 rounded-md p-2 w-full h-full col-start-2 col-end-3 row-start-6 row-end-10 ">
              <h1 className="text-orange-400 font-semibold mb-1">Selected Groups</h1>
              <div className="grid grid-cols-2 auto-rows-1/5 overflow-y-auto gap-1">
                {listSelectedCands.map((Cand) => (
                  <div className="bg-blue-500 text-white flex justify-between p-1 rounded-md" key={Cand._id}>
                    <p>{Cand.nameofCand} </p>
                    <X className="cursor-pointer" onClick={() =>  removeCand(Cand._id)} />
                  </div>
                ))}
              </div>
            </div>
            

            <button type="submit" className="bg-orange-500 text-white py-2 px-4 w-1/2 rounded-md place-self-end col-start-2 col-end-3 row-start-10 row-end-11">Submit</button>


    </form>
  )
}

export default EditAddGroup
