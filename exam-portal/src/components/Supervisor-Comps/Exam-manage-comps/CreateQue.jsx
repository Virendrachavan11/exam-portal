import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';

const CreateQue = ({ examId, examName, updatestatus, udQue, handleQueAdded , handleUpdateQuestion}) => {
  const [update, setUpdate] = useState(false);
  const [preview, setPreview] = useState(null); // For image preview

  useEffect(() => {
    setUpdate(updatestatus);
  }, [updatestatus]);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      Question: "",
      QueTrans: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      option1t: "",
      option2t: "",
      option3t: "",
      option4t: "",
      ans: "",
      photo:""
    },
  });

  useEffect(() => {
    if (updatestatus && udQue) {
      setValue('Question', udQue.Question);
      setValue('QueTrans', udQue.QueTrans);
      setValue('option1', udQue.option1);
      setValue('option2', udQue.option2);
      setValue('option3', udQue.option3);
      setValue('option4', udQue.option4);
      setValue('option1t', udQue.option1t);
      setValue('option2t', udQue.option2t);
      setValue('option3t', udQue.option3t);
      setValue('option4t', udQue.option4t);
      setValue('ans', Number(udQue.ans));
  
      // If the question has an existing photo, set it for preview
      if (udQue.photo) {
        setPreview(`http://localhost:3000/${udQue.photo}`); // Adjust based on your image path
      }
    }
  }, [updatestatus, setValue, udQue]);


  const AddQuestion = async (examId, formData) => {
    
    try {
      const response = await fetch(`http://localhost:3000/Manage-exam/${examId}/questions`, {
        method: 'POST',
        body: formData, 
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Question Added successfully");
      
        if (handleQueAdded) {
          handleQueAdded(data.newQue);
        }
    

      } else {
        console.error('Failed to Add Question');
        toast.error(rs_data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    }
    reset();
  };

  const doSubmit = async (data) => {
    const { Question, QueTrans, option1, option2, option3, option4, option1t, option2t, option3t, option4t, ans, photo } = data;

    const formData = new FormData();
    formData.append("Question", Question);
    formData.append("QueTrans", QueTrans);
    formData.append("option1", option1);
    formData.append("option2", option2);
    formData.append("option3", option3);
    formData.append("option4", option4);
    formData.append("option1t", option1t);
    formData.append("option2t", option2t);
    formData.append("option3t", option3t);
    formData.append("option4t", option4t);
    formData.append("ans", ans);
    if (photo && photo[0]) {
      formData.append("photo", photo[0]); // Append image if uploaded
    }

    if (update) {
      try {
        const response = await fetch(`http://localhost:3000/Manage-exam/update/${examId}/questions/${udQue._id}`, {
          method: 'PUT',
          body: formData, // Don't set Content-Type for FormData
        });
    
        const data = await response.json(); // Make sure to await this
    
        if (response.ok) {


          toast.success(data.message || "Question updated successfully");

            if (handleUpdateQuestion) {
              console.log(data.message)
              handleUpdateQuestion(data.updatedQuestion);
            }

    
        } else {
          console.error("❌ Failed to Update Question:", data.message || "Unknown error");
          toast.error(data.message || "Failed to update question");
        }
      } catch (error) {
        console.error("❗ Error while updating question:", error);
        toast.error("An error occurred while updating the question");
      }
    } else {
      // Call AddQuestion with formData
      AddQuestion(examId, formData);
    }
    
  };

  const handleImagePreview = (event) => {
    const file = event.target.files[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const onError = (errors) => {
    const firstError = Object.values(errors)[0];
    if (firstError) {
      toast.error(firstError.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(doSubmit, onError)}
      className='w-full h-full bg-white rounded-xl grid grid-cols-6 grid-rows-6 gap-2 p-4 shadow-md
                  max-md:grid-cols-4 max-md:grid-rows-8'>
      
      <div className="row-start-1 row-end-2 col-start-1 col-end-7 text-xl font-semibold max-md:col-end-5" >
        <span className="mr-2">Add Question in</span>"{examName}"
      </div>
      

      <div className="row-start-2 row-end-7 col-start-1 col-end-3 text-xl font-semibold bg-gray-50
       border-orange-500 border-2 rounded-lg p-2 max-md:flex max-md:row-end-4 max-md:col-end-5">
        {preview ? (
          <img src={preview} alt="Preview" className="h-5/6 w-full rounded-lg mb-1 object-contain max-md:h-full max-md:w-1/3" />
        ) : (
          <p className="h-5/6 w-full flex items-center justify-center text-xl max-md:h-full max-md:w-1/3">+ Add Photo</p>
        )}

        <input type="file" accept="image/*" className="form_input h-1/6 w-full rounded-lg border bg-white 
          max-md:h-full max-md:w-2/3 text-xs"
          {...register('photo')} onChange={handleImagePreview} />
      </div>

      <input type="text" {...register('Question', { required: 'Question is required' })} placeholder="Add Question"
        className='form_input w-full h-full place-self-center px-1 row-start-2 row-end-3 col-start-3 col-end-7
        max-md:row-start-4 max-md:row-end-5 max-md:col-start-1 max-md:col-end-5' />

        <input type="text" {...register("QueTrans", { required: "Question Translation is required" })}
        placeholder="Enter Question Translation" 
        className='form_input w-full h-full place-self-center row-start-3 row-end-4 col-start-3 col-end-7
        max-md:row-start-5 max-md:row-end-6 max-md:col-start-1 max-md:col-end-5' />

        {["option1", "option2", "option3", "option4"].map((opt, index) => (
        <input key={opt} type="text" {...register(opt, { required: `Option ${index + 1} is required` })}
          placeholder={`Option ${index + 1}`} className='form_input w-full h-full place-self-center' />
      ))}

            {["option1t", "option2t", "option3t", "option4t"].map((opt, index) => (
        <input key={opt} type="text" {...register(opt, { required: `Option ${index + 1} Translation is required` })}
          placeholder={`Option ${index + 1} Translated`} className='form_input w-full h-full place-self-center' />
      ))}

      <select {...register('ans', { required: "Answer is required" })}
        className='form_select_input w-full h-full place-self-center row-start-6 row-end-7 col-start-3 col-end-5
                    max-md:row-start-8 max-md:row-end-9 max-md:col-start-1 max-md:col-end-3'>
        <option value="">Select Answer</option>
        {[1, 2, 3, 4].map(num => (
          <option key={num} value={num}>Answer : Option {num}</option>
        ))}
      </select>


      <button type="submit" className='update_btn w-full h-full place-self-center px-3 row-start-6 row-end-7 col-start-5 col-end-7
      max-md:row-start-8 max-md:row-end-9 max-md:col-start-3 max-md:col-end-5'>
        
        {update==true? <span>Update Question </span>:<span>Add Question </span>}
      </button>  




      {/* 

*/}


    </form>
  );
};
             
export default CreateQue;
