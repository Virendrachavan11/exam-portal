import React, { useMemo} from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useForm } from "react-hook-form"
import toast, { Toaster } from 'react-hot-toast';

const CreateExam = ({SvUser,handleExamAdded}) => {



    const {
        register,
        handleSubmit,
        reset,
        formState:{ errors, isSubmitting },
      } = useForm();

      const AddExam = async (fdata) => {
        const { examTitle, examDesc } = fdata;
        const data = { examTitle, examDesc, createdby: SvUser };
    
        try {
            const response = await fetch("http://localhost:3000/Manage-exam/AddExam", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
    
            const rs_data = await response.json();
    
            if (response.ok) {
                toast.success(rs_data.message);
                
                if(handleExamAdded)
                {
                    handleExamAdded(rs_data.exam)
                }
            } else {
                toast.error(rs_data.message || "Failed to add exam");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong!");
        }
    };
    
  return (

    <form onSubmit={handleSubmit(AddExam)} className='flex w-full justify-between items-center py-3 px-5
        max-xl:flex-col max-xl:gap-2'>
    
             
          <input 
          type="text" 
          {...register('examTitle', { required: true })} 
          placeholder="Add Name"
          className=' special_input h-14 w-2/6 p-3 ml-1 max-xl:w-full' /> 

          <input 
          type="text" 
          {...register('examDesc', { required: true })} 
          placeholder="Add Description"
          className='special_input h-14 w-3/6 p-3 max-xl:w-full'/>

          <button type="submit" className='submit_btn p-3 max-xl:self-end '>
          Create New Exam</button>
          <button type="submit"></button>

      </form>
    
   
  )
}

export default CreateExam
