import React, { useEffect, useState } from "react";
import { useForm,Controller} from "react-hook-form";
import { X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const AddUpdateSchedule = ({ SvUser, selectedSchedule, handleScheduleUpdated, handleSdlpopClick,handleScheduleAdded,setAllProvideExams,setSelectedSchedule}) => {
  const [exams, setExams] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  useEffect(() => {
    setAllProvideExams(exams);
  }, [exams, setAllProvideExams]);
  // const [candGroups, setCandGroups] = useState([]);
  

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
      scheduledTime: "",
      Exam: "",
    },
  });





  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(`http://localhost:3000/Manage-exam/${SvUser}`);
        if (!response.ok) throw new Error("Failed to fetch exams");
        const examData = await response.json();
        setExams(examData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExams();
  }, []);


  useEffect(() => {
    if (selectedSchedule) {
      setValue("scheduleName", selectedSchedule.scheduleName || "");
  
      if (selectedSchedule.scheduledTime) {
        const formattedDate = new Date(selectedSchedule.scheduledTime)
          .toISOString()
          .slice(0, 16); // Ensure correct format
        setValue("scheduledTime", formattedDate);
      } else {
        setValue("scheduledTime", "");
      }
  
      setValue("Exam", selectedSchedule.Exam || "");
      setValue("CameraStatus", selectedSchedule.CameraStatus || "");

      
    }
  }, [selectedSchedule, setValue]);


  
  
  

  const AddSchedule = async (formData) => {
    try {
      const response = await fetch(
        `http://localhost:3000/ExamLaunchpad/exam-schedules/Create-schedules/${SvUser}`,
        {
          method: "POST",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message||"New Schedule Added Successfully");

        if(handleScheduleAdded)
        {
          handleScheduleAdded(data.schedule)
        }
        reset();
      } else {
        toast.error(data.message || "Failed to Add Schedule");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(data.message || "An error occurred");
    }
  };

  const UpdateSchedule = async (formData, esID) => {
    try {
      const response = await fetch(
        `http://localhost:3000/ExamLaunchpad/exam-schedules/update-schedule/${SvUser}/${esID}`,
        {
          method: "PUT",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();


      if (response.ok) {
        toast.success( data.message || "Schedule Updated Successfully");
        if(handleScheduleUpdated)
        {
          handleScheduleUpdated(data.schedule)
        }
      } else {
        toast.error(data.message || "Failed to Update Schedule");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(data.message || "An error occurred");
    }
  };

  const doSubmit = async (data) => {
    const { CameraStatus, Exam, scheduledTime, scheduleName } = data;
    const formData = {
      scheduleName,
      scheduledTime,
      Exam,
      candGroups: selectedGroups,
    };

    if (selectedSchedule && selectedSchedule._id) {
      UpdateSchedule(formData, selectedSchedule._id);
    } else {
      AddSchedule(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(doSubmit)}
      className="w-2/6 aspect-square bg-white rounded-md p-4 flex flex-col justify-between max-lg:w-3/6 max-sm:h-3/4 max-sm:w-full" 
    >
      <div className="flex col-start-1 col-end-3 row-start-1 row-end-2 font-bold text-2xl items-start justify-between">
        <h2>{selectedSchedule ? "Update Schedule" : "Add Schedule"}</h2>
        <span className="font-normal cursor-pointer" onClick={() => { handleSdlpopClick(); reset(); selectedSchedule && setSelectedGroups([]); reset(); setSelectedSchedule(null)}}>
          <X />
        </span>
      </div>

      <div className="flex flex-col w-full">
        <label className="text-xs text-orange-500">Schedule Name:</label>
        <input type="text" className="form_input" {...register("scheduleName", { required: "Required" })} />
      </div>

      <div className="flex flex-col w-full">
        <p className="text-xs text-orange-500 mb-1">Time</p>
        <Controller
          name="scheduledTime"
          control={control}
          render={({ field }) => (
            <input
              type="datetime-local"
              className="form_input"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
      </div>
      


      <div className="flex flex-col w-full">
        <label className="text-xs text-orange-500">Exam:</label>
        <select className="form_input" {...register("Exam", { required: "Required" })}>
          <option value="">Select an Exam</option>
          {exams.map((exam) => (
            <option key={exam._id} value={exam._id}>{exam.examTitle}</option>
          ))}
        </select>
      </div>

  



      <button type="submit" className="bg-orange-500 text-white py-2 px-4 w-1/2 rounded-md place-self-end">Submit</button>
    </form>
  );
};

export default AddUpdateSchedule;







