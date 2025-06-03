import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const UpdateExamInfo = ({ examId, exam, refreshExam }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (exam) {
      reset({
        examTitle: exam.examTitle || "",
        examType: exam.examType || "",
        examDesc: exam.examDesc || "",
        examDuration: exam.examDuration || "",
        MarkPerQue: exam.MarkPerQue || "",
        examlang: exam.examlang || "",
      }, { keepDirtyValues: true }); // Keeps user inputs even if state updates
    }
  }, [exam]);


  // Handle form submission
  const updateExam = async (data) => {
    try {
      const response = await fetch(`http://localhost:3000/Manage-exam/update/${examId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        refreshExam()
        toast.success("Exam Updated Successfully");
      } else {
        console.error("Failed to update exam");
        toast.error("Failed to update exam");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(updateExam)}
      className="bg-white w-full h-full grid grid-cols-4 grid-rows-5 gap-3 shadow-md rounded-xl row-start-2 row-end-6 col-start-1 col-end-6 p-3
                 max-lg:col-start-1 max-lg:col-end-9 max-lg:row-end-5 -z-20"
    >
  

      <div className="font-semibold text-xl w-full mb-2 row-start-1 row-end-2 col-start-1 col-end-5">Information</div>

      <div className="flex flex-col row-start-2 row-end-3 col-start-1 col-end-3 place-self-center w-full">
        <label htmlFor="ExamName" className="text-xs text-orange-500">Exam Name: </label>
        <input
          type="text"
          id="ExamName"
          className="form_input"
          {...register("examTitle", { required: "Exam Name is required" })}
        />
        {errors.examTitle && <p className="text-red-500 text-xs">{errors.examTitle.message}</p>}
      </div>

      <div className="flex flex-col row-start-2 row-end-3 col-start-3 col-end-5 place-self-center w-full">
        <label htmlFor="ExamType" className="text-xs text-orange-500">Exam Type: </label>
        <input
          type="text"
          id="ExamType"
          className="form_input"
          {...register("examType", { required: "Exam Type is required" })}
        />
        {errors.examType && <p className="text-red-500 text-xs">{errors.examType.message}</p>}
      </div>

      <div className="flex flex-col row-start-3 row-end-4 col-start-1 col-end-5 place-self-center w-full">
        <label htmlFor="Description" className="text-xs text-orange-500">Description: </label>
        <input
          type="text"
          id="Description"
          className="form_input"
          {...register("examDesc", { required: "Description is required" })}
        />
        {errors.examDesc && <p className="text-red-500 text-xs">{errors.examDesc.message}</p>}
      </div>

      <div className="flex flex-col row-start-4 row-end-5 col-start-1 col-end-3 place-self-center w-full">
        <label htmlFor="Duration" className="text-xs text-orange-500">Duration in Minutes: </label>
        <input
          type="number"
          id="Duration"
          className="form_input"
          {...register("examDuration", { required: "Exam Time is required" })}
        />
        {errors.examTime && <p className="text-red-500 text-xs">{errors.examDuration.message}</p>}
      </div>

      <div className="flex flex-col row-start-4 row-end-5 col-start-3 col-end-5 place-self-center w-full">
        <label htmlFor="mpq" className="text-xs text-orange-500">Marks per question: </label>
        <input
          type="number"
          id="mpq"
          className="form_input"
          {...register("MarkPerQue", { required: "Marks per question is required" })}
        />
        {errors.MarkPerQue && <p className="text-red-500 text-xs">{errors.MarkPerQue.message}</p>}
      </div>

      <div className="flex flex-col row-start-5 row-end-6 col-start-1 col-end-4 place-self-center w-full">
        <label htmlFor="examlang" className="text-xs text-orange-500">Language: </label>
        <input
          type="text"
          id="examlang"
          className="form_input"
          {...register("examlang", { required: "Language is required" })}
        />
        {errors.examlang && <p className="text-red-500 text-xs">{errors.examlang.message}</p>}
      </div>

      <button type="submit" className="update_btn h-full text-lg place-self-center w-full max-lg:text-sm ">
        Update
      </button>
    </form>
  );
};

export default UpdateExamInfo;
